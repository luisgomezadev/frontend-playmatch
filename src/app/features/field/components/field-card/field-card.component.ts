import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { ReservationService } from '@features/reservation/services/reservation.service';
import { User } from '@features/user/interfaces/user';
import { Field } from '@field/interfaces/field';
import { ButtonActionComponent } from '@shared/components/button-action/button-action.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-field-card',
  standalone: true,
  imports: [ButtonActionComponent, RouterModule],
  templateUrl: './field-card.component.html',
  styleUrl: './field-card.component.scss'
})
export class FieldCardComponent implements OnInit {
  private router = inject(Router);
  private reservationService = inject(ReservationService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  @Input() field!: Field;

  user!: User;

  isOpen = signal(false);
  showModal = false;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
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
    if (this.user) {
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
    } else {
      this.openModal();
    }
  }

  async hasActiveReservation(): Promise<boolean> {
    const count = await firstValueFrom(this.reservationService.getCountActiveByUser(this.user.id));
    return count > 0;
  }
}
