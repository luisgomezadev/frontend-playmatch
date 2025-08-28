import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { Field, Status } from '@field/interfaces/field';
import { FieldService } from '@field/services/field.service';
import { ButtonActionComponent } from '@shared/components/button-action/button-action.component';
import { LoadingFieldComponent } from '@shared/components/loading/loading-field/loading-field.component';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { StatusDescriptionPipe } from '@shared/pipes/status-description.pipe';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';
import { User, UserRole } from '@user/interfaces/user';

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
    LoadingFieldComponent
  ],
  templateUrl: './field-detail.component.html',
  styleUrl: './field-detail.component.scss'
})
export class FieldDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fieldService = inject(FieldService);
  private authService = inject(AuthService);
  private location = inject(Location);
  private alertService = inject(AlertService);

  user!: User;
  field: Field | null = null;
  fieldId!: number;
  loading = false;
  Status = Status;

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
        this.alertService.error(
          'Error',
          err?.error?.message || 'No se puedo cargar la información de la cancha'
        );
      }
    });
  }

  getFieldDetails(field: Field) {
    if (field) {
      this.field = field;
    }
  }

  deleteField() {
    this.alertService
      .confirm('¿Estás seguro?', 'Esta acción eliminará el campo permanentemente.', 'Sí, eliminar')
      .then(result => {
        if (result && this.field) {
          this.fieldService.deleteField(this.field.id).subscribe({
            next: () => {
              this.alertService.success(
                'Campo eliminado',
                'El campo ha sido eliminado correctamente.'
              );
              this.field = null;
            },
            error: err => {
              this.alertService.error(
                'Error al eliminar el campo',
                err?.error?.message || 'No se pudo eliminar el campo.'
              );
            }
          });
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}
