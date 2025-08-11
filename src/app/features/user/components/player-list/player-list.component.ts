import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { PagedResponse } from '../../../../core/interfaces/paged-response';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingPlayersComponent } from '../../../../shared/components/loading/loading-players/loading-players.component';
import { User, UserRole } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, LoadingPlayersComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {

  private userService = inject(UserService);
  private authService = inject(AuthService);

  user!: User;
  players!: PagedResponse<User>;
  loading: boolean = false;

  currentPage: number = 0;
  pageSize: number = 8;
  role: UserRole = UserRole.PLAYER;

  constructor() {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
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
        Swal.fire({
          title: 'Error',
          text: err.error.message || 'Error al cargar la lista de jugadores',
          timer: 2000
        });
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
