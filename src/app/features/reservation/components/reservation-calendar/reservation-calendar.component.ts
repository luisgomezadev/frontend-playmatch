import { Component, Input, OnInit } from '@angular/core';
import { Reservation, StatusReservation } from '../../interfaces/reservation';
import { DatePipe, NgClass } from '@angular/common';
import { TimeFormatPipe } from '../../../../shared/pipes/time-format.pipe';

@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  imports: [NgClass, DatePipe, TimeFormatPipe],
  templateUrl: './reservation-calendar.component.html',
  styleUrl: './reservation-calendar.component.scss'
})
export class ReservationCalendarComponent implements OnInit {

  @Input() reservationList: Reservation[] = [];
  @Input() reservationBy!: string;

  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  calendarDays: { date: Date; reservations: Reservation[] }[] = [];
  mounths: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  StatusReservation = StatusReservation;

  selectedReservation: Reservation | null = null;
  showModal: boolean = false;

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(): void {
    this.generateCalendar();
  }

  openModal(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReservation = null;
  }

  private normalizeDate(date: Date | string): Date {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private parseDateLocal(dateStr: string): Date {
    const parts = dateStr.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  generateCalendar(): void {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    let date = new Date(startDate);

    while (date <= endDate) {
      const dayReservations = this.reservationList?.filter(r =>
        this.normalizeDate(this.parseDateLocal(r.reservationDate)).getTime() === this.normalizeDate(date).getTime()
      ) || [];


      this.calendarDays.push({
        date: new Date(date),
        reservations: dayReservations
      });

      date.setDate(date.getDate() + 1);
    }
  }


  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

}
