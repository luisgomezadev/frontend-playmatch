import { Component, Input } from '@angular/core';
import { UserPlayer } from '../../../../../core/interfaces/user';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-player-table',
  standalone: true,
  imports: [],
  templateUrl: './player-table.component.html',
  styleUrl: './player-table.component.scss',
})
export class PlayerTableComponent {
  @Input() players: UserPlayer[] = [];
  user!: UserPlayer;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    console.log(this.players);
  }
}
