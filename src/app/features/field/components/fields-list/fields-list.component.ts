import { CommonModule, Location } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PagedResponse } from '@core/interfaces/paged-response';
import { AuthService } from '@core/services/auth.service';
import { FieldCardComponent } from '@field/components/field-card/field-card.component';
import { Field, FieldFilter } from '@field/interfaces/field';
import { FieldService } from '@field/services/field.service';
import { LoadingFieldListComponent } from '@shared/components/loading/loading-field-list/loading-field-list.component';
import { User, UserRole } from '@user/interfaces/user';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    LoadingFieldListComponent,
    FieldCardComponent,
    ReactiveFormsModule
  ],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss'
})
export class FieldsListComponent implements OnInit {
  private readonly fieldService = inject(FieldService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);

  @Input() showHeader = true;
  formFilter!: FormGroup;
  fields!: PagedResponse<Field>;
  filters: FieldFilter = {};
  user!: User;
  loading = false;
  showModal = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['showHeader'] !== undefined) {
        this.showHeader = params['showHeader'] !== 'false';
      }
    });
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.initForm();
    this.loadFields();
  }

  private initForm(): void {
    this.formFilter = this.fb.group({ city: [''], minPrice: [''], maxPrice: [''] });
  }

  isUserPlayer(user: User): boolean {
    return user.role == UserRole.PLAYER;
  }

  loadFields() {
    this.loading = true;
    this.fieldService.getFields().subscribe({
      next: data => {
        this.loading = false;
        this.fields = data;
      },
      error: err => {
        this.loading = false;
        console.error('Error cargando canchas', err.error.message || 'Error desconocido');
      }
    });
  }

  isFieldOpen(opening: string, closing: string): boolean {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMin] = opening.split(':').map(Number);
    const [closeHour, closeMin] = closing.split(':').map(Number);

    const openingMinutes = openHour * 60 + openMin;
    const closingMinutes = closeHour * 60 + closeMin;

    return nowMinutes >= openingMinutes && nowMinutes <= closingMinutes;
  }

  goBack(): void {
    this.location.back();
  }

}
