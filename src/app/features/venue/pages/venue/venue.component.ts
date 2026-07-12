import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ErrorResponse } from '@core/interfaces/error-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { ScrollService } from '@core/services/scroll.service';
import { Field, FieldType } from '@features/field/interfaces/field';
import { Status, Venue } from '@features/venue/interfaces/venue';
import { VenueService } from '@features/venue/services/venue.service';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { LoadingTextComponent } from '@shared/components/loading-text/loading-text.component';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';

@Component({
  selector: 'app-venue',
  standalone: true,
  imports: [LayoutComponent, ReactiveFormsModule, CommonModule, LoadingTextComponent, TimeFormatPipe, MoneyFormatPipe],
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly venueService = inject(VenueService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly scrollService = inject(ScrollService);

  venueForm!: FormGroup;
  loading = false;
  venueData: Venue | null = null;

  fieldTypeOptions = [
    { value: FieldType.FIVE_A_SIDE, label: '5 vs 5' },
    { value: FieldType.SIX_A_SIDE, label: '6 vs 6' },
    { value: FieldType.SEVEN_A_SIDE, label: '7 vs 7' },
    { value: FieldType.EIGHT_A_SIDE, label: '8 vs 8' },
    { value: FieldType.NINE_A_SIDE, label: '9 vs 9' },
    { value: FieldType.ELEVEN_A_SIDE, label: '11 vs 11' }
  ];

  dropdownIndex: number | null = null;

  statusTypes = Object.values(Status);

  ngOnInit(): void {

    this.scrollService.scrollToTop();

    this.initForm();

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.venueForm.patchValue({ adminId: user.id });

        this.venueService.getVenueByAdminId(user.id).subscribe({
          next: venue => {
            if (venue) {
              this.venueData = venue;
              this.loadVenue(venue);
            }
          }
        });
      }
    });
  }

  private initForm(): void {
    this.venueForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z0-9-]+$/)
        ]
      ],
      openingHour: ['', Validators.required],
      closingHour: ['', Validators.required],
      adminId: [null, Validators.required],
      status: [Status.ACTIVE, Validators.required],
      fields: this.formBuilder.array([this.createFieldGroup()])
    });
  }

  private loadVenue(venue: Venue): void {
    this.fields.clear();

    venue.fields.forEach((field: Field) => {
      this.fields.push(
        this.formBuilder.group({
          id: [field.id],
          name: [
            field.name,
            [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
          ],
          fieldType: [field.fieldType, Validators.required],
          hourlyRate: [field.hourlyRate, [Validators.required, Validators.min(0)]]
        })
      );
    });

    this.venueForm.patchValue({
      id: venue.id,
      name: venue.name,
      city: venue.city,
      address: venue.address,
      code: venue.code,
      openingHour: venue.openingHour,
      closingHour: venue.closingHour,
      adminId: venue.admin ? venue.admin.id : null,
      status: venue.status
    });
  }

  createFieldGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      fieldType: [FieldType.FIVE_A_SIDE, Validators.required],
      hourlyRate: [null, [Validators.required, Validators.min(0)]]
    });
  }

  get fields(): FormArray {
    return this.venueForm.get('fields') as FormArray;
  }

  addField(): void {
    this.fields.push(this.createFieldGroup());
  }

  removeField(index: number): void {
    this.fields.removeAt(index);
  }

  getFieldTypeLabel(index: number): string {
    const currentValue = this.fields.at(index).get('fieldType')?.value;
    const option = this.fieldTypeOptions.find(opt => opt.value === currentValue);
    return option ? option.label : 'Seleccionar';
  }

  toggleDropdown(index: number) {
    this.dropdownIndex = this.dropdownIndex === index ? null : index;
  }

  selectFieldType(index: number, value: FieldType) {
    this.fields.at(index).get('fieldType')?.setValue(value);
  }

  onSubmit(): void {
    if (this.venueForm.invalid) {
      this.venueForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const venueRequest = this.venueForm.value;

    if (venueRequest.id) {
      this.venueService.updateVenue(venueRequest).subscribe({
        next: res => {
          this.loading = false;
          this.venueData = res;
          this.alertService.success(
            'Complejo deportivo actualizado',
            'La información de ' + res.name + ' ha sido actualizada.'
          );
        },
        error: (err: ErrorResponse) => {
          this.loading = false;
          this.alertService.error(
            'Error al actualizar complejo',
            err.error.message || 'Error inesperado'
          );
        }
      });
    } else {
      this.venueService.createVenue(venueRequest).subscribe({
        next: res => {
          this.loading = false;
          this.venueData = res;
          this.alertService.success(
            'Complejo deportivo creado',
            res.name + ' registrado en el sistema, listo para que los usuarios lo puedan reservar.'
          );
          this.venueForm.patchValue({ id: res.id });
        },
        error: (err: ErrorResponse) => {
          this.loading = false;
          this.alertService.error(
            'Error al registrar complejo',
            err.error.message || 'Error inesperado'
          );
        }
      });
    }
  }
}
