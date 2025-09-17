import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ScrollService } from '@core/services/scroll.service';
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

  user!: User;
  venue!: Venue;
  loading = false;
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
          this.link = this.urlBase + this.venue.code;
        }
        this.loading = false;
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
}
