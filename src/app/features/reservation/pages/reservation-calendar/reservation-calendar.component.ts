import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { FieldService } from '@features/field/services/field.service';
import { ReservationService } from '@features/reservation/services/reservation.service';
import { Reservation, StatusReservation } from '@features/reservation/interfaces/reservation';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { MONTHS } from '@shared/constants/months.constants';
import { Field } from '@features/field/interfaces/field';
import { User } from '@features/user/interfaces/user';
import { CalendarComponent } from '@features/reservation/components/calendar/calendar.component';
import { AlertService } from '@core/services/alert.service';
import { ErrorResponse } from '@core/interfaces/error-response';

@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  imports: [LayoutComponent, CalendarComponent],
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.scss']
})
export class ReservationCalendarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fieldService = inject(FieldService);
  private readonly reservationService = inject(ReservationService);
  private readonly alertService = inject(AlertService);

  user!: User;
  field!: Field;
  reservations: Reservation[] = [];
  loading = true;

  months = MONTHS;
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) return;
      this.user = user;
      this.loadField();
    });
  }

  loadField(): void {
    this.fieldService.getFieldByAdminId(this.user.id).subscribe(field => {
      if (!field) {
        this.loading = false;
        return;
      }
      this.field = field;
      this.loadReservations();
    });
  }

  loadReservations(): void {
    this.reservationService
      .getReservationsByFieldAndStuts(this.field.id, StatusReservation.ACTIVE)
      .subscribe({
        next: data => {
          this.loading = false;
          this.reservations = data;
        },
        error: (err: ErrorResponse) => {
          this.alertService.error(
            'Error al cargar las reservas',
            err.error.message || 'Inténtalo de nuevo más tarde.'
          );
          this.loading = false;
        }
      });
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }
}
