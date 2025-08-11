import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { User } from '../../../user/interfaces/user';
import { FieldService } from '../../services/field.service';

@Component({
  selector: 'app-field-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonActionComponent, LoadingComponent],
  templateUrl: './field-form.component.html',
  styleUrl: './field-form.component.scss'
})
export class FieldFormComponent {
  private fb = inject(FormBuilder);
  private fieldService = inject(FieldService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private location = inject(Location);

  fieldForm: FormGroup;
  loading = false;
  userActive!: User;
  editing = false;
  fieldId!: number;
  loadingForm: boolean = false;

  statusOptions = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'INACTIVE', label: 'Inactivo' }
  ];

  constructor() {
    this.fieldForm = this.fb.group({
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
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
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
        Swal.fire('Error', 'No se pudo cargar la información de la cancha', 'error');
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
        Swal.fire({
          icon: 'success',
          title: this.editing ? 'Cancha actualizada' : 'Cancha registrada',
          confirmButtonText: 'Aceptar',
          customClass: { confirmButton: 'swal-confirm-btn' },
          buttonsStyling: false
        });
        this.router.navigate(['/dashboard/field']);
      },
      error: err => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Algo salió mal'
        });
      }
    });
  }
}
