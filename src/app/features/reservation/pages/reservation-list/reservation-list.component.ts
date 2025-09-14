import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Venue } from '@features/venue/interfaces/venue';
import { VenueService } from '@features/venue/services/venue.service';
import { ReservationService } from '@reservation/services/reservation.service';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { User } from '@user/interfaces/user';
import { Reservation } from '@features/reservation/interfaces/reservation'; // tu interfaz de reserva
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LayoutComponent,
    TimeFormatPipe
  ],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly venueService = inject(VenueService);
  private readonly authService = inject(AuthService);

  user!: User;
  venue!: Venue;

  loading = false;

  currentDate: Date = new Date();
  reservations: Reservation[] = [];

  ngOnInit(): void {
    this.initUser();
  }

  /** Inicializa usuario y venue */
  private initUser(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) return;
      this.user = user;
      this.getVenue();
    });
  }

  private getVenue(): void {
    this.venueService.getVenueByAdminId(this.user.id).subscribe({
      next: data => {
        this.venue = data;
        this.loadReservations();
      }
    });
  }

  /** Cambiar al día anterior */
  prevDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.loadReservations();
  }

  /** Cambiar al día siguiente */
  nextDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.loadReservations();
  }

  /** Formatea fecha local yyyy-MM-dd */
  private formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Carga las reservas de la fecha actual */
  loadReservations(): void {
    if (!this.venue) return;
    this.loading = true;
    const formattedDate = this.formatDateLocal(this.currentDate);
    this.reservationService.getReservationsByVenueIdAndDate(this.venue.id, formattedDate)
      .subscribe({
        next: data => {
          this.loading = false;
          this.reservations = data;
        }
      });
  }

  cancelReservation(reservationId: number): void {
    // ejemplo simple con confirm()
    if (!confirm('¿Seguro que quieres cancelar la reserva?')) return;

    this.reservationService.canceledReservation(reservationId).subscribe({
      next: () => this.loadReservations(), // recarga
      error: (err) => console.error(err)
    });
  }

  /** Formatea la fecha para el encabezado */
  get formattedDate(): string {
    return this.currentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  get year(): number {
    return this.currentDate.getFullYear();
  }
}
