import { Component, Input } from '@angular/core';
import { Field } from '../../interfaces/field';
import { FieldService } from '../../services/field.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User, UserRole } from '../../../../core/interfaces/user';
import { MoneyFormatPipe } from '../../../../pipes/money-format.pipe';
import { TimeFormatPipe } from '../../../../pipes/time-format.pipe';
import { CommonModule, Location } from '@angular/common';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import Swal from 'sweetalert2';
import { ReservationService } from '../../../reservation/services/reservation.service';
import { firstValueFrom } from 'rxjs';
import { LoadingFieldListComponent } from '../../../../shared/components/loading/loading-field-list/loading-field-list.component';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [
    RouterModule,
    MoneyFormatPipe,
    TimeFormatPipe,
    CommonModule,
    ButtonActionComponent,
    LoadingFieldListComponent
  ],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss',
})
export class FieldsListComponent {
  fields: Field[] = [];
  user!: User;
  loading = false;
  showModal: boolean = false;
  showButtonBack: boolean = false;


  @Input() showHeader: boolean = true;

  constructor(
    private fieldService: FieldService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private reservationService: ReservationService
  ) {
    this.showButtonBack = !this.router.url.includes('home-player');
    this.route.queryParams.subscribe((params) => {
      if (params['showHeader'] !== undefined) {
        this.showHeader = params['showHeader'] !== 'false';
      }
    });
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    this.loadFields();
  }

  isUserPlayer(user: User): boolean {
    return user.role == UserRole.PLAYER;
  }

  loadFields() {
    this.loading = true;
    this.fields = [];
    this.fieldService.getFieldsActive().subscribe({
      next: (data) => {
        this.loading = false;
        this.fields = data;
      },
      error: (err) => {
        this.loading = false;
        console.error(
          'Error cargando canchas',
          err.error.message || 'Error desconocido'
        );
      },
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
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  goToLogin(): void {
    this.closeModal();
    this.location.go('/login');
  }

  goToRegister(): void {
    this.closeModal();
    this.location.go('/register');
  }

  makeReservation(fieldId: number): void {
    this.hasActiveReservation().then(hasReservation => {
      if (hasReservation) {
        Swal.fire({
          title: 'Tienes una reserva activa',
          text: 'Debes cancelarla si deseas hacer una nueva reserva.',
          icon: 'warning',
          customClass: { confirmButton: 'swal-confirm-btn' },
          buttonsStyling: false,
        });
        this.router.navigate(['/dashboard/reservation/list']);
      } else {
        this.router.navigate(['/dashboard/reservation/form/field', fieldId]);
      }
    });
  }

  async hasActiveReservation(): Promise<boolean> {
    const count = await firstValueFrom(
      this.reservationService.getCountActiveByUser(this.user.id)
    );
    return count > 0;
  }

}
