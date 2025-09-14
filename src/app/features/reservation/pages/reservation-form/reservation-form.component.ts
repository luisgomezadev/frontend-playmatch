import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Field } from '@features/field/interfaces/field';
import { Reservation, ReservationDuration, ReservationRequest, TimeSlot } from '@features/reservation/interfaces/reservation';
import { ReservationService } from '@features/reservation/services/reservation.service';
import { Venue } from '@features/venue/interfaces/venue';
import { VenueService } from '@features/venue/services/venue.service';
import { CustomDatePipe } from '@shared/pipes/custom-date.pipe';
import { FieldTypePipe } from '@shared/pipes/field-type.pipe';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';

interface DayItem {
  date: Date;
  formatted: string;
  weekday: string;
  dayNumber: number;
  monthName: string;
}

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    TimeFormatPipe,
    FieldTypePipe,
    MoneyFormatPipe,
    CustomDatePipe
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss'
})
export class ReservationFormComponent implements OnInit {
  private readonly venueService = inject(VenueService);
  private readonly reservationService = inject(ReservationService);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertService = inject(AlertService);

  venueCode = '';
  venue!: Venue;
  loading = false;
  loadingCreateReservation = false;
  selectedDate: Date | null = null;
  selectedDurationEnum: ReservationDuration | null = null;
  selectedMinutes: number | null = null;
  selectedStartTime: string | null = null;
  selectedField: Field | null = null;
  next20Days: DayItem[] = [];
  availableRanges: TimeSlot[] = [];
  availableStartTimes: string[] = [];
  reservationForm!: FormGroup;
  successReservation = false;
  reservationData!: Reservation;

  durations = [
    { enum: ReservationDuration.MIN_60, minutes: 60 },
    { enum: ReservationDuration.MIN_90, minutes: 90 },
    { enum: ReservationDuration.MIN_120, minutes: 120 }
  ];

  ngOnInit(): void {
    this.venueCode = this.route.snapshot.paramMap.get('code')!;
    this.getVenue();
    this.generateNext20Days();
    this.initForm();
  }

  initForm(): void {
    this.reservationForm = this.formBuilder.group({
      user: ['', [Validators.required, Validators.minLength(3)]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
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
        monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1)
      });
    }
  }

  selectDate(day: DayItem) {
    this.selectedDate = day.date;
    this.selectedStartTime = null;
    this.selectedMinutes = null;
    this.selectedField = null;
    this.selectedDurationEnum = null;
    this.reservationForm.reset();
  }

  selectField(field: Field) {
    this.selectedField = field;
    this.selectedStartTime = null;
    this.selectedMinutes = null;
    this.selectedDurationEnum = null;
    this.reservationForm.reset();
  }

  selectDuration(minutes: number) {
    this.selectedMinutes = minutes;
    this.selectedStartTime = null;
    this.reservationForm.reset();
  }

  getAvailableHours(minutes: number, enumValue: ReservationDuration) {
    this.selectedMinutes = minutes;
    this.selectedDurationEnum = enumValue;

    this.reservationForm.reset();
    this.selectedStartTime = null;

    if (!this.selectedDate || !this.selectedField) return;

    this.reservationService
      .getAvailableHours(
        this.venue.id,
        this.selectedField.id,
        this.formatDateLocal(this.selectedDate!)
      )
      .subscribe(ranges => {
        this.availableRanges = ranges;
        this.generateStartTimes();
      });
  }

  generateStartTimes() {
    if (!this.availableRanges.length || !this.selectedMinutes) {
      this.availableStartTimes = [];
      return;
    }

    const minutes = this.selectedMinutes;
    const step = 30; // intervalos de 30 min
    const slots: string[] = [];

    // Comprobar si la fecha seleccionada es hoy
    const now = new Date();
    const isToday =
      this.selectedDate &&
      now.toISOString().split('T')[0] === this.selectedDate.toISOString().split('T')[0];

    this.availableRanges.forEach(r => {
      const startTime = this.parseTime(r.start);
      const endTime = this.parseTime(r.end);

      let current = new Date(startTime);
      const durationMs = minutes * 60 * 1000;

      while (current.getTime() + durationMs <= endTime.getTime()) {
        // Si es hoy, descartar horas pasadas
        if (!isToday || current.getTime() >= now.getTime()) {
          slots.push(this.formatTime(current));
        }

        current = new Date(current.getTime() + step * 60 * 1000);
      }
    });

    this.availableStartTimes = slots;
  }

  private formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseTime(timeStr: string): Date {
    const [h, m, s] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, s ?? 0, 0);
    return d;
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  getVenue(): void {
    this.loading = true;
    this.venueService.getVenueByCode(this.venueCode).subscribe({
      next: data => {
        this.loading = false;
        this.venue = data;
      }
    });
  }

  onSubmit() {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    this.loadingCreateReservation = true;

    const payload: ReservationRequest = {
      user: this.reservationForm.value.user,
      cellphone: this.reservationForm.value.cellphone,
      fieldId: this.selectedField!.id,
      reservationDate: this.formatDateLocal(this.selectedDate!),
      startTime: this.selectedStartTime!,
      duration: this.selectedDurationEnum!
    };

    this.reservationService.createReservation(payload).subscribe({
      next: data => {
        this.loadingCreateReservation = false;
        this.successReservation = true;
        this.reservationData = data;
      },
      error: err => {
        this.loadingCreateReservation = false;
        this.alertService.error('Error', err.error?.message || 'Algo salió mal');
      }
    });
  }
}
