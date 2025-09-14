import { Component } from '@angular/core';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { CalendarComponent } from '@features/reservation/components/calendar/calendar.component';

@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  imports: [LayoutComponent, CalendarComponent],
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.scss']
})
export class ReservationCalendarComponent {

}
