import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FieldService } from '../../services/field.service';
import { Field, Status } from '../../interfaces/field';
import Swal from 'sweetalert2';
import { CommonModule, Location } from '@angular/common';
import { StatusDescriptionPipe } from '../../../../pipes/status-description.pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { TimeFormatPipe } from '../../../../pipes/time-format.pipe';
import { MoneyFormatPipe } from '../../../../pipes/money-format.pipe';
import { UserAdmin } from '../../../../core/interfaces/user';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { ReservationListComponent } from '../../../reservation/components/reservation-list/reservation-list.component';
import { Reservation } from '../../../reservation/interfaces/reservation';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

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
    ReservationListComponent,
    LoadingComponent
  ],
  templateUrl: './field-detail.component.html',
  styleUrl: './field-detail.component.scss',
})
export class FieldDetailComponent {
  user!: UserAdmin;
  field: Field | null = null;
  fieldId!: number;
  loading = false;
  Status = Status;
  reservationList: Reservation[] = [];

  constructor(
    private route: ActivatedRoute,
    private fieldService: FieldService,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        if (this.isUserAdmin(user) && user.field) {
          this.fieldId = user.field.id;
          this.getField();
        }
      }
    });

    this.fieldId = +this.route.snapshot.paramMap.get('id')!;
    if (this.fieldId) {
      this.getField();
    }
  }

  public isUserAdmin(user: any): user is UserAdmin {
    return 'field' in user;
  }

  isOwnerField(): boolean {
    return (
      !!this.user &&
      !!this.field &&
      !!this.field.admin &&
      this.user.documentNumber === this.field.admin.documentNumber
    );
  }

  getField() {
    this.loading = true;
    // this.editing = true;
    this.fieldService.getFieldById(this.fieldId).subscribe({
      next: (value: Field) => {
        this.loading = false;
        this.getFieldDetails(value);
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: 'No se puedo cargar la información de la cancha',
          timer: 3000,
        });
      },
    });
  }

  getFieldDetails(field: Field) {
    if (field) {
      this.field = field;
      field.reservations.forEach((re) => (re.field = this.field!));
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
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed && this.field) {
        this.fieldService.deleteField(this.field.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Campo eliminado',
              text: 'El campo ha sido eliminado correctamente.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false,
            });
            this.field = null;
            this.authService.setUser({ ...this.user, field: null });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el campo',
              text: err?.error?.errorMessage || 'No se pudo eliminar el campo.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false,
            });
          },
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
