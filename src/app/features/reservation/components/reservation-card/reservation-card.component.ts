import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Reservation } from '@features/reservation/interfaces/reservation';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [
    CommonModule,
    TimeFormatPipe,
  ],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss'
})
export class ReservationCardComponent {
  @Input() reservation!: Reservation;
}
