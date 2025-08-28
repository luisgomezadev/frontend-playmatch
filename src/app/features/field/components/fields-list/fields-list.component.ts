import { CommonModule, Location } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { FieldCardComponent } from '@field/components/field-card/field-card.component';
import { Field } from '@field/interfaces/field';
import { FieldService } from '@field/services/field.service';
import { ReservationService } from '@reservation/services/reservation.service';
import { ButtonActionComponent } from '@shared/components/button-action/button-action.component';
import { LoadingFieldListComponent } from '@shared/components/loading/loading-field-list/loading-field-list.component';
import { User, UserRole } from '@user/interfaces/user';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ButtonActionComponent,
    LoadingFieldListComponent,
    FieldCardComponent
  ],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss'
})
export class FieldsListComponent implements OnInit {
  private fieldService = inject(FieldService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private router = inject(Router);
  private reservationService = inject(ReservationService);
  private alertService = inject(AlertService);

  @Input() showHeader = true;
  fields: Field[] = [];
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
    this.loadFields();
  }

  isUserPlayer(user: User): boolean {
    return user.role == UserRole.PLAYER;
  }

  loadFields() {
    this.loading = true;
    this.fields = [];
    this.fieldService.getFieldsActive().subscribe({
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

  openModal(): void {
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    document.body.style.overflow = '';
  }

  goToLogin(): void {
    this.closeModal();
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.closeModal();
    this.router.navigate(['/register']);
  }

  makeReservation(fieldId: number): void {
    this.hasActiveReservation().then(hasReservation => {
      if (hasReservation) {
        this.alertService.notify(
          'Tienes una reserva activa',
          'Debes cancelarla si deseas hacer una nueva reserva.',
          'warning'
        );
        this.router.navigate(['/dashboard/reservation/list']);
      } else {
        this.router.navigate(['/dashboard/reservation/form/field', fieldId]);
      }
    });
  }

  async hasActiveReservation(): Promise<boolean> {
    const count = await firstValueFrom(this.reservationService.getCountActiveByUser(this.user.id));
    return count > 0;
  }
}
