import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonActionComponent } from '../../../shared/components/button-action/button-action.component';
import { Field } from '../../field/interfaces/field';
import { FieldService } from '../../field/services/field.service';
import { ReservationService } from '../../reservation/services/reservation.service';
import { User } from '../../user/interfaces/user';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [RouterModule, ButtonActionComponent, CommonModule],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss',
})
export class HomeAdminComponent {
  user!: User;
  fullName: string = '';
  reservationsActive: number = 0;
  reservationsFinished: number = 0;
  reservationsCanceled: number = 0;
  fieldName: string = 'No tienes cancha registrada';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private fieldService: FieldService,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.fullName = `${this.user.firstName} ${this.user.lastName}`;
        this.getFieldByAdmin(user);
      }
    });
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
          this.reservationService
            .getCountActiveByField(field.id)
            .subscribe({
              next: (value) => {
                this.loading = false;
                this.reservationsActive = value;
              },
            });
          this.reservationService
            .getCountFinishedByField(field.id)
            .subscribe({
              next: (value) => {
                this.loading = false;
                this.reservationsFinished = value;
              },
            });
          this.reservationService
            .getCountCanceledByField(field.id)
            .subscribe({
              next: (value) => {
                this.loading = false;
                this.reservationsCanceled = value;
              },
            });
        } else {
          this.loading = false;
        }
      }
    })
  }
}
