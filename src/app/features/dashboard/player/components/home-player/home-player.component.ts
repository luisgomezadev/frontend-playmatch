import { Component } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { User, UserPlayer } from '../../../../../core/interfaces/user';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../../../reservation/services/reservation.service';

@Component({
  selector: 'app-home-player',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-player.component.html',
  styleUrl: './home-player.component.scss'
})
export class HomePlayerComponent {

  user!: UserPlayer;
  fullName: string = '';
  reservationsActive: number = 0;
  reservationsFinished: number = 0;
  teamName: string = 'No pertenes a ningun equipo';
  
  constructor(
    private authService: AuthService,
    private reservationService: ReservationService){
  
  }
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.fullName = `${this.user.firstName} ${this.user.lastName}`;
        if (this.user.team?.id) {
          console.log(this.user.team)
          this.teamName = this.user.team?.name;
          this.reservationService.getCountActiveByTeam(this.user.team.id).subscribe({
            next: (value) => {
              this.reservationsActive = value;
            }
          });
          this.reservationService.getCountFinishedByTeam(this.user.team.id).subscribe({
            next: (value) => {
              this.reservationsFinished = value;
            }
          });
        }
      }
    });
  }

}
