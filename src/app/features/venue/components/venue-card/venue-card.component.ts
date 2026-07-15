import { Component, inject, Input, signal } from '@angular/core';
import { Venue } from '@features/venue/interfaces/venue';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FieldTypeToPlayersPipe } from '@shared/pipes/fieldTypeToPlayers.pipe';
import { FieldService } from '@features/field/services/field.service';
import { Field } from '@features/field/interfaces/field';
import { AlertService } from '@core/services/alert.service';
import { ErrorResponse } from '@core/interfaces/error-response';

@Component({
  selector: 'app-venue-card',
  standalone: true,
  imports: [ModalComponent, MoneyFormatPipe, ButtonComponent, FieldTypeToPlayersPipe],
  templateUrl: './venue-card.component.html',
  styleUrl: './venue-card.component.scss'
})
export class VenueCardComponent {
  private readonly router = inject(Router);
  private readonly fieldService = inject(FieldService);
  private readonly alertService = inject(AlertService);

  @Input() venue!: Venue;

  fields = signal([] as Field[]);

  isOpen = signal(false);

  getFields() {
    this.fields.set([]);
    this.fieldService.getFieldsByVenueId(this.venue.id).subscribe({
      next: (fields) => {
        this.fields.set(fields);
      },
      error: (err: ErrorResponse) => {
          this.alertService.error(
            'Error al obtener canchas',
            err.error.message || 'Hubo un error inesperado'
          );
        }
    });
  }

  openModal(): void {
    this.getFields();
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
