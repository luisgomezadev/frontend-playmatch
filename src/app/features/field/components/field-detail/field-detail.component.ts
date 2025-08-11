import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FieldService } from '../../services/field.service';
import { Field, Status } from '../../interfaces/field';
import Swal from 'sweetalert2';
import { CommonModule, Location } from '@angular/common';
import { StatusDescriptionPipe } from '../../../../shared/pipes/status-description.pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { TimeFormatPipe } from '../../../../shared/pipes/time-format.pipe';
import { MoneyFormatPipe } from '../../../../shared/pipes/money-format.pipe';
import { User, UserRole } from '../../../user/interfaces/user';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { Reservation } from '../../../reservation/interfaces/reservation';
import { LoadingFieldComponent } from '../../../../shared/components/loading/loading-field/loading-field.component';
import { ReservationCardComponent } from '../../../reservation/components/reservation-card/reservation-card.component';

@Component({
  selector: 'app-field-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatusDescriptionPipe,
    TimeFormatPipe,
    MoneyFormatPipe,
    ButtonActionComponent,
    ReservationCardComponent,
    LoadingFieldComponent
  ],
  templateUrl: './field-detail.component.html',
  styleUrl: './field-detail.component.scss'
})
export class FieldDetailComponent {

  private route = inject(ActivatedRoute);
  private fieldService = inject(FieldService)
  private authService = inject(AuthService);
  private location = inject(Location);

  user!: User;
  field: Field | null = null;
  fieldId!: number;
  loading = false;
  Status = Status;
  reservationList: Reservation[] = [];

  constructor() { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        if (this.isUserAdmin(user)) {
          this.getField();
        }
      }
    });

    this.fieldId = +this.route.snapshot.paramMap.get('id')!;
    if (this.fieldId) {
      this.getField();
    }
  }

  public isUserAdmin(user: User): boolean {
    return user.role == UserRole.FIELD_ADMIN;
  }

  isOwnerField(): boolean {
    return (
      !!this.user && !!this.field && !!this.field.admin && this.user.id === this.field.admin.id
    );
  }

  getField() {
    this.loading = true;
    this.fieldService.getFieldByAdminId(this.user.id).subscribe({
      next: (data: Field) => {
        this.loading = false;
        this.getFieldDetails(data);
      },
      error: err => {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: err.error.message || 'No se puedo cargar la información de la cancha',
          timer: 3000
        });
      }
    });
  }

  getFieldDetails(field: Field) {
    if (field) {
      this.field = field;
      field.reservations.forEach(re => (re.field = this.field!));
      this.reservationList = field.reservations.slice(-2).reverse();
    }
  }

  deleteField() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el campo permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed && this.field) {
        this.fieldService.deleteField(this.field.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Campo eliminado',
              text: 'El campo ha sido eliminado correctamente.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false
            });
            this.field = null;
          },
          error: err => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el campo',
              text: err?.error?.message || 'No se pudo eliminar el campo.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false
            });
          }
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }
}
