import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorResponse } from '@core/interfaces/error-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { ScrollService } from '@core/services/scroll.service';
import { Field } from '@features/field/interfaces/field';
import { FieldService } from '@features/field/services/field.service';
import { Status, Venue, VenueRequest } from '@features/venue/interfaces/venue';
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
  private readonly fieldService = inject(FieldService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly scrollService = inject(ScrollService);

  venueForm!: FormGroup;
  loading = false;
  venueData = signal<Venue | null>(null);
  fieldsData: Field[] = [];

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
              this.venueData.set(venue);
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
    });
  }

  private loadVenue(venue: Venue): void {
    this.loadFields(venue.id);

    this.venueForm.patchValue({
      id: venue.id,
      name: venue.name,
      city: venue.city,
      address: venue.address,
      code: venue.code,
      openingHour: venue.openingHour,
      closingHour: venue.closingHour,
      adminId: venue.adminId
    });
  }

  loadFields(venueId: number): void {
    this.fieldService.getFieldsByVenueId(venueId).subscribe({
      next: fields => {
        this.fieldsData = fields;
      }
    });
  }

  onSubmit(): void {
    if (this.venueForm.invalid) {
      this.venueForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const formValue = this.venueForm.value;
    const venueId = formValue.id ? formValue.id : null;

    const request: VenueRequest = {

      name: formValue.name,
      code: formValue.code,
      city: formValue.city,
      address: formValue.address,
      openingHour: formValue.openingHour,
      closingHour: formValue.closingHour,
      adminId: formValue.adminId

    };
    if (venueId) {
      this.venueService.updateVenue(request, venueId).subscribe({
        next: res => {
          this.loading = false;
          this.venueData.set(res);
          this.loadFields(res.id);
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
      this.venueService.createVenue(request).subscribe({
        next: res => {
          this.loading = false;
          this.venueData.set(res);
          this.loadFields(res.id);
          this.alertService.success(
            'Complejo deportivo creado',
            res.name + ' registrado en el sistema, ahora puedes crear las canchas.'
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
