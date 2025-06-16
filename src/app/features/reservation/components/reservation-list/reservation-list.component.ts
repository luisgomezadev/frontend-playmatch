import { Component, Input } from '@angular/core';
import { Reservation, StatusReservation } from '../../interfaces/reservation';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../../pipes/time-format.pipe';
import { ReservationService } from '../../services/reservation.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User, UserAdmin, UserPlayer } from '../../../../core/interfaces/user';
import Swal from 'sweetalert2';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { StatusReservationPipe } from '../../../../pipes/status-reservation.pipe';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    CommonModule,
    TimeFormatPipe,
    ButtonActionComponent,
    RouterModule,
    StatusReservationPipe,
  ],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss',
})
export class ReservationListComponent {
  @Input() reservations!: Reservation[];
  @Input() fromDetail: string = '';

  reservationList: Reservation[] = [];
  fieldId!: number;
  teamId!: number;
  reservationBy!: string;
  StatusReservation = StatusReservation;
  listOfDetailsField = false;
  user!: UserPlayer | UserAdmin;

  constructor(
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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
      if (this.isReservationField()) {
        this.getReservationsField();
      }
      if (this.isReservationTeam()) {
        this.getReservationsTeam();
      }
    }
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

  private isUserAdmin(user: any): user is UserAdmin {
    return 'field' in user;
  }

  private isUserPlayer(user: any): user is UserPlayer {
    return 'team' in user;
  }

  getReservationsField() {
    this.reservationService.getReservationsByFieldId(this.fieldId).subscribe({
      next: (data) => {
        this.reservationList = data;
      },
    });
  }

  getReservationsTeam() {
    this.reservationService.getReservationsByTeamId(this.teamId).subscribe({
      next: (data) => {
        this.reservationList = data;
      },
    });
  }

  finalizeReservation(reservationId: number, teamName?: string) {
    Swal.fire({
      title: '¿Estás seguro de finalizar reserva?',
      text: `La reserva de ${teamName} aún no finaliza`,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService
          .finalizeReservationById(reservationId)
          .subscribe({
            next: () => {
              if (this.reservationBy == 'field') this.getReservationsField();
              else this.getReservationsTeam();
              Swal.fire({
                title: 'Reserva finalizada',
                text: `Has finalizado la reserva de ${teamName} correctamente.`,
                icon: 'success',
                customClass: { confirmButton: 'swal-confirm-btn' },
                buttonsStyling: false,
              });
            },
          });
      }
    });
  }

  cancelReservation(reservationId: number, teamName?: string) {
    Swal.fire({
      title: '¿Estás seguro de cancelar la reserva?',
      text: `Esta acción cancelará la reserva permanentemente.`,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService
          .canceledReservationById(reservationId)
          .subscribe({
            next: () => {
              if (this.reservationBy == 'field') this.getReservationsField();
              else this.getReservationsTeam();
              Swal.fire({
                title: 'Reserva finalizada',
                text: `Has cancelado la reserva de ${teamName} correctamente.`,
                icon: 'success',
                customClass: { confirmButton: 'swal-confirm-btn' },
                buttonsStyling: false,
              });
            },
          });
      }
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

    if (dayDiff === 0 && reservation.status != 'CANCELED') return 'HOY';
    if (dayDiff === 1 && reservation.status != 'CANCELED') return 'MAÑANA';
    if (dayDiff === -1 && reservation.status != 'CANCELED') return 'AYER';

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
}
