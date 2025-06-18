import { Component } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { User, UserPlayer } from '../../../../../core/interfaces/user';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../../../reservation/services/reservation.service';
import { ButtonActionComponent } from '../../../../../shared/components/button-action/button-action.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-player',
  standalone: true,
  imports: [RouterModule, ButtonActionComponent, CommonModule],
  templateUrl: './home-player.component.html',
  styleUrl: './home-player.component.scss',
})
export class HomePlayerComponent {
  user!: UserPlayer;
  fullName: string = '';
  reservationsActive: number = 0;
  reservationsFinished: number = 0;
  teamName: string = 'No tienes equipo';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.fullName = `${this.user.firstName} ${this.user.lastName}`;
        if (this.user.team?.id) {
          this.loading = true;
          this.teamName = this.user.team?.name;
          this.reservationService
            .getCountActiveByTeam(this.user.team.id)
            .subscribe({
              next: (value) => {
                this.loading = false;
                this.reservationsActive = value;
              },
            });
          this.reservationService
            .getCountFinishedByTeam(this.user.team.id)
            .subscribe({
              next: (value) => {
                this.loading = false;
                this.reservationsFinished = value;
              },
            });
        }
      }
    });
  }

  hasTeam(): boolean {
    return this.teamName != 'No tienes equipo';
  }
}
