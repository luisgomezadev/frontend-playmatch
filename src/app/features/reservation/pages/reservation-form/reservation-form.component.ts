import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { FieldDetailCardComponent } from '@features/field/components/field-detail-card/field-detail-card.component';
import { Field } from '@features/field/interfaces/field';
import { FieldService } from '@features/field/services/field.service';
import {
  ConfirmedReservation,
  Reservation,
  ReservationRequest,
} from '@reservation/interfaces/reservation';
import { ReservationService } from '@reservation/services/reservation.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoadingFullComponent } from '@shared/components/loading/loading-full/loading-full.component';
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
    LoadingFullComponent,
    FieldDetailCardComponent,
    CommonModule,
    ModalComponent
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

  hours = Array.from({ length: 12 }, (_, i) => i + 1);

  isOpen = signal(false);

  ngOnInit(): void {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    today.setDate(today.getDate());

    this.today = today.toISOString().split('T')[0];

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    this.formReservation = this.formBuilder.group({
      reservationDate: [this.today, Validators.required],
      hour: ['', Validators.required], // nuevo control para hora
      ampm: ['AM', Validators.required], // nuevo control para AM/PM
      hours: [1, [Validators.required, Validators.min(1), Validators.max(3)]]
    });

    this.fieldId = +this.route.snapshot.paramMap.get('id')!;

    this.getField();
  }

  get startTime(): string {
    const hour = this.formReservation.get('hour')?.value;
    const ampm = this.formReservation.get('ampm')?.value;
    if (!hour || !ampm) return '';

    let h = Number(hour);
    if (ampm === 'PM' && h < 12) {
      h += 12;
    } else if (ampm === 'AM' && h === 12) {
      h = 0;
    }

    return `${h.toString().padStart(2, '0')}:00`;
  }

  goBack(): void {
    this.location.back();
  }

  getField(): void {
    this.fieldService.getFieldById(this.fieldId).subscribe({
      next: field => {
        this.field = field;
      }
    });
  }

  verifyReservation() {
    if (this.formReservation.valid) {
      this.loading = true;

      const reservationData: ReservationRequest = {
        reservationDate: this.formReservation.value.reservationDate,
        startTime: this.startTime,
        hours: this.formReservation.value.hours,
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
    }
  }

  onClosed() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }

  closeCalendar() {
    this.showCalendar = false;
  }

  cancelReservation() {
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
}
