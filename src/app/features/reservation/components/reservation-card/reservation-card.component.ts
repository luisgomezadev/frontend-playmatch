import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { StatusReservationPipe } from '@shared/pipes/status-reservation.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [
    CommonModule,
    StatusReservationPipe,
    TimeFormatPipe,
    ButtonComponent,
    MoneyFormatPipe,
    ModalComponent
  ],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss'
})
export class ReservationCardComponent {}
