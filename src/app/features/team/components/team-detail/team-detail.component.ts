import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { TeamService } from '../../services/team.service';
import { UserPlayer } from '../../../../core/interfaces/user';
import { Team } from '../../interfaces/team';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { ReservationListComponent } from '../../../reservation/components/reservation-list/reservation-list.component';
import { Reservation } from '../../../reservation/interfaces/reservation';
import { PlayerTableComponent } from '../../../dashboard/player/components/player-table/player-table.component';
import { WithoutTeamComponent } from '../without-team/without-team.component';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonActionComponent, ReservationListComponent, PlayerTableComponent, WithoutTeamComponent],
  templateUrl: './team-detail.component.html',
  styleUrl: './team-detail.component.scss'
})
export class TeamDetailComponent {
  user!: UserPlayer;
  team!: Team;
  teamId!: number;
  loading = false;
  reservationList: Reservation[] = [];
  playerList: UserPlayer[] = [];
  teamEmpty: boolean = false;

  constructor(private route: ActivatedRoute, private teamService: TeamService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        if (this.isUserPlayer(user) && user.team) {
          this.teamId = user.team.id;
          this.getTeam();
        }
      }
    });
  }

  private isUserPlayer(user: any): user is UserPlayer {
    return 'team' in user;
  }

  isOwnerTeam(): boolean {
    console.log(this.team)

    return this.user.id == this.team.ownerId;
  }

  getTeam() {
      this.loading = true;
      // this.editing = true;
      this.teamService.getTeamById(this.teamId).subscribe({
        next: (value: Team) => {
          this.loading = false;
          this.getTeamDetails(value);
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: 'No se puedo cargar la información de la cancha',
            timer: 3000
          })
        },
      })
    }
  
  getTeamDetails(team: Team) {
    if (team) {
      this.team = team;
      this.playerList = this.team.members;
      team.reservations.forEach(re => re.team = this.team);
      this.reservationList = team.reservations.slice(-2).reverse();
    }
  }

  leaveTeam() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción te dejará sin equipo temporalmente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'No, quedarse',
      customClass: { confirmButton: 'swal-confirm-btn', cancelButton: 'swal-cancel-btn' },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed && this.team) {
        this.teamService.deletePlayerOfTeam(this.team.id, this.user.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sin equipo',
              text: `Has salido del equipo de ${this.team.name}.`,
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false
            });
            this.teamEmpty = true;
            this.authService.setUser({ ...this.user, team: null });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al salirte del equipo',
              text: err?.error?.errorMessage || 'No se pudo salir del equipo.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false
            });
          }
        });
      }
    });
  }

  deleteTeam() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el equipo permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: { confirmButton: 'swal-confirm-btn', cancelButton: 'swal-cancel-btn' },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed && this.team) {
        this.teamService.deleteTeam(this.team.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Equipo eliminado',
              text: 'El equipo ha sido eliminado correctamente.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false
            });
            this.teamEmpty = true;
            this.authService.setUser({ ...this.user, team: null });
          },
          error: (err) => {
            console.error('Error al eliminar el equipo:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el equipo',
              text: err?.error?.errorMessage || 'No se pudo eliminar el equipo.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false
            });
          }
        });
      }
    });
  }
}
