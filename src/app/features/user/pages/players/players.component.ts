import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createEmptyPagedResponse } from '@core/interfaces/paged-response';
import { AlertService } from '@core/services/alert.service';
import { PlayerCardComponent } from '@features/user/components/player-card/player-card.component';
import { User, UserRole } from '@features/user/interfaces/user';
import { UserService } from '@features/user/services/user.service';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PAGE_SIZE_PLAYERS } from '@shared/constants/app.constants';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    LayoutComponent,
    ReactiveFormsModule,
    PlayerCardComponent,
    PaginationComponent
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly fb = inject(FormBuilder);

  role: UserRole = UserRole.PLAYER;

  players = signal(createEmptyPagedResponse<User>());
  currentPage = 0;
  pageSize = PAGE_SIZE_PLAYERS;
  loading = false;
  filterForm: FormGroup;

  constructor() {
    this.filterForm = this.fb.group({
      name: [''],
      city: ['']
    });
  }

  ngOnInit(): void {
    this.getPlayers(this.currentPage);
  }

  getPlayers(page: number): void {
    this.loading = true;
    this.userService.getUsers(page, this.pageSize, this.role).subscribe({
      next: data => {
        this.players.set(data);
        this.currentPage = data.number;
        this.loading = false;
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
    if (newPage >= 0 && newPage < this.players().totalPages) {
      this.getPlayers(newPage);
    }
  }

  applyFilters() {
    const filters = this.filterForm.value;
    console.log('Aplicando filtros:', filters);
    // Aquí llamas a tu API o filtras tu lista local
  }

  clearFilters() {
    this.filterForm.reset();
  }
}
