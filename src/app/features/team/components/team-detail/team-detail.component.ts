import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserPlayer } from '../../../../core/interfaces/user';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { PlayerTableComponent } from '../../../dashboard/player/components/player-table/player-table.component';
import { Team } from '../../interfaces/team';
import { TeamService } from '../../services/team.service';
import { WithoutTeamComponent } from '../without-team/without-team.component';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonActionComponent,
    PlayerTableComponent,
    WithoutTeamComponent,
    LoadingComponent,
  ],
  templateUrl: './team-detail.component.html',
  styleUrl: './team-detail.component.scss',
})
export class TeamDetailComponent {
  user!: UserPlayer;
  team!: Team;
  teamId!: number;
  loading = false;
  loadingImage = false;
  playerList: UserPlayer[] = [];
  teamEmpty: boolean = false;

  showImageModal = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
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
          text: err.error.message || 'No se puedo cargar la información de la cancha',
          timer: 3000,
        });
      },
    });
  }

  getTeamDetails(team: Team) {
    if (team) {
      this.team = team;
      this.playerList = this.team.members;
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
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed && this.team) {
        this.teamService
          .deletePlayerOfTeam(this.team.id, this.user.id)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Sin equipo',
                text: `Has salido del equipo de ${this.team.name}.`,
                confirmButtonText: 'Aceptar',
                customClass: { confirmButton: 'swal-confirm-btn' },
                buttonsStyling: false,
              });
              this.teamEmpty = true;
              this.authService.setUser({ ...this.user, team: null });
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Error al salirte del equipo',
                text: err?.error?.message || 'No se pudo salir del equipo.',
                confirmButtonText: 'Aceptar',
                customClass: { confirmButton: 'swal-confirm-btn' },
                buttonsStyling: false,
              });
            },
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
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
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
              buttonsStyling: false,
            });
            this.teamEmpty = true;
            this.authService.setUser({ ...this.user, team: null });
          },
          error: (err) => {
            console.error('Error al eliminar el equipo:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el equipo',
              text: err?.error?.message || 'No se pudo eliminar el equipo.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false,
            });
          },
        });
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result);
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onCancelImageUpload() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.showImageModal = false;
  }

  onUploadImage() {
    if (!this.selectedFile) return;

    const file = this.selectedFile;

    if (!file.type.startsWith('image/')) {
      this.showErrorAlert(
        'Formato no válido',
        'Por favor, selecciona un archivo de imagen.'
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.showErrorAlert(
        'Tamaño de archivo demasiado grande',
        'El archivo debe ser menor a 2MB.'
      );
      return;
    }
    this.loadingImage = true;

    this.teamService.uploadTeamImage(this.teamId, file).subscribe({
      next: (updatedUser) => this.handleSuccess(updatedUser),
      error: (err) => {
        this.showErrorAlert('Error al subir la imagen', err.message);
        this.loadingImage = false;
      },
    });
  }

  private handleSuccess(updatedTeam: Team) {
    // Actualizar el observable del usuario actual
    this.authService.setUser({
      ...this.user,
      team: updatedTeam,
    });
    this.loadingImage = false;
    Swal.fire({
      icon: 'success',
      title: 'Foto Actualizada',
      text: 'Tu imagen de equipo ha sido cambiada.',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
      buttonsStyling: false,
    });

    // Reset modal
    this.showImageModal = false;
    this.selectedFile = null;
    this.imagePreview = null;

    // Asignar nuevo usuario localmente
    this.user = {
      ...this.user,
      team: updatedTeam
    };
  }

  private showErrorAlert(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
      buttonsStyling: false,
    });
  }

  getImageUrl(team: Team): string {
    return team.imageUrl?.startsWith('http')
      ? team.imageUrl
      : '/assets/team.webp';
  }
}
