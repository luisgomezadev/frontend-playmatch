import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reservation } from '@features/reservation/interfaces/reservation';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';
import { ReservationService } from '@features/reservation/services/reservation.service';
import { AlertService } from '@core/services/alert.service';
import { ErrorResponse } from '@core/interfaces/error-response';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe, FormsModule],
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss']
})
export class ReservationCardComponent {
  private readonly reservationService = inject(ReservationService);
  private readonly alertService = inject(AlertService);

  @Input() reservation!: Reservation;

  @Output() reservationCanceled = new EventEmitter<void>();

  showModal = false;
  whatsAppMessage = '';

  openModal() {
    this.whatsAppMessage = `Hola ${this.reservation.user}, lamentablemente tuvimos que cancelar tu reserva del día ${this.reservation.reservationDate} a las ${this.reservation.startTime}. Puedes reservar otro día ingresando nuevamente al sitio.`;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  cancelAndNotify() {
    this.reservationService.canceledReservation(this.reservation.id).subscribe({
      next: () => {
        const phone = this.reservation.cellphone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(this.whatsAppMessage);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');

        this.reservationCanceled.emit();
        this.closeModal();
      },
      error: (err: ErrorResponse) => {
        this.alertService.error(
          'Error al cancelar reserva',
          err.error.message || 'Error inesperado'
        );
      }
    });
  }

  cancelWithoutNotify() {
    this.reservationService.canceledReservation(this.reservation.id).subscribe({
      next: () => {
        this.alertService.success(
          'Reserva cancelada',
          `Has cancelado la reserva de ${this.reservation.user}`
        );

        this.reservationCanceled.emit();
        this.closeModal();
      },
      error: (err: ErrorResponse) => {
        this.alertService.error(
          'Error al cancelar reserva',
          err.error.message || 'Error inesperado'
        );
      }
    });
  }
}
