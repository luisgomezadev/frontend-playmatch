import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Reservation, ReservationFilter, StatusReservation } from '../../interfaces/reservation';
import { PagedResponse } from '../../../../core/interfaces/paged-response';
import { User, UserRole } from '../../../user/interfaces/user';

import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../../../core/services/auth.service';

import Swal from 'sweetalert2';

// Pipes y componentes
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { Field } from '../../../field/interfaces/field';
import { FieldService } from '../../../field/services/field.service';
import { ReservationCardComponent } from '../reservation-card/reservation-card.component';
import { LoadingReservationCardComponent } from '../../../../shared/components/loading/loading-reservation-card/loading-reservation-card.component';
import { ReservationCalendarComponent } from '../reservation-calendar/reservation-calendar.component';

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
    ReservationCardComponent
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

  @Input() reservations!: Reservation[];

  reservationList!: PagedResponse<Reservation>;
  formFilter!: FormGroup;

  user!: User;
  calendarView: boolean = false;
  showModal = false;
  showModalFilters = false;
  listOfDetailsField = false;
  loading = false;
  showFilters = false;
  isSmallScreen = false;

  currentPage = 0;
  pageSize = 9;

  field!: Field;
  reservationBy!: string;
  filters: ReservationFilter = {};
  selectedItem: any = null;
  selectedType: 'user' | 'field' | null = null;

  StatusReservation = StatusReservation;

  constructor() {}

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
    this.showFilters = !this.isSmallScreen;
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
      this.getReservations(0);
    } else if (view === 'calendar') {
      this.getAllReservationsActive();
    }
  }

  openModalFilters(): void {
    this.showModalFilters = true;
  }

  closeModalFilters(): void {
    this.showModalFilters = false;
  }

  filter(): void {
    const { reservationDate, status } = this.formFilter.value;
    this.filters.date = reservationDate || undefined;
    this.filters.status = status || undefined;
    this.getReservations(0);
    this.showFilters = false;
    this.showModalFilters = false;
  }

  cleanFilter(): void {
    this.formFilter.reset({ reservationDate: null, status: '' });
    delete this.filters.date;
    delete this.filters.status;
    this.getReservations(0);
    this.showFilters = false;
    this.showModalFilters = false;
  }

  makeReservation(): void {
    if (this.hasActiveReservation()) {
      Swal.fire({
        title: 'Tienes una reserva activa',
        text: 'Debes cancelarla si deseas hacer una nueva reserva.',
        icon: 'warning',
        customClass: { confirmButton: 'swal-confirm-btn' },
        buttonsStyling: false
      });
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

  private handleError(err: any): void {
    this.loading = false;
    Swal.fire('Error', err.error.message || 'No se pudo cargar las reservas', 'error');
  }
}
