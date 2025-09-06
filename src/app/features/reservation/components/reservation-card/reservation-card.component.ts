import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ErrorResponse } from '@core/interfaces/error-response';
import { AlertService } from '@core/services/alert.service';
import { Field } from '@field/interfaces/field';
import { Reservation, StatusReservation } from '@reservation/interfaces/reservation';
import { ReservationService } from '@reservation/services/reservation.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { StatusReservationPipe } from '@shared/pipes/status-reservation.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';
import { User } from '@user/interfaces/user';

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
export class ReservationCardComponent {
  private readonly reservationService = inject(ReservationService);
  private readonly alertService = inject(AlertService);

  @Input() reservation!: Reservation;
  @Input() viewAsField = false;
  @Input() reservationBy = '';
  @Input() listOfDetailsField = false;
  @Input() isUserAdmin = false;

  @Output() loadReservations = new EventEmitter<number>();

  showModal = false;
  user!: User;
  field!: Field;
  selectedType: 'user' | 'field' | null = null;

  loading = false;

  StatusReservation = StatusReservation;

  isOpen = signal(false);

  openModal(item: Reservation, type: 'user' | 'field'): void {
    if (type === 'user') {
      this.user = item.user;
    } else if (type === 'field') {
      this.field = item.field;
    }
    this.selectedType = type;
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  onClosed() {
    this.isOpen.set(false);
    this.selectedType = null;
    document.body.style.overflow = '';
  }

  showInfo(reservation: Reservation): boolean {
    return (
      reservation.status === StatusReservation.ACTIVE &&
      !this.listOfDetailsField &&
      (this.isReservationExpired(reservation) ||
        this.getReservationStatus(reservation) === 'upcoming' ||
        this.isInProgressAndActive(reservation))
    );
  }

  getReservations(page: number): void {
    this.loading = true;
    this.loadReservations.emit(page);
  }

  cancelReservation(id: number): void {
    this.alertService
      .confirm(
        '¿Estás seguro de cancelar la reserva?',
        'Esta acción es permanente.',
        'Sí, cancelar'
      )
      .then(result => {
        if (result) {
          this.reservationService.canceledReservationById(id).subscribe({
            next: () => this.handleSuccess('Reserva cancelada.'),
            error: err => this.handleError(err)
          });
        }
      });
  }

  finalizeReservation(id: number, userName?: string): void {
    const messageConfirm: string = this.isUserAdmin
      ? `La reserva de ${userName} aún no finaliza`
      : 'Tu reserva aun no finaliza';

    const message: string = this.isUserAdmin
      ? `Reserva de ${userName} finalizada.`
      : 'Tu reserva ha finalizado';

    this.alertService
      .confirm('¿Estás seguro de finalizar reserva?', messageConfirm, 'Sí, finalizar')
      .then(result => {
        if (result) {
          this.reservationService.finalizeReservationById(id).subscribe({
            next: () => this.handleSuccess(message),
            error: err => this.handleError(err)
          });
        }
      });
  }

  private handleSuccess(message: string): void {
    this.loadReservations.emit(0);
    this.alertService.success('Éxito', message);
  }

  private handleError(err: ErrorResponse): void {
    this.loading = false;
    this.alertService.error('Error', err.error?.message || 'Algo salió mal');
  }

  showButtons(reservation: Reservation): boolean {
    return !this.listOfDetailsField && reservation.status === StatusReservation.ACTIVE;
  }

  isReservationToday(reservation: Reservation): string {
    const today = new Date();
    const [y, m, d] = reservation.reservationDate.split('-').map(Number);
    const resDate = new Date(y, m - 1, d);
    const diffDays =
      (resDate.getTime() -
        new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) /
      (1000 * 3600 * 24);

    if (diffDays === 0) return 'HOY';
    if (diffDays === 1) return 'MAÑANA';
    if (diffDays === -1) return 'AYER';
    return resDate.toLocaleDateString();
  }

  isInProgressAndActive(res: Reservation): boolean {
    return (
      this.getReservationStatus(res) === 'inProgress' && res.status === StatusReservation.ACTIVE
    );
  }

  getReservationStatus(reservation: Reservation): 'upcoming' | 'inProgress' | 'expired' | 'other' {
    const now = new Date();
    const start = new Date(`${reservation.reservationDate}T${reservation.startTime}`);
    const end = new Date(`${reservation.reservationDate}T${reservation.endTime}`);
    const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    if (now < start && start <= inTwoHours) return 'upcoming';
    if (now >= start && now <= end) return 'inProgress';
    if (now > end) return 'expired';
    return 'other';
  }

  isReservationExpired(reservation: Reservation): boolean {
    const now = new Date();
    const endDateTime = new Date(`${reservation.reservationDate}T${reservation.endTime}`);
    return now > endDateTime;
  }

  getImageUrl(imageUrl: string): string {
    return imageUrl?.startsWith('http') ? imageUrl : '/assets/profile_icon.webp';
  }

  getUserName(r: Reservation) {
    return r.user ? `${r.user.fullName}` : 'Sin jugador asignado';
  }
}
