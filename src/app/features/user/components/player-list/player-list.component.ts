import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PagedResponse } from '@core/interfaces/paged-response';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { LoadingPlayersComponent } from '@shared/components/loading/loading-players/loading-players.component';
import { User, UserRole } from '@user/interfaces/user';
import { UserService } from '@user/services/user.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, LoadingPlayersComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  user = signal<User | null>(null);
  players!: PagedResponse<User>;
  loading = false;

  currentPage = 0;
  pageSize = 8;
  role: UserRole = UserRole.PLAYER;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user.set(user);
      }
    });
    this.getPlayers(this.currentPage);
  }

  getPlayers(page: number): void {
    this.loading = true;

    this.userService.getUsers(page, this.pageSize, this.role).subscribe({
      next: data => {
        this.loading = false;
        this.players = data;
        this.currentPage = data.number;
      },
      error: err => {
        this.loading = false;
        this.alertService.error(
          'Error',
          err.error?.message || 'Error al cargar la lista de jugadores'
        );
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.players.totalPages) {
      this.getPlayers(newPage);
    }
  }

  getImageUrl(user: User): string {
    return user.imageUrl?.startsWith('http') ? user.imageUrl : '/assets/profile_icon.webp';
  }
}
