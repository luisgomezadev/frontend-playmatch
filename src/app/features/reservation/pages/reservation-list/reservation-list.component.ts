import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { Venue } from '@features/venue/interfaces/venue';
import { VenueService } from '@features/venue/services/venue.service';
import { ReservationService } from '@reservation/services/reservation.service';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { Reservation } from '@features/reservation/interfaces/reservation';
import { ErrorResponse } from '@core/interfaces/error-response';
import { AlertService } from '@core/services/alert.service';
import { ReservationCardComponent } from '@features/reservation/components/reservation-card/reservation-card.component';
import { ScrollService } from '@core/services/scroll.service';
import { CreateVenueCardComponent } from '@shared/components/create-venue-card/create-venue-card.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent, ReservationCardComponent, CreateVenueCardComponent],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly venueService = inject(VenueService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly scrollService = inject(ScrollService);
  private readonly destroyRef = inject(DestroyRef);

  venue!: Venue;

  loading = false;
  loadingVenue = false;

  currentDate: Date = new Date();
  reservations: Reservation[] = [];

  ngOnInit(): void {
    this.scrollService.scrollToTop();

    this.loadingVenue = true;
    this.authService.currentUser$
      .pipe(
        switchMap(user => {
          if (!user) return EMPTY;
          return this.venueService.getMyVenue();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: data => {
          this.loadingVenue = false;
          if (data) {
            this.venue = data;
            this.loadReservations();
          }
        },
        error: (err: ErrorResponse) => {
          this.loadingVenue = false;
          this.alertService.error(
            'Error al obtener información del complejo deportivo',
            err.error.message || 'Hubo un error inesperado'
          );
        }
      });
  }

  prevDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.loadReservations();
  }

  nextDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.loadReservations();
  }

  private formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadReservations(): void {
    if (!this.venue) return;
    this.loading = true;
    const formattedDate = this.formatDateLocal(this.currentDate);
    this.reservationService
      .getReservationsByVenueIdAndDate(this.venue.id, formattedDate)
      .subscribe({
        next: data => {
          this.loading = false;
          this.reservations = data;
        },
        error: (err: ErrorResponse) => {
          this.loading = false;
          this.alertService.error(
            'Error al obtener reservas',
            err.error.message || 'Hubo un error inesperado'
          );
        }
      });
  }

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