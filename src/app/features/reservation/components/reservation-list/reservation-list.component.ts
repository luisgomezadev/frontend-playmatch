import { Component, Input } from '@angular/core';
import { Reservation, StatusReservation } from '../../interfaces/reservation';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../../pipes/time-format.pipe';
import { ReservationService } from '../../services/reservation.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserAdmin } from '../../../../core/interfaces/user';
import Swal from 'sweetalert2';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe, ButtonActionComponent],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss'
})
export class ReservationListComponent {
  @Input() reservations!: Reservation[];

  reservationList: Reservation[] = [];
  fieldId!: number;
  reservationBy!: string;
  StatusReservation = StatusReservation;
  listOfDetailsField = false;

  constructor(private reservationService: ReservationService, private route: ActivatedRoute, private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        if (this.isUserAdmin(user) && user.field) {
          this.fieldId = user.field.id;
        }
      }
    });

    if (this.reservations) {
      this.listOfDetailsField = true;
      this.reservationList = this.reservations;
    } else {
      this.reservationBy = this.route.snapshot.paramMap.get('var')!;
      if (this.reservationBy === 'field') {
        this.getReservations();
      }
    }
  }

  private isUserAdmin(user: any): user is UserAdmin {
    return 'field' in user;
  }

  getReservations() {
    this.reservationService.getReservationsByFieldId(this.fieldId).subscribe({
      next: (data) => {
        this.reservationList = data;
      },
    })
  }

  finalizeReservation(reservationId: number, teamName?: string) {
    Swal.fire({
          title: '¿Finalizar reserva?',
          text: `¿Estás seguro de finalizar reserva de ${teamName}?`,
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, finalizar',
          cancelButtonText: 'No',
          customClass: { confirmButton: 'swal-confirm-btn', cancelButton: 'swal-cancel-btn' },
          buttonsStyling: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.reservationService.finalizeReservationById(reservationId).subscribe({
              next: () => {
                this.getReservations();
                Swal.fire({
                  title: 'Reserva finalizada',
                  text: `Has finalizado la reserva de ${teamName} correctamente.`,
                  icon: 'success',
                  customClass: { confirmButton: 'swal-confirm-btn' },
                  buttonsStyling: false
                });
              }
            })
          }
        });
  }

  isReservationExpired(reservation: Reservation): boolean {
    const now = new Date();
    const endDateTime = new Date(`${reservation.reservationDate}T${reservation.endTime}`);
    return now > endDateTime;
  }
}
