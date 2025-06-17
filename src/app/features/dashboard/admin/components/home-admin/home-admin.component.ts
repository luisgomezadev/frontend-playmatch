import { Component } from '@angular/core';
import { User, UserAdmin } from '../../../../../core/interfaces/user';
import { AuthService } from '../../../../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../../../reservation/services/reservation.service';
import { ButtonActionComponent } from '../../../../../shared/components/button-action/button-action.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [RouterModule, ButtonActionComponent, CommonModule],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss',
})
export class HomeAdminComponent {
  user!: UserAdmin;
  fullName: string = '';
  reservationsActive: number = 0;
  reservationsFinished: number = 0;
  fieldName: string = 'No tienes cancha registrada';

  constructor(
    private authService: AuthService,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.fullName = `${this.user.firstName} ${this.user.lastName}`;
        if (this.user.field?.id) {
          this.fieldName = this.user.field?.name;
          this.reservationService
            .getCountActiveByField(this.user.field.id)
            .subscribe({
              next: (value) => {
                this.reservationsActive = value;
              },
            });
          this.reservationService
            .getCountFinishedByField(this.user.field.id)
            .subscribe({
              next: (value) => {
                this.reservationsFinished = value;
              },
            });
        }
      }
    });
  }

  hasField(): boolean {
    return this.fieldName != 'No tienes cancha registrada';
  }
}
