import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PagedResponse } from '@core/interfaces/paged-response';
import { AuthService } from '@core/services/auth.service';
import { FieldFilterComponent } from '@features/field/components/field-filter/field-filter.component';
import { FieldCardComponent } from '@field/components/field-card/field-card.component';
import { Field, FieldFilter } from '@field/interfaces/field';
import { FieldService } from '@field/services/field.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { LoadingFieldListComponent } from '@shared/components/loading/loading-field-list/loading-field-list.component';
import { PAGE_SIZE_FIELDS } from '@shared/constants/app.constants';
import { MoneyFormatPipe } from '@shared/pipes/money-format.pipe';
import { User, UserRole } from '@user/interfaces/user';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    LoadingFieldListComponent,
    FieldCardComponent,
    ReactiveFormsModule,
    ButtonComponent,
    LayoutComponent,
    FieldFilterComponent,
    MoneyFormatPipe
  ],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss'
})
export class FieldsListComponent implements OnInit {
  private readonly fieldService = inject(FieldService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  @Input() showHeader = true;
  formFilter!: FormGroup;
  fields!: PagedResponse<Field>;
  filters: FieldFilter = {};
  user!: User;
  loading = false;
  showModal = false;
  pageSize = PAGE_SIZE_FIELDS;
  currentPage = 0;
  showModalFilters = false;

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
    this.loadFields(0);
  }

  private initForm(): void {
    this.formFilter = this.formBuilder.group({ city: [''], minPrice: [''], maxPrice: [''] });
  }

  isUserPlayer(user: User): boolean {
    return user.role == UserRole.PLAYER;
  }

  loadFields(page: number): void {
    this.loading = true;
    this.fieldService.getFields(this.filters, page, this.pageSize).subscribe({
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

  openModalFilters(): void {
    this.showModalFilters = true;
    document.body.style.overflow = 'hidden';
  }

  closeModalFilters(): void {
    this.showModalFilters = false;
    document.body.style.overflow = '';
  }

  filter(formFilter: FieldFilter): void {
    this.filters = formFilter;
    this.loadFields(0);
  }

  cleanFilter(): void {
    this.formFilter.reset();
    this.filters = {};
    this.loadFields(0);
  }
}
