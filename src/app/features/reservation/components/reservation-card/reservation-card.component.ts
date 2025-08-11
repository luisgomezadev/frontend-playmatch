import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Reservation, StatusReservation } from '../../interfaces/reservation';
import { CommonModule } from '@angular/common';
import { StatusReservationPipe } from '../../../../shared/pipes/status-reservation.pipe';
import { TimeFormatPipe } from '../../../../shared/pipes/time-format.pipe';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { ReservationService } from '../../services/reservation.service';
import Swal from 'sweetalert2';
import { MoneyFormatPipe } from '../../../../shared/pipes/money-format.pipe';
import { User } from '../../../user/interfaces/user';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [
    CommonModule,
    StatusReservationPipe,
    TimeFormatPipe,
    ButtonActionComponent,
    MoneyFormatPipe
  ],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss'
})
export class ReservationCardComponent {

  private reservationService = inject(ReservationService);

  @Input() reservation!: Reservation;
  @Input() viewAsField: boolean = false;
  @Input() reservationBy: string = '';
  @Input() listOfDetailsField: boolean = false;
  @Input() isUserAdmin: boolean = false;

  @Output() loadReservations = new EventEmitter<number>();

  showModal = false;
  selectedItem: any = null;
  selectedType: 'user' | 'field' | null = null;

  loading: boolean = false;

  StatusReservation = StatusReservation;

  constructor() { }

  openModal(item: any, type: 'user' | 'field'): void {
    this.selectedItem = item;
    this.selectedType = type;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedItem = null;
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
    this.confirmAction(
      '¿Estás seguro de cancelar la reserva?',
      'Esta acción es permanente.',
      'Sí, cancelar',
      () => {
        this.reservationService.canceledReservationById(id).subscribe({
          next: () => this.handleSuccess('Reserva cancelada.'),
          error: err => this.handleError(err)
        });
      }
    );
  }

  finalizeReservation(id: number, userName?: string): void {
    const messageConfirm: string = this.isUserAdmin
      ? `La reserva de ${userName} aún no finaliza`
      : 'Tu reserva aun no finaliza';
    const message: string = this.isUserAdmin
      ? `Reserva de ${userName} finalizada.`
      : 'Tu reserva ha finalizado';
    this.confirmAction(
      `¿Estás seguro de finalizar reserva?`,
      messageConfirm,
      'Sí, finalizar',
      () => {
        this.reservationService.finalizeReservationById(id).subscribe({
          next: () => this.handleSuccess(message),
          error: err => this.handleError(err)
        });
      }
    );
  }

  private handleSuccess(message: string): void {
    this.loadReservations.emit(0);
    Swal.fire({
      title: message,
      icon: 'success',
      customClass: { confirmButton: 'swal-confirm-btn' },
      buttonsStyling: false
    });
  }

  private handleError(err: any): void {
    this.loading = false;
    Swal.fire('Error', err.error.message || 'No se pudo cargar las reservas', 'error');
  }

  private confirmAction(
    title: string,
    text: string,
    confirmText: string,
    onConfirm: () => void
  ): void {
    Swal.fire({
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      customClass: { confirmButton: 'swal-confirm-btn', cancelButton: 'swal-cancel-btn' },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) onConfirm();
    });
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


  getImageUrl(user: User): string {
    return user.imageUrl?.startsWith('http') ? user.imageUrl : '/assets/profile_icon.webp';
  }
}
