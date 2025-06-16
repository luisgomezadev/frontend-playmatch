import { Component, Input } from '@angular/core';
import { UserPlayer } from '../../../../../core/interfaces/user';
import { AuthService } from '../../../../../core/services/auth.service';
import { TeamService } from '../../../../team/services/team.service';
import Swal from 'sweetalert2';

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

  constructor(
    private authService: AuthService,
    private teamService: TeamService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    console.log(this.players);
  }

  deletePlayerOfTeam(player: UserPlayer) {
    Swal.fire({
      title: '¿Estás seguro de eliminar jugador?',
      text: `Esta acción eliminará al jugador ${player.firstName} ${player.lastName} permanentemente de tu equipo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed && this.user.team) {
        this.teamService.deletePlayerOfTeam(this.user.team.id, player.id).subscribe({
          next: () => {
            this.players = this.players.filter((p) => p.id !== player.id);
            Swal.fire({
              icon: 'success',
              title: 'Jugador eliminado',
              text: `Sacaste a ${player.firstName} ${player.lastName} de tu equipo.`,
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false,
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al sacar jugador',
              text: err?.error?.errorMessage || 'No se pudo sacar jugador.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false,
            });
          },
        });
      }
    });
  }
}
