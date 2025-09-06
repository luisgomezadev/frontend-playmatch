import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PagedResponse } from '@core/interfaces/paged-response';
import { AlertService } from '@core/services/alert.service';
import { PlayerCardComponent } from '@features/user/components/player-card/player-card.component';
import { PlayerFilterComponent } from '@features/user/components/player-filter/player-filter.component';
import { User, UserFilter, UserRole } from '@features/user/interfaces/user';
import { UserService } from '@features/user/services/user.service';
import { ButtonComponent } from '@shared/components/button/button.component';
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
    PaginationComponent,
    ButtonComponent,
    PlayerFilterComponent
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly formBuilder = inject(FormBuilder);

  role: UserRole = UserRole.PLAYER;

  formFilter!: FormGroup;
  players!: PagedResponse<User>;
  filters: UserFilter = {};
  currentPage = 0;
  pageSize = PAGE_SIZE_PLAYERS;
  loading = false;
  showModalFilters = false;

  constructor() {
    this.formFilter = this.formBuilder.group({
      name: [''],
      city: ['']
    });
  }

  ngOnInit(): void {
    this.loadPlayers(0);
  }

  loadPlayers(page: number): void {
    this.loading = true;
    this.userService.getUsers(this.filters, page, this.pageSize, this.role).subscribe({
      next: data => {
        this.players = data;
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

  openModalFilters(): void {
    this.showModalFilters = true;
    document.body.style.overflow = 'hidden';
  }

  closeModalFilters(): void {
    this.showModalFilters = false;
    document.body.style.overflow = '';
  }

  filter(formFilter: UserFilter): void {
    this.filters = formFilter;
    this.loadPlayers(0);
  }

  cleanFilter(): void {
    this.formFilter.reset();
    this.filters = {};
    this.loadPlayers(0);
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.players.totalPages) {
      this.currentPage = newPage;
      this.loadPlayers(this.currentPage);
    }
  }
}
