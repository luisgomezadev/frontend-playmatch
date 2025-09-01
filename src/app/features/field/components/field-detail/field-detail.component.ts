import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { Field, Status } from '@field/interfaces/field';
import { FieldService } from '@field/services/field.service';
import { ButtonActionComponent } from '@shared/components/button-action/button-action.component';
import { LoadingFieldComponent } from '@shared/components/loading/loading-field/loading-field.component';
import { User, UserRole } from '@user/interfaces/user';
import { FieldDetailCardComponent } from '../field-detail-card/field-detail-card.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';

@Component({
  selector: 'app-field-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FieldDetailCardComponent,
    ButtonActionComponent,
    LoadingFieldComponent,
    LayoutComponent
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

}
