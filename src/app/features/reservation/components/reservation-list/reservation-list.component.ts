import { Component, Input } from '@angular/core';
import {
  Reservation,
  ReservationFilter,
  StatusReservation,
} from '../../interfaces/reservation';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../../pipes/time-format.pipe';
import { ReservationService } from '../../services/reservation.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserAdmin, UserPlayer } from '../../../../core/interfaces/user';
import Swal from 'sweetalert2';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { StatusReservationPipe } from '../../../../pipes/status-reservation.pipe';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MoneyFormatPipe } from '../../../../pipes/money-format.pipe';
import { ReservationCalendarComponent } from '../reservation-calendar/reservation-calendar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    CommonModule,
    TimeFormatPipe,
    ButtonActionComponent,
    RouterModule,
    StatusReservationPipe,
    LoadingComponent,
    MoneyFormatPipe,
    TimeFormatPipe,
    ReactiveFormsModule,
    ReservationCalendarComponent,
  ],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss',
})
export class ReservationListComponent {
  @Input() reservations!: Reservation[];
  @Input() fromDetail: string = '';

  calendarView: boolean = false;

  reservationList: Reservation[] = [];
  fieldId!: number;
  teamId!: number;
  reservationBy!: string;
  listOfDetailsField = false;
  user!: UserPlayer | UserAdmin;
  loading: boolean = false;
  isSmallScreen: boolean = false;
  showFilters = false;

  // Filters for reservations
  filters: ReservationFilter = {};
  formFilter!: FormGroup;

  // Variables for modal
  selectedItem: any = null;
  selectedType: 'team' | 'field' | null = null;
  showModal = false;

  // Enum for reservation status
  StatusReservation = StatusReservation;

