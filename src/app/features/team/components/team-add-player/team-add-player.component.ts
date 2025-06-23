import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { PlayerService } from '../../../dashboard/player/services/player.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User, UserPlayer } from '../../../../core/interfaces/user';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { TeamService } from '../../services/team.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { WithoutTeamComponent } from '../without-team/without-team.component';

@Component({
  selector: 'app-team-add-player',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonActionComponent, WithoutTeamComponent],
  templateUrl: './team-add-player.component.html',
  styleUrl: './team-add-player.component.scss',
})
export class TeamAddPlayerComponent {
  searchForm: FormGroup;
  player!: UserPlayer | null;
  loading = false;
  loadingPlayer = false;
  user!: UserPlayer;
  teamId!: number;

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private teamService: TeamService,
    private authService: AuthService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        if (this.isUserPlayer(user) && user.team) {
          this.teamId = user.team.id;
        }
      }
    });
  }

  private isUserPlayer(user: any): user is UserPlayer {
    return 'team' in user;
  }

  isOwner(): boolean {
    return this.user.id == this.user.team?.ownerId;
  }

  searchPlayer() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const email = this.searchForm.value.email;

    this.playerService.getPlayerByEmail(email).subscribe({
      next: (res) => {
        this.player = res;
        this.loading = false;
      },
      error: () => {
        this.player = null;
        this.loading = false;
        Swal.fire('Jugador no encontrado', '', 'warning');
      },
    });
  }

  cancelAddPlayer() {
    this.player = null;
    this.searchForm.reset();
  }

  addToTeam(playerId: number) {
    if (this.isOwner()) {
      this.loadingPlayer = true;
      this.teamService.addMemberToTeam(this.teamId, playerId).subscribe({
        next: (response) => {
          this.loadingPlayer = false;
          Swal.fire(response.message, 'Jugador inscrito', 'success');
          this.router.navigate(['/dashboard/team']);
        },
        error: (err) => {
          this.loadingPlayer = false;
          Swal.fire(
            'Error al inscribir jugador',
            err.error.errorMessage || 'Error desconocido',
            'error'
          );
        },
      });
    } else {
      Swal.fire('No eres dueño del equipo', '', 'error');
    }
  }
}
