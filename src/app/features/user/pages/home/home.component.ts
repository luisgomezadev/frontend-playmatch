import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorResponse } from '@core/interfaces/error-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { ScrollService } from '@core/services/scroll.service';
import { Reservation } from '@features/reservation/interfaces/reservation';
import { ReservationService } from '@features/reservation/services/reservation.service';
import { Venue } from '@features/venue/interfaces/venue';
import { VenueService } from '@features/venue/services/venue.service';
import { CreateVenueCardComponent } from '@shared/components/create-venue-card/create-venue-card.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { User } from '@user/interfaces/user';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, LayoutComponent, CreateVenueCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly venueService = inject(VenueService);
  private readonly scrollService = inject(ScrollService);
  private readonly reservationService = inject(ReservationService);
  private readonly alertService = inject(AlertService);

  user!: User;
  venue!: Venue;
  reservations!: Reservation[];
  loading = false;
  loadingReservations = false;
  copySuccess = false;

  urlBase = environment.deploy + 'reserva/';
  link = '';

  ngOnInit(): void {
    this.scrollService.scrollToTop();

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.getVenue();
      }
    });
  }

  getVenue(): void {
    this.loading = true;
    this.venueService.getVenueByAdminId(this.user.id).subscribe({
      next: data => {
        if (data) {
          this.venue = data;
          this.getReservations();
          this.link = this.urlBase + this.venue.code;
        }
        this.loading = false;
      }
    });
  }

  getReservations(): void {
    this.loadingReservations = true;
    const today = new Date();
    this.reservationService
      .getReservationsByVenueIdAndDate(this.venue.id, this.formatDateLocal(today))
      .subscribe({
        next: data => {
          this.loadingReservations = false;
          this.reservations = data;
        },
        error: (err: ErrorResponse) => {
          this.loadingReservations = false;
          this.alertService.error(
            'Error al obtener reservas',
            err.error.message || 'Hubo un error inesperado'
          );
        }
      });
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.link).then(() => {
      this.copySuccess = true;
      setTimeout(() => (this.copySuccess = false), 1500);
    });
  }

  get whatsappUrl(): string {
    const text = encodeURIComponent(
      `¡Hola! puedes hacer tu reserva en ${this.venue.name} fácilmente desde este link: ${this.link}`
    );
    return `https://wa.me/?text=${text}`;
  }

  private formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
