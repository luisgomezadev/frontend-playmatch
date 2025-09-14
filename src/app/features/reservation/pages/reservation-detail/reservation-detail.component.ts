import { Component, inject } from '@angular/core';
import { AlertService } from '@core/services/alert.service';
import { Reservation } from '@features/reservation/interfaces/reservation';
import { ReservationService } from '@features/reservation/services/reservation.service';
import { FormsModule } from '@angular/forms';
import { CustomDatePipe } from '@shared/pipes/custom-date.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [FormsModule, CustomDatePipe, TimeFormatPipe, RouterLink],
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.scss'
})
export class ReservationDetailComponent {
  private readonly reservationService = inject(ReservationService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  reservationData: Reservation | null = null;
  code = '';
  loading = false;

  getReservationByCode(): void {
    this.loading = true;
    this.reservationData = null;
    this.reservationService.getReservationByCode(this.code).subscribe({
      next: data => {
        this.loading = false;
        if (!data) {
          this.alertService.notify('', 'No se encontró ninguna reserva con ese código', 'warning');
          return;
        }
        this.reservationData = data;
      }
    });
  }

  canceledReservation(): void {
    if (this.reservationData) {
      this.alertService
        .confirm('¿Cancelar reserva?', '¿Estás seguro que deseas cancelar tu reserva?')
        .then(confirmed => {
          if (confirmed) {
            this.reservationService.canceledReservation(this.reservationData!.id).subscribe({
              next: () => {
                this.router.navigate(['/venue']);
                this.alertService.success(
                  'Reserva cancelada',
                  'Has cancelado la reserva correctamente.'
                );
              }
            });
          }
        });
    }
  }
}
