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
  showModal = false;
  showCalendar = false;
  verifiedReservation = false;
  today = '';
  loading = false;
  loadingReservation = false;
  availableHours: TimeSlot[] = [];
  selectedHours: TimeSlot[] = [];

  isOpen = signal(false);

  ngOnInit(): void {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    today.setDate(today.getDate());
    this.today = today.toISOString().split('T')[0];

    this.authService.currentUser$.subscribe(user => {
      if (user) this.user = user;
    });

    this.formReservation = this.formBuilder.group({
      reservationDate: [this.today, Validators.required]
    });

    this.fieldId = +this.route.snapshot.paramMap.get('id')!;
    this.getField();
    this.getAvailableHours();

    this.formReservation.get('reservationDate')?.valueChanges.subscribe(() => {
      this.getAvailableHours();
    });
  }

  get startTime(): string {
    if (this.selectedHours.length === 0) return '';
    return this.to24h(this.selectedHours[0].start);
  }

  get totalHours(): number {
    return this.selectedHours.length;
  }

  goBack(): void {
    this.location.back();
  }

  getField(): void {
    this.fieldService.getFieldById(this.fieldId).subscribe({
      next: field => this.field = field
    });
  }

  getAvailableHours(): void {
    this.selectedHours = [];
    const date = this.formReservation.get('reservationDate')?.value;
    if (this.fieldId && date) {
      this.reservationService.getHoursAvailability(this.fieldId, date).subscribe({
        next: timeSlots => {
          const ranges = this.generateHourRanges(timeSlots);
          this.availableHours = this.filterPastHours(ranges);
        },
        error: () => {
          this.availableHours = [];
        }
      });
    } else {
      this.availableHours = [];
    }
  }

  private filterPastHours(hours: TimeSlot[]): TimeSlot[] {
    const selectedDate = this.getSelectedDate();
    const now = new Date();
    const isToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();

    if (!isToday) return hours;

    return hours.filter(h => this.toDateFromFormatted(h.start).getTime() > now.getTime());
  }

  private generateHourRanges(timeSlots: { start: string; end: string }[]): TimeSlot[] {
    const ranges: TimeSlot[] = [];

    timeSlots.forEach(slot => {
      let start = this.toHourOnlyDate(slot.start);
      const end = this.toHourOnlyDate(slot.end);

      while (start.getTime() + 60 * 60 * 1000 <= end.getTime()) {
        const next = new Date(start.getTime());
        next.setHours(next.getHours() + 1);

        ranges.push({
          start: this.formatTime(start),
          end: this.formatTime(next)
        });

        start = next;
      }
    });

    return ranges;
  }

  private toHourOnlyDate(time: string): Date {
    const [hours] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, 0, 0, 0);
    return date;
  }

  private toDateFromFormatted(time: string): Date {
    const [hm, suffix] = time.split(' ');
    const [hours, minutes] = hm.split(':').map(Number);
    let h = hours % 12;
    if (suffix === 'PM') h += 12;
    const date = new Date();
    date.setHours(h, minutes, 0, 0);
    return date;
  }

  private formatTime(date: Date): string {
    const h = date.getHours();
    const m = date.getMinutes();
    const suffix = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 === 0 ? 12 : h % 12;
    return `${displayHours}:${m.toString().padStart(2, '0')} ${suffix}`;
  }

  toggleHourSelection(hour: TimeSlot) {
    const index = this.selectedHours.findIndex(h => h.start === hour.start && h.end === hour.end);

    if (index > -1) {
      // Si quitamos una hora, quitamos todas las horas posteriores para mantener continuidad
      this.selectedHours = this.selectedHours.slice(0, index);
    } else {
      if (this.selectedHours.length === 0) {
        this.selectedHours.push(hour);
      } else {
        const all = [...this.selectedHours, hour].sort(
          (a, b) => this.toDateFromFormatted(a.start).getTime() - this.toDateFromFormatted(b.start).getTime()
        );

        // Validar continuidad
        let isContinuous = true;
        for (let i = 1; i < all.length; i++) {
          const prevEnd = this.toDateFromFormatted(all[i - 1].end).getTime();
          const currStart = this.toDateFromFormatted(all[i].start).getTime();
          if (currStart !== prevEnd) {
            isContinuous = false;
            break;
          }
        }

        if (isContinuous && all.length <= 3) this.selectedHours = all;
      }
    }
  }


  verifyReservation() {
    if (this.formReservation.valid && this.selectedHours.length > 0) {
      this.loading = true;
      const reservationData: ReservationRequest = {
        reservationDate: this.formReservation.value.reservationDate,
        startTime: this.startTime,
        hours: this.totalHours,
        userId: this.user.id,
        fieldId: this.fieldId
      };

      this.reservationService.getReservationAvailability(reservationData).subscribe({
        next: (data: ConfirmedReservation) => {
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
    } else {
      this.formReservation.markAllAsTouched();
      if (this.selectedHours.length === 0) {
        this.alertService.notify('Selecciona alguna hora', 'Debes seleccionar al menos una hora para poder reservar.', 'warning');
      }
    }
  }

  private getSelectedDate(): Date {
    const dateStr = this.formReservation.value.reservationDate; // "YYYY-MM-DD"
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // mes es 0-index
  }

  onClosed() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }

  closeCalendar() {
    this.showCalendar = false;
  }

  cancelReservation() {
    this.onClosed();
    this.verifiedReservation = false;
    this.confirmedReservation = null;
  }

  confirmReservation() {
    if (this.confirmedReservation) {
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
          this.alertService.success('Reserva creada', `Has creado una reserva para el día ${reservationRequest.reservationDate}.`);
          this.router.navigate(['/dashboard/reservation/list']);
        },
        error: err => {
          this.loadingReservation = false;
          this.alertService.error('Error', err.error?.message || 'Algo salió mal');
        }
      });
    }
  }

  private to24h(time: string): string {
    const [hm, suffix] = time.split(' ');
    const [hours, minutes] = hm.split(':').map(Number);
    let h = hours % 12;
    if (suffix === 'PM') h += 12;
    return `${h.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
