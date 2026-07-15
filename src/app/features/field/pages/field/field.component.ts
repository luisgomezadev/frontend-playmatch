import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorResponse } from '@core/interfaces/error-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { Field, FieldRequest, FieldType } from '@features/field/interfaces/field';
import { FieldService } from '@features/field/services/field.service';
import { VenueService } from '@features/venue/services/venue.service';
import { CreateVenueCardComponent } from '@shared/components/create-venue-card/create-venue-card.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { FieldTypePipe } from '@shared/pipes/field-type.pipe';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [LayoutComponent, ReactiveFormsModule, CommonModule, MoneyFormatPipe, FieldTypePipe, CreateVenueCardComponent],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent implements OnInit {
  private readonly fieldService = inject(FieldService);
  private readonly authService = inject(AuthService);
  private readonly venueService = inject(VenueService);
  private readonly alertService = inject(AlertService);

  fieldForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    hourlyRate: new FormControl(0, [Validators.required, Validators.min(0)]),
    fieldType: new FormControl(FieldType.FIVE_A_SIDE, [Validators.required]),
  });

  venueId = signal<number | null>(null);
  fields = signal<Field[]>([]);

  fieldTypeOptions = [
    { value: FieldType.FIVE_A_SIDE, label: 'Fútbol 5' },
    { value: FieldType.SIX_A_SIDE, label: 'Fútbol 6' },
    { value: FieldType.SEVEN_A_SIDE, label: 'Fútbol 7' },
    { value: FieldType.EIGHT_A_SIDE, label: 'Fútbol 8' },
    { value: FieldType.NINE_A_SIDE, label: 'Fútbol 9' },
    { value: FieldType.ELEVEN_A_SIDE, label: 'Fútbol 11' }
  ];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) return;
      this.getVenue(user.id);
    });
  }

  private getVenue(adminId: number): void {
    this.venueService.getVenueByAdminId(adminId).subscribe({
      next: (venue) => {
        if (venue) {
          this.venueId.set(venue.id);
          this.getFields(this.venueId());
        }
      },
      error: (err: ErrorResponse) => {
          this.alertService.error(
            'Error al obtener complejo deportivo',
            err.error.message || 'Error inesperado'
          );
        }
    });
  }

  private getFields(venueId: number | null): void {
    if (!venueId) return;
    this.fieldService.getFieldsByVenueId(venueId).subscribe({
      next: (fields: Field[]) => {
        this.fields.set(fields);
      },
      error: (err: ErrorResponse) => {
        this.alertService.error(
          'Error al obtener canchas',
          err.error.message || 'Error inesperado'
        );
      }
    });
  }

  selectFieldType(value: FieldType) {
    this.fieldForm.get('fieldType')?.setValue(value);
  }

  onSubmit(): void {
    if (this.fieldForm.invalid) {
      this.fieldForm.markAllAsTouched();
      return;
    }

    const fieldId = this.fieldForm.value.id;

    const fieldRequest: FieldRequest = {
      name: this.fieldForm.value.name!,
      hourlyRate: this.fieldForm.value.hourlyRate!,
      fieldType: this.fieldForm.value.fieldType!,
      venueId: this.venueId()!,
    };

    if (fieldId) {
      this.fieldService.updateField(fieldRequest, fieldId).subscribe({
        next: (res: Field) => {
          this.alertService.success(
            'Cancha actualizada',
            'La información de ' + res.name + ' ha sido actualizada.'
          );
          this.getFields(this.venueId());
          this.resetFieldForm();
        },
        error: (err: ErrorResponse) => {
          this.alertService.error(
            'Error al actualizar cancha',
            err.error.message || 'Error inesperado'
          );
        }
      });
    } else {
      this.fieldService.createField(fieldRequest).subscribe({
        next: (res) => {
          this.alertService.success(
            'Cancha registrada',
            res.name + ' ha sido creada exitosamente.'
          );
          this.getFields(this.venueId());
          this.resetFieldForm();
        },
        error: (err: ErrorResponse) => {
          this.alertService.error(
            'Error al crear cancha',
            err.error.message || 'Error inesperado'
          );
        }
      });
    }
  }

  editField(field: Field): void {
    this.fieldForm.patchValue({
      id: field.id,
      name: field.name,
      hourlyRate: field.hourlyRate,
      fieldType: field.fieldType
    });
  }

  deleteField(fieldId: number): void {
    this.alertService
      .confirm('¿Eliminar cancha?', '¿Estás seguro de eliminar la cancha? Las reservas de esta cancha no se eliminaran', 'Si, eliminar', 'No')
      .then(confirmed => {
        if (confirmed) {
          this.fieldService.deleteFieldById(fieldId).subscribe({
            next: () => {
              this.alertService.success('Cancha eliminada', 'Has eliminado la cancha correctamente.');
              this.getFields(this.venueId());
            },
            error: (err: ErrorResponse) => {
              this.alertService.error(
                'Error al eliminar cancha',
                err.error.message || 'Error inesperado'
              );
            }
          });
        }
      });
  }

  private resetFieldForm(): void {
    this.fieldForm.reset({
      id: null,
      name: '',
      hourlyRate: 0,
      fieldType: FieldType.FIVE_A_SIDE
    });
  }
}
