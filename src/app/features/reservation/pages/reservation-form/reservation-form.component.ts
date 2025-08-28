import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { ReservationCalendarComponent } from '@reservation/components/reservation-calendar/reservation-calendar.component';
import {
  ConfirmedReservation,
  Reservation,
  ReservationRequest,
  StatusReservation
} from '@reservation/interfaces/reservation';
import { ReservationService } from '@reservation/services/reservation.service';
import { ButtonActionComponent } from '@shared/components/button-action/button-action.component';
import { LoadingFullComponent } from '@shared/components/loading/loading-full/loading-full.component';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';
import { User } from '@user/interfaces/user';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    ButtonActionComponent,
    RouterModule,
    ReactiveFormsModule,
    TimeFormatPipe,
    LoadingFullComponent,
    ReservationCalendarComponent,
    CommonModule
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss'
})
export class ReservationFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private reservationService = inject(ReservationService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  user!: User;
  fieldId!: number;
  formReservation!: FormGroup;
  confirmedReservation!: ConfirmedReservation | null;
  reservations: Reservation[] = [];
  showModal = false;
  showCalendar = false;
  verifiedReservation = false;
  today = '';
  loading = false;
  loadingReservation = false;

  hours = Array.from({ length: 12 }, (_, i) => i + 1);

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

    this.formReservation = this.fb.group({
      reservationDate: [this.today, Validators.required],
      hour: ['', Validators.required], // nuevo control para hora
      ampm: ['AM', Validators.required], // nuevo control para AM/PM
      hours: [1, [Validators.required, Validators.min(1), Validators.max(3)]]
    });

    this.fieldId = +this.route.snapshot.paramMap.get('id')!;

    this.getReservations();
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

  getReservations() {
    this.loading = true;
    this.reservationService
      .getReservationsByFieldAndStuts(this.fieldId, StatusReservation.ACTIVE)
      .subscribe({
        next: data => {
          this.loading = false;
          this.reservations = data;
        },
        error: err => {
          this.loading = false;
          this.reservations = [];
          this.alertService.error('Error', err.error?.message || 'Algo salió mal');
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
          this.showModal = true;
        },
        error: err => {
          this.loading = false;
          this.confirmedReservation = null;
          this.alertService.error('Error', err.error?.message || 'Algo salió mal');
        }
      });

      this.verifiedReservation = true;
    } else {
      this.formReservation.markAllAsTouched();
    }
  }

  closeModal() {
    this.showModal = false;
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
