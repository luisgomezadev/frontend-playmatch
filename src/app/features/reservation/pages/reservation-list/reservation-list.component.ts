import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErrorResponse } from '@core/interfaces/error-response';
import { PagedResponse } from '@core/interfaces/paged-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { Field } from '@field/interfaces/field';
import { FieldService } from '@field/services/field.service';
import { ReservationCalendarComponent } from '@reservation/components/reservation-calendar/reservation-calendar.component';
import { ReservationCardComponent } from '@reservation/components/reservation-card/reservation-card.component';
import { ReservationFilterComponent } from '@reservation/components/reservation-filter/reservation-filter.component';
import {
  Reservation,
  ReservationFilter,
  StatusReservation
} from '@reservation/interfaces/reservation';
import { ReservationService } from '@reservation/services/reservation.service';
import { ButtonActionComponent } from '@shared/components/button-action/button-action.component';
import { LoadingReservationCardComponent } from '@shared/components/loading/loading-reservation-card/loading-reservation-card.component';
import { User, UserRole } from '@user/interfaces/user';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonActionComponent,
    LoadingReservationCardComponent,
    ReservationCalendarComponent,
    FormsModule,
    ReservationCardComponent,
    ReservationFilterComponent
  ],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss'
})
export class ReservationListComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private fieldService = inject(FieldService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);

  @Input() reservations!: Reservation[];

  reservationList!: PagedResponse<Reservation>;
  formFilter!: FormGroup;

  user!: User;
  calendarView = false;
  showModalFilters = false;
  listOfDetailsField = false;
  loading = false;
  isSmallScreen = false;
  placeholders = Array(6);

  currentPage = 0;
  pageSize = 6;

  field!: Field;
  reservationBy!: string;
  filters: ReservationFilter = {};
  selectedType: 'user' | 'field' | null = null;
  infoTitle =
    'Aquí puedes ver todas tus reservas, puedes filtrar por fecha y estado de la reserva.';

  StatusReservation = StatusReservation;

  ngOnInit(): void {
    this.checkScreenSize();
    this.initForm();
    this.initUser();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private initForm(): void {
    this.formFilter = this.fb.group({ reservationDate: [''], status: [''] });
  }

  private initUser(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) return;
      this.user = user;
      if (user.role == 'FIELD_ADMIN') {
        if (this.reservations) {
          this.listOfDetailsField = true;
          this.reservationBy = 'field';
          this.reservationList = {
            content: this.reservations,
            totalPages: 1,
            totalElements: this.reservations.length,
            size: this.reservations.length,
            number: 0
          };
          this.loading = false;
        } else {
          this.reservationBy = 'field';
          this.getField();
        }
      } else {
        this.reservationBy = 'user';
        this.setFiltersAndFetchReservations();
      }
    });
  }

  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 768;
  }

  get isFieldView(): boolean {
    return this.reservationBy === 'field';
  }

  isUserAdmin(user: User): boolean {
    return user.role == UserRole.FIELD_ADMIN;
  }

  isReservationUser(): boolean {
    return this.reservationBy === 'user';
  }

  isReservationField(): boolean {
    return this.reservationBy === 'field';
  }

  private setFiltersAndFetchReservations(): void {
    this.filters = this.isReservationField()
      ? { fieldId: this.field.id }
      : { userId: this.user.id };
    this.getReservations(0);
  }

  getField(): void {
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
    this.reservationService.getReservationFiltered(this.filters, page, this.pageSize).subscribe({
      next: data => {
        this.reservationList = data;
        this.loading = false;
      },
      error: err => this.handleError(err)
    });
  }

  getAllReservationsActive(): void {
    this.reservationService
      .getReservationsByFieldAndStuts(this.field.id, StatusReservation.ACTIVE)
      .subscribe({
        next: data => {
          this.calendarView = true;
          this.reservationList = {
            content: data,
            totalPages: 1,
            totalElements: data.length,
            size: data.length,
            number: 0
          };
          this.loading = false;
        },
        error: err => {
          this.calendarView = false;
          this.handleError(err);
        }
      });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.reservationList.totalPages) {
      this.currentPage = newPage;
      this.getReservations(this.currentPage);
    }
  }

  showView(view: string): void {
    if (view === 'list') {
      this.calendarView = false;
      this.infoTitle =
        'Aquí puedes ver todas tus reservas ordenadas a más recientes. Puedes filtrar por fecha y estado de la reserva.';
      this.getReservations(0);
    } else if (view === 'calendar') {
      this.infoTitle = 'Aquí puedes ver todas las reservas activas en formato calendario.';
      this.getAllReservationsActive();
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
    const { date, status } = formFilter;
    this.filters.date = date || undefined;
    this.filters.status = status || undefined;
    this.currentPage = 0;
    this.getReservations(0);
  }

  cleanFilter(): void {
    this.formFilter.reset({ reservationDate: null, status: '' });
    delete this.filters.date;
    delete this.filters.status;
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

  openList() {
    this.calendarView = false;
    this.getReservations(0);
  }

  openCalendar() {
    this.calendarView = true;
    this.getAllReservationsActive();
  }

  hasActiveReservation(): boolean {
    return this.reservationList?.content?.some(r => r.status === StatusReservation.ACTIVE);
  }

  private handleError(err: ErrorResponse): void {
    this.loading = false;
    this.alertService.error('Error', err.error?.message || 'Algo salió mal');
  }
}
