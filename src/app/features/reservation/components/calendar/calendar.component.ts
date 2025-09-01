import { Component, Input, OnChanges } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Reservation } from '@reservation/interfaces/reservation';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe, TimeFormatPipe, NgClass],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnChanges {
  @Input() reservationList: Reservation[] = [];
  @Input() currentMonth!: number;
  @Input() currentYear!: number;

  calendarDays: { date: Date; reservations: Reservation[] }[] = [];
  selectedDayReservations: Reservation[] = [];
  selectedDate: Date | null = null;
  showModal = false;

  ngOnChanges(): void {
    this.generateCalendar();
  }

  private normalizeDate(date: Date | string): Date {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private parseDateLocal(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  generateCalendar(): void {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const date = new Date(startDate);
    while (date <= endDate) {
      const dayReservations =
        this.reservationList.filter(
          r =>
            this.normalizeDate(this.parseDateLocal(r.reservationDate)).getTime() ===
            this.normalizeDate(date).getTime()
        ) || [];

      this.calendarDays.push({ date: new Date(date), reservations: dayReservations });
      date.setDate(date.getDate() + 1);
    }
  }

  openDayModal(day: { date: Date; reservations: Reservation[] }): void {
    this.selectedDate = day.date;
    this.selectedDayReservations = day.reservations;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDayModal(): void {
    this.showModal = false;
    this.selectedDayReservations = [];
    this.selectedDate = null;
    document.body.style.overflow = '';
  }
}
