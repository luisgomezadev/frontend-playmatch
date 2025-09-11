import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { FieldInfoComponent } from '@features/field/components/field-info/field-info.component';
import { Field } from '@features/field/interfaces/field';
import { FieldService } from '@features/field/services/field.service';
import {
  ConfirmedReservation,
  Reservation,
  ReservationRequest,
  TimeSlot
} from '@reservation/interfaces/reservation';
import { ReservationService } from '@reservation/services/reservation.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';
import { User } from '@user/interfaces/user';
import {
  to24h,
  generateHourRanges,
  filterPastHours,
  toDateFromFormatted
} from '@reservation/utils/reservation-utils';

interface DayItem {
  date: Date;
  formatted: string;
  weekday: string;    // Lunes, Martes...
  dayNumber: number;  // 1, 2, 3...
  monthName: string;  // Enero, Febrero...
}

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    ButtonComponent,
    RouterModule,
    ReactiveFormsModule,
    TimeFormatPipe,
    LoadingComponent,
    FieldInfoComponent,
    CommonModule,
    ModalComponent,
    LayoutComponent
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss'
})
export class ReservationFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly reservationService = inject(ReservationService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly fieldService = inject(FieldService);

  user!: User;
  fieldId!: number;
  formReservation!: FormGroup;
  confirmedReservation!: ConfirmedReservation | null;
  reservations: Reservation[] = [];
  field!: Field;
  today = '';
  loading = false;
  loadingHours = false;
  loadingReservation = false;
  availableHours: TimeSlot[] = [];
  selectedHours: TimeSlot[] = [];
  verifiedReservation = false;
  next20Days: DayItem[] = [];
  selectedDate: Date | null = null;

  isOpen = signal(false);

  ngOnInit(): void {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    this.today = today.toISOString().split('T')[0];

    this.authService.currentUser$.subscribe(user => {
      if (user) this.user = user;
    });

    this.formReservation = this.formBuilder.group({
      reservationDate: [this.today, Validators.required]
    });

    this.fieldId = +this.route.snapshot.paramMap.get('id')!;
    this.getField();

    this.formReservation.get('reservationDate')?.valueChanges.subscribe(() => {
      this.getAvailableHours();
    });

    this.generateNext20Days();
  }

  get startTime(): string {
    return this.selectedHours.length ? to24h(this.selectedHours[0].start) : '';
  }

  get totalHours(): number {
    return this.selectedHours.length;
  }

  goBack(): void {
    this.location.back();
  }

  getField(): void {
    this.fieldService.getFieldById(this.fieldId).subscribe({
      next: field => (this.field = field)
    });
  }

  generateNext20Days() {
    this.next20Days = [];
    const today = new Date();

    for (let i = 0; i < 20; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const weekday = d.toLocaleDateString('es-ES', { weekday: 'long' });
      const dayNumber = d.getDate(); // 1,2,3...
      const monthName = d.toLocaleDateString('es-ES', { month: 'long' });

      this.next20Days.push({
        date: d,
        formatted: d.toISOString().split('T')[0],
        weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
        dayNumber,
        monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      });
    }

    if (this.next20Days.length > 0) {
      this.selectedDate = this.next20Days[0].date;
      this.formReservation.get('reservationDate')?.setValue(this.next20Days[0].formatted);
    }
  }

  selectDate(day: DayItem) {
    this.selectedDate = day.date;
    this.formReservation.get('reservationDate')?.setValue(day.formatted);
  }

  getAvailableHours(): void {
    this.selectedHours = [];
    const dateStr = this.formReservation.get('reservationDate')?.value;
    if (!this.fieldId || !dateStr) {
      this.availableHours = [];
      return;
    }
    this.loadingHours = true;
    this.reservationService.getHoursAvailability(this.fieldId, dateStr).subscribe({
      next: timeSlots => {
        const ranges = generateHourRanges(timeSlots);
        this.availableHours = filterPastHours(ranges, this.getSelectedDate());
        this.loadingHours = false;
      },
      error: () => {
        this.loadingHours = false;
        this.availableHours = [];
      }
    });
  }

  toggleHourSelection(hour: TimeSlot) {
    const index = this.selectedHours.findIndex(h => h.start === hour.start && h.end === hour.end);
    if (index > -1) {
      this.selectedHours = this.selectedHours.slice(0, index);
    } else {
      if (!this.selectedHours.length) {
        this.selectedHours.push(hour);
      } else {
        const all = [...this.selectedHours, hour].sort(
          (a, b) => toDateFromFormatted(a.start).getTime() - toDateFromFormatted(b.start).getTime()
        );
        let isContinuous = true;
        for (let i = 1; i < all.length; i++) {
          if (
            toDateFromFormatted(all[i].start).getTime() !==
            toDateFromFormatted(all[i - 1].end).getTime()
          ) {
            isContinuous = false;
            break;
          }
        }
        if (isContinuous && all.length <= 3) this.selectedHours = all;
      }
    }
  }

  verifyReservation() {
    if (!this.formReservation.valid || !this.selectedHours.length) {
      this.formReservation.markAllAsTouched();
      if (!this.selectedHours.length)
        this.alertService.notify(
          'Selecciona alguna hora',
          'Debes seleccionar al menos una hora para poder reservar.',
          'warning'
        );
      return;
    }

    this.loading = true;
    const reservationData: ReservationRequest = {
      reservationDate: this.formReservation.value.reservationDate,
      startTime: this.startTime,
      hours: this.totalHours,
      userId: this.user.id,
      fieldId: this.fieldId
    };

    this.reservationService.getReservationAvailability(reservationData).subscribe({
      next: data => {
        this.loading = false;
        this.confirmedReservation = data;
        this.isOpen.set(true);
      },
      error: err => {
        this.loading = false;
        this.confirmedReservation = null;
        this.alertService.error('Error al hacer reserva', err.error?.message || 'Algo salió mal');
      }
    });

    this.verifiedReservation = true;
  }

  private getSelectedDate(): Date {
    const [year, month, day] = this.formReservation.value.reservationDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  onClosed() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }

  cancelReservation() {
    this.onClosed();
    this.verifiedReservation = false;
    this.confirmedReservation = null;
  }

  confirmReservation() {
    if (!this.confirmedReservation) return;

    this.loadingReservation = true;
    const reservationRequest: ReservationRequest = {
      userId: this.confirmedReservation.user?.id,
      fieldId: this.confirmedReservation.field?.id,
      reservationDate: this.confirmedReservation.reservationDate,
      startTime: this.confirmedReservation.startTime,
      hours: this.confirmedReservation.hours
    };

    this.reservationService.createReservation(reservationRequest).subscribe({
      next: () => {
        this.loadingReservation = false;
        this.alertService.success(
          'Reserva creada',
          `Has creado una reserva para el día ${reservationRequest.reservationDate}.`
        );
        this.router.navigate(['/dashboard/reservation/list']);
      },
      error: err => {
        this.loadingReservation = false;
        this.alertService.error('Error', err.error?.message || 'Algo salió mal');
      }
    });
  }
}
