import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErrorResponse } from '@core/interfaces/error-response';
import { PagedResponse } from '@core/interfaces/paged-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { Field } from '@field/interfaces/field';
import { FieldService } from '@field/services/field.service';
import { ReservationCardComponent } from '@reservation/components/reservation-card/reservation-card.component';
import { ReservationFilterComponent } from '@reservation/components/reservation-filter/reservation-filter.component';
import {
  Reservation,
  ReservationFilter,
  StatusReservation
} from '@reservation/interfaces/reservation';
import { ReservationService } from '@reservation/services/reservation.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { LoadingReservationCardComponent } from '@shared/components/loading/loading-reservation-card/loading-reservation-card.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PAGE_SIZE_RESERVATIONS } from '@shared/constants/app.constants';
import { StatusReservationPipe } from '@shared/pipes/status-reservation.pipe';
import { User, UserRole } from '@user/interfaces/user';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent,
    LoadingReservationCardComponent,
    FormsModule,
    ReservationCardComponent,
    ReservationFilterComponent,
    LayoutComponent,
    PaginationComponent,
    StatusReservationPipe
  ],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly fieldService = inject(FieldService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertService = inject(AlertService);

  reservationList!: PagedResponse<Reservation>;
  formFilter!: FormGroup;
  filters = signal<ReservationFilter>({});
  user!: User;
  showModalFilters = false;
  loading = false;
  placeholders = Array(6);
  currentPage = 0;
  pageSize = PAGE_SIZE_RESERVATIONS;
  field!: Field;
  reservationBy!: 'user' | 'field';
  selectedType: 'user' | 'field' | null = null;

  StatusReservation = StatusReservation;

  ngOnInit(): void {
    this.initForm();
    this.initUser();
  }

  // --- Inicialización ---
  private initForm(): void {
    this.formFilter = this.formBuilder.group({
      date: [''],
      status: ['']
    });
  }

  private initUser(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) return;
      this.user = user;
      if (user.role === UserRole.FIELD_ADMIN) {
        this.reservationBy = 'field';
        this.getField();
      } else {
        this.reservationBy = 'user';
        this.setFiltersAndFetchReservations();
      }
    });
  }

  get isFieldView(): boolean {
    return this.reservationBy === 'field';
  }

  isUserAdmin(user: User): boolean {
    return user.role === UserRole.FIELD_ADMIN;
  }

  isReservationUser(): boolean {
    return this.reservationBy === 'user';
  }

  isReservationField(): boolean {
    return this.reservationBy === 'field';
  }

  hasActiveReservation(): boolean {
    return this.reservationList?.content?.some(r => r.status === StatusReservation.ACTIVE);
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.reservationList.totalPages) {
      this.currentPage = newPage;
      this.getReservations(this.currentPage);
    }
  }

  openModalFilters(): void {
    this.showModalFilters = true;
    document.body.style.overflow = 'hidden';
  }

  closeModalFilters(): void {
    this.showModalFilters = false;
    document.body.style.overflow = '';
  }

  filter(formFilter: ReservationFilter): void {
    this.filters.set(formFilter);
    this.currentPage = 0;
    this.getReservations(0);
  }

  cleanFilter(): void {
    this.formFilter.reset({ date: null, status: '' });
    this.filters.update(f => {
      const copy = { ...f };
      delete copy.date;
      delete copy.status;
      return copy;
    });
    this.currentPage = 0;
    this.getReservations(0);
  }

  makeReservation(): void {
    if (this.hasActiveReservation()) {
      this.alertService.notify(
        'Tienes una reserva activa',
        'Debes cancelarla si deseas hacer una nueva reserva.',
        'warning'
      );
    } else {
      this.router.navigate(['/dashboard/field/list']);
    }
  }

  private setFiltersAndFetchReservations(): void {
    if (this.isReservationField()) {
      this.filters.update(f => ({ ...f, fieldId: this.field.id }));
    } else {
      this.filters.update(f => ({ ...f, userId: this.user.id }));
    }
    this.getReservations(0);
  }

  private getField(): void {
    this.loading = true;
    this.fieldService.getFieldByAdminId(this.user.id).subscribe({
      next: (data: Field) => {
        if (data) {
          this.field = data;
          this.setFiltersAndFetchReservations();
        } else {
          this.loading = false;
        }
      },
      error: err => this.handleError(err)
    });
  }

  getReservations(page: number): void {
    this.loading = true;
    this.reservationService.getReservationFiltered(this.filters(), page, this.pageSize).subscribe({
      next: data => {
        this.reservationList = data;
        this.loading = false;
      },
      error: err => this.handleError(err)
    });
  }

  private handleError(err: ErrorResponse): void {
    this.loading = false;
    this.alertService.error('Error', err.error?.message || 'Algo salió mal');
  }
}
