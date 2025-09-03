import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CountReservationCardComponent } from '@features/user/components/count-reservation-card/count-reservation-card.component';
import { Field } from '@field/interfaces/field';
import { FieldService } from '@field/services/field.service';
import { ReservationCardComponent } from '@reservation/components/reservation-card/reservation-card.component';
import { Reservation } from '@reservation/interfaces/reservation';
import { ReservationService } from '@reservation/services/reservation.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { LoadingReservationCardComponent } from '@shared/components/loading/loading-reservation-card/loading-reservation-card.component';
import { User, UserRole } from '@user/interfaces/user';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    RouterModule,
    ReservationCardComponent,
    CommonModule,
    ButtonComponent,
    LoadingReservationCardComponent,
    LayoutComponent,
    CountReservationCardComponent
  ],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss'
})
export class HomeAdminComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fieldService = inject(FieldService);
  private readonly reservationService = inject(ReservationService);

  user!: User;
  fullName = '';
  reservationsActive = 0;
  reservationsFinished = 0;
  reservationsCanceled = 0;
  fieldName = 'No tienes cancha registrada';
  fieldId = 0;
  loading = false;
  loadingReservations = false;
  lastThreeReservations: Reservation[] = [];
  placeholders = Array(3);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.fullName = `${this.user.firstName} ${this.user.lastName}`;
        this.getFieldByAdmin(user);
      }
    });
  }

  public isUserAdmin(user: User): boolean {
    return user.role == UserRole.FIELD_ADMIN;
  }

  hasField(): boolean {
    return this.fieldName != 'No tienes cancha registrada';
  }

  getFieldByAdmin(user: User) {
    this.loading = true;
    this.fieldService.getFieldByAdminId(user.id).subscribe({
      next: (field: Field) => {
        if (field) {
          this.fieldName = field.name;
          this.fieldId = field.id;
          this.loadingReservations = true;
          this.reservationService.getCountActiveByField(field.id).subscribe({
            next: value => {
              this.loading = false;
              this.reservationsActive = value;
            }
          });
          this.reservationService.getCountFinishedByField(field.id).subscribe({
            next: value => {
              this.loading = false;
              this.reservationsFinished = value;
            }
          });
          this.reservationService.getCountCanceledByField(field.id).subscribe({
            next: value => {
              this.loading = false;
              this.reservationsCanceled = value;
            }
          });
          this.getLastThreeReservations();
        } else {
          this.loading = false;
        }
      }
    });
  }

  getLastThreeReservations() {
    this.reservationService.getLastThreeReservationsByField(this.fieldId).subscribe({
      next: reservations => {
        this.loadingReservations = false;
        this.lastThreeReservations = reservations;
      },
      error: err => {
        this.loadingReservations = false;
        console.error(err);
      }
    });
  }
}
