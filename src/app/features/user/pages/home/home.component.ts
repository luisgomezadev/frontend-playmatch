import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Reservation } from '@reservation/interfaces/reservation';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { User } from '@user/interfaces/user';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    LayoutComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);

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
      }
    });
  }

}
