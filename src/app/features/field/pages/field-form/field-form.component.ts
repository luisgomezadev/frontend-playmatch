import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { FieldService } from '@field/services/field.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { User } from '@user/interfaces/user';

@Component({
  selector: 'app-field-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, LayoutComponent],
  templateUrl: './field-form.component.html',
  styleUrl: './field-form.component.scss'
})
export class FieldFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly fieldService = inject(FieldService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly location = inject(Location);
  private readonly alertService = inject(AlertService);

  fieldForm: FormGroup;
  loading = false;
  userActive!: User;
  editing = false;
  fieldId!: number;
  loadingForm = false;

  statusOptions = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'INACTIVE', label: 'Inactivo' }
  ];

  constructor() {
    this.fieldForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      hourlyRate: [null, [Validators.required, Validators.min(0)]],
      openingHour: ['', Validators.required],
      closingHour: ['', Validators.required],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userActive = user;
      }
    });

    this.fieldId = +this.route.snapshot.paramMap.get('id')!;
    if (this.fieldId) {
      this.editing = true;
      this.loadField();
    }
  }

  goBack(): void {
    this.location.back();
  }

  loadField() {
    this.loadingForm = true;
    this.fieldService.getFieldById(this.fieldId).subscribe({
      next: field => {
        this.fieldForm.patchValue(field);
        this.loadingForm = false;
      },
      error: () => {
        this.loadingForm = false;
        this.alertService.error('Error', 'No se pudo cargar la información de la cancha');
        this.router.navigate(['/dashboard/home-admin']);
      }
    });
  }

  onSubmit() {
    if (this.fieldForm.invalid) return;

    this.loading = true;

    const fieldData = {
      ...this.fieldForm.value,
      status: this.editing ? this.fieldForm.value.status : 'ACTIVE',
      adminId: this.userActive.id
    };

    if (this.editing) {
      fieldData['id'] = this.fieldId;
    }

    const request$ = this.editing
      ? this.fieldService.updateField(fieldData)
      : this.fieldService.createField(fieldData);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.alertService.success(
          this.editing ? 'Cancha actualizada' : 'Cancha registrada',
          this.editing
            ? 'La cancha ha sido actualizada exitosamente.'
            : 'La cancha ha sido registrada exitosamente.'
        );
        this.router.navigate(['/dashboard/field']);
      },
      error: err => {
        this.loading = false;
        this.alertService.error('Error', err.error?.message || 'Algo salió mal');
      }
    });
  }
}