  constructor(
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    this.formFilter = this.fb.group({
      reservationDate: [''],
      status: [''],
    });

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        if (this.isUserAdmin(user) && user.field) {
          this.fieldId = user.field.id;
        }
        if (this.isUserPlayer(user) && user.team) {
          this.teamId = user.team.id;
        }
      }
    });

    if (this.reservations) {
      this.listOfDetailsField = true;
      this.reservationList = this.reservations;
    } else {
      this.reservationBy = this.route.snapshot.paramMap.get('var')!;
      this.setFiltersAndFetchReservations();
    }
  }

  get isFieldView(): boolean {
    return this.reservationBy === 'field' || this.fromDetail === 'field';
  }

  private setFiltersAndFetchReservations(): void {
    if (this.isReservationField()) {
      this.filters = { fieldId: this.fieldId };
    } else if (this.isReservationTeam()) {
      this.filters = { teamId: this.teamId };
    }
    this.getReservations();
  }

  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 768;
    this.showFilters = !this.isSmallScreen;
  }

  public isReservationTeam(): boolean {
    return (
      this.reservationBy === 'team' &&
      this.isUserPlayer(this.user) &&
      !!this.user.team
    );
  }

  public isReservationField(): boolean {
    return (
      this.reservationBy === 'field' &&
      this.isUserAdmin(this.user) &&
      !!this.user.field
    );
  }

  public isUserAdmin(user: any): user is UserAdmin {
    return 'field' in user;
  }

  public isUserPlayer(user: any): user is UserPlayer {
    return 'team' in user;
  }

  isOwnerTeam(reservation: Reservation): boolean {
    return (
      this.isUserPlayer(this.user) && this.user.id == reservation.team?.ownerId
    );
  }

  getReservations() {
    this.loading = true;
    this.reservationService.getReservationFiltered(this.filters).subscribe({
      next: (data) => {
        this.loading = false;
        this.reservationList = data;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire(
          'Error',
          err.error.message || 'No se pudo cargar las reservas',
          'error'
        );
      },
    });
  }

  toggleCalendarView(): void {
    this.calendarView = !this.calendarView;
    if (this.calendarView) {
      if (this.isReservationField()) {
        this.filters = { fieldId: this.fieldId };
        this.getReservations();
      }
      if (this.isReservationTeam()) {
        this.filters = { teamId: this.teamId };
        this.getReservations();
      }
    } else {
      this.cleanFilter();
    }
  }

  showButtons(reservation: Reservation): boolean {
    return (
      !this.listOfDetailsField &&
      reservation.status === StatusReservation.ACTIVE &&
      (this.isOwnerTeam(reservation) || this.isUserAdmin(this.user))
    );
  }

  filter(): void {
    const { reservationDate, status } = this.formFilter.value;
    if (reservationDate) this.filters.date = reservationDate;
    else delete this.filters.date;

    if (status) this.filters.status = status;
    else delete this.filters.status;

    this.getReservations();
  }

  cleanFilter(): void {
    this.formFilter.reset({
      reservationDate: null,
      status: '',
    });
    delete this.filters.date;
    delete this.filters.status;
    this.getReservations();
  }

  makeReservation(): void {
    if (this.hasActiveReservation()) {
      Swal.fire({
        title: 'Tienes una reserva activa',
        text: `Si no eres el dueño del equipo y la quieres cancelar comunicate con el dueño o el administrador de la cancha.`,
        icon: 'warning',
        customClass: { confirmButton: 'swal-confirm-btn' },
        buttonsStyling: false,
      });
    } else {
      this.router.navigate(['/dashboard/field/list']);
    }
  }

  finalizeReservation(reservationId: number, teamName?: string): void {
    this.showConfirmationAlert({
      title: '¿Estás seguro de finalizar reserva?',
      text: `La reserva de ${teamName} aún no finaliza`,
      confirmText: 'Sí, finalizar',
      onConfirm: () => {
        this.reservationService
          .finalizeReservationById(reservationId)
          .subscribe({
            next: () =>
              this.handleSuccess(
                `Has finalizado la reserva de ${teamName} correctamente.`
              ),
            error: (err) => Swal.fire('Error', err.error.message, 'error'),
          });
      },
    });
  }

  cancelReservation(reservationId: number): void {
    this.showConfirmationAlert({
      title: '¿Estás seguro de cancelar la reserva?',
      text: `Esta acción cancelará la reserva permanentemente.`,
      confirmText: 'Sí, cancelar',
      onConfirm: () => {
        this.reservationService
          .canceledReservationById(reservationId)
          .subscribe({
            next: () =>
              this.handleSuccess(`Has cancelado la reserva correctamente.`),
            error: (err) => Swal.fire('Error', err.error.message, 'error'),
          });
      },
    });
  }

  private handleSuccess(message: string): void {
    this.getReservations();
    Swal.fire({
      title: message,
      icon: 'success',
      customClass: { confirmButton: 'swal-confirm-btn' },
      buttonsStyling: false,
    });
  }

  private showConfirmationAlert(options: {
    title: string;
    text: string;
    confirmText: string;
    onConfirm: () => void;
  }): void {
    Swal.fire({
      title: options.title,
      text: options.text,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: options.confirmText,
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) options.onConfirm();
    });
  }

  isReservationExpired(reservation: Reservation): boolean {
    const now = new Date();
    const endDateTime = new Date(
      `${reservation.reservationDate}T${reservation.endTime}`
    );
    return now > endDateTime;
  }

  getReservationStatus(
    reservation: Reservation
  ): 'upcoming' | 'inProgress' | 'expired' | 'other' {
    const now = new Date();
    const start = new Date(
      `${reservation.reservationDate}T${reservation.startTime}`
    );
    const end = new Date(
      `${reservation.reservationDate}T${reservation.endTime}`
    );

    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    if (now < start && start <= twoHoursLater) return 'upcoming';
    if (now >= start && now <= end) return 'inProgress';
    if (now > end) return 'expired';

    return 'other';
  }

  isReservationToday(reservation: Reservation): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [year, month, day] = reservation.reservationDate
      .split('-')
      .map(Number);
    const reservationDate = new Date(year, month - 1, day);

    const timeDiff = reservationDate.getTime() - today.getTime();
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (dayDiff === 0) return 'HOY';
    if (dayDiff === 1) return 'MAÑANA';
    if (dayDiff === -1) return 'AYER';

    return reservationDate.toLocaleDateString();
  }

  isInProgressAndActive(reservation: Reservation): boolean {
    return (
      this.getReservationStatus(reservation) === 'inProgress' &&
      reservation.status === StatusReservation.ACTIVE
    );
  }

  hasActiveReservation(): boolean {
    return this.reservationList.some(
      (r) => r.status === StatusReservation.ACTIVE
    );
  }

  openModal(item: any, type: 'team' | 'field'): void {
    this.selectedItem = item;
    this.selectedType = type;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedItem = null;
    this.selectedType = null;
  }
}
