import { Component } from '@angular/core';
import { User, UserPlayer } from '../../../../../core/interfaces/user';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent {
  user!: User;
  playerList: UserPlayer[] = [];
  loading: boolean = false;

  constructor(
    private playerService: PlayerService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.loading = true;
        this.playerService.getPlayers().subscribe({
          next: (data) => {
            this.loading = false;
            this.playerList = data.filter((player) => player.id !== user.id);
          },
          error: (err) => {
            this.loading = false;
            Swal.fire({
              title: 'Error',
              text: 'Error al cargar la lista de jugadores',
              timer: 2000,
            });
          },
        });
      }
    });
  }
}
