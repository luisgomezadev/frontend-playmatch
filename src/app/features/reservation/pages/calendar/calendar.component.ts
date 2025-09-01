import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { FieldService } from '@features/field/services/field.service';
import { ReservationService } from '@features/reservation/services/reservation.service';
import { Reservation, StatusReservation } from '@features/reservation/interfaces/reservation';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { ReservationCalendarComponent } from '@features/reservation/components/reservation-calendar/reservation-calendar.component';
import { MONTHS } from '@shared/constants/months.constants';
import { Field } from '@features/field/interfaces/field';
import { User } from '@features/user/interfaces/user';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [LayoutComponent, ReservationCalendarComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fieldService = inject(FieldService);
  private readonly reservationService = inject(ReservationService);

  user!: User;
  field!: Field;
  reservations: Reservation[] = [];

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
      if (!field) return;
      this.field = field;
      this.loadReservations();
    });
  }

  loadReservations(): void {
    this.reservationService
      .getReservationsByFieldAndStuts(this.field.id, StatusReservation.ACTIVE)
      .subscribe({
        next: data => (this.reservations = data),
        error: err => console.error(err)
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
