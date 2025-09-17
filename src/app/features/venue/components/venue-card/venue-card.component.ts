import { Component, inject, Input, signal } from '@angular/core';
import { Venue } from '@features/venue/interfaces/venue';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venue-card',
  standalone: true,
  imports: [ModalComponent, MoneyFormatPipe],
  templateUrl: './venue-card.component.html',
  styleUrl: './venue-card.component.scss'
})
export class VenueCardComponent {
  private readonly router = inject(Router);

  @Input() venue!: Venue;

  isOpen = signal(false);

  openModal(): void {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  onClosed() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }

  goToReservation(): void {
    this.onClosed();
    this.router.navigate(['/reserva/' + this.venue.code]);
  }
}
