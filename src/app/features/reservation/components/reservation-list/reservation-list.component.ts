import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Reservation, ReservationFilter, StatusReservation } from '../../interfaces/reservation';
import { PagedResponse } from '../../../../core/interfaces/paged-response';
import { User, UserRole } from '../../../../core/interfaces/user';

import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../../../core/services/auth.service';

import Swal from 'sweetalert2';

// Pipes y componentes
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { ReservationCalendarComponent } from '../reservation-calendar/reservation-calendar.component';
import { Field } from '../../../field/interfaces/field';
import { FieldService } from '../../../field/services/field.service';
import { ReservationCardComponent } from '../reservation-card/reservation-card.component';
import { LoadingReservationCardComponent } from '../../../../shared/components/loading/loading-reservation-card/loading-reservation-card.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonActionComponent,
    LoadingReservationCardComponent,
    ReservationCalendarComponent,
    FormsModule,
    ReservationCardComponent
  ],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss'
})
export class ReservationListComponent implements OnInit {
  @Input() reservations!: Reservation[];
  @Input() fromDetail: string = '';

  reservationList!: PagedResponse<Reservation>;
  formFilter!: FormGroup;

  user!: User;
  calendarView: boolean = false;
  showModal = false;
  listOfDetailsField = false;
  loading = false;
  showFilters = false;
  isSmallScreen = false;

  currentPage = 0;
  pageSize = 6;

  field!: Field;
  reservationBy!: string;
  filters: ReservationFilter = {};
  selectedItem: any = null;
  selectedType: 'user' | 'field' | null = null;

  StatusReservation = StatusReservation;

  constructor(
    private reservationService: ReservationService,
    private fieldService: FieldService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.initForm();
    this.initUser();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private initForm(): void {
    this.formFilter = this.fb.group({ reservationDate: [''], status: [''] });
  }

  private initUser(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) return;
      this.user = user;
      if (user.role == 'FIELD_ADMIN') {
        if (this.reservations) {
          this.listOfDetailsField = true;
          this.reservationBy = 'field';
          this.reservationList = {
            content: this.reservations,
            totalPages: 1,
            totalElements: this.reservations.length,
            size: this.reservations.length,
            number: 0
          };
          this.loading = false;
        } else {
          this.reservationBy = 'field';
          this.getField();
        }
      } else {
        this.reservationBy = 'user';
        this.setFiltersAndFetchReservations();
      }
    });
  }

  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 768;
    this.showFilters = !this.isSmallScreen;
  }

  get isFieldView(): boolean {
    return this.reservationBy === 'field' || this.fromDetail === 'field';
  }

  showButtons(reservation: Reservation): boolean {
    return !this.listOfDetailsField && reservation.status === StatusReservation.ACTIVE;
  }

  isUserAdmin(user: User): boolean {
    return user.role == UserRole.FIELD_ADMIN;
  }

  isReservationUser(): boolean {
    return this.reservationBy === 'user';
  }

  isReservationField(): boolean {
    return this.reservationBy === 'field';
  }

  private setFiltersAndFetchReservations(): void {
    this.filters = this.isReservationField()
      ? { fieldId: this.field.id }
      : { userId: this.user.id };
    this.getReservations(0);
  }

  getField(): void {
    this.loading = true;
    this.fieldService.getFieldByAdminId(this.user.id).subscribe({
      next: (data: Field) => {
        if (data) {
          this.field = data;
          this.setFiltersAndFetchReservations();
        } else {
          this.loading = false;
        }
      },
      error: err => this.handleError(err)
    });
  }

  getReservations(page: number): void {
    this.loading = true;
    this.reservationService.getReservationFiltered(this.filters, page, this.pageSize).subscribe({
      next: data => {
        this.reservationList = data;
        this.loading = false;
      },
      error: err => this.handleError(err)
    });
  }

  getAllReservationsActive(): void {
    this.loading = true;
    this.reservationService
      .getReservationsByFieldAndStuts(this.field.id, StatusReservation.ACTIVE)
      .subscribe({
        next: data => {
          this.reservationList = {
            content: data,
            totalPages: 1,
            totalElements: data.length,
            size: data.length,
            number: 0
          };
          this.loading = false;
        },
        error: err => this.handleError(err)
      });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.reservationList.totalPages) {
      this.currentPage = newPage;
      this.getReservations(this.currentPage);
    }
  }

  toggleCalendarView(): void {
    this.calendarView = !this.calendarView;
    this.setFiltersAndFetchReservations();
  }

  filter(): void {
    const { reservationDate, status } = this.formFilter.value;
    this.filters.date = reservationDate || undefined;
    this.filters.status = status || undefined;
    this.getReservations(0);
    this.showFilters = false;
  }

  cleanFilter(): void {
    this.formFilter.reset({ reservationDate: null, status: '' });
    delete this.filters.date;
    delete this.filters.status;
    this.getReservations(0);
    this.showFilters = false;
  }

  makeReservation(): void {
    if (this.hasActiveReservation()) {
      Swal.fire({
        title: 'Tienes una reserva activa',
        text: 'Debes cancelarla si deseas hacer una nueva reserva.',
        icon: 'warning',
        customClass: { confirmButton: 'swal-confirm-btn' },
        buttonsStyling: false
      });
    } else {
      this.router.navigate(['/dashboard/field/list']);
    }
  }

  finalizeReservation(id: number, userName?: string): void {
    const messageConfirm: string = this.isUserAdmin(this.user)
      ? `La reserva de ${userName} aún no finaliza`
      : 'Tu reserva aun no finaliza';
    const message: string = this.isUserAdmin(this.user)
      ? `Reserva de ${userName} finalizada.`
      : 'Tu ha finalizado';
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

  openModal(item: any, type: 'user' | 'field'): void {
    this.selectedItem = item;
    this.selectedType = type;
    this.showModal = true;
  }

  openList() {
    this.calendarView = false;
    this.getReservations(0);
  }

  openCalendar() {
    this.calendarView = true;
    this.getAllReservationsActive();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedItem = null;
    this.selectedType = null;
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

  hasActiveReservation(): boolean {
    return this.reservationList?.content?.some(r => r.status === StatusReservation.ACTIVE);
  }

  private handleSuccess(message: string): void {
    this.getReservations(0);
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
}
