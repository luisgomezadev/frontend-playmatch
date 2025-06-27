import { Component } from '@angular/core';
import { StatusRequest, TeamApplication } from '../../interfaces/team-application';
import { TeamApplicationService } from '../../services/team-application.service';
import { UserPlayer } from '../../../../core/interfaces/user';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { StatusRequestPipe } from '../../../../pipes/status-request.pipe';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-application-list',
  standalone: true,
  imports: [CommonModule, DatePipe, StatusRequestPipe, ButtonActionComponent],
  templateUrl: './team-application-list.component.html',
  styleUrl: './team-application-list.component.scss'
})
export class TeamApplicationListComponent {
  applications: TeamApplication[] = [];
  user!: UserPlayer;
  StatusRequest = StatusRequest;
  isOwner: boolean = false;

  constructor(
    private teamApplicationService: TeamApplicationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });

    if (this.user.team) {
      if (this.user.team.ownerId == this.user.id) {
        this.isOwner = true;
      }
      this.teamApplicationService.getTeamApplicationsByTeam(this.user.team?.id)
        .subscribe(apps => this.applications = apps.reverse());
    } else {
      this.teamApplicationService.getTeamApplicationsByPlayer(this.user.id)
        .subscribe(apps => this.applications = apps.reverse());
    }
  }

  getDescription(status: StatusRequest): string {
    if(status === StatusRequest.ACCEPTED) return 'aceptar'
    else return 'rechazar'
  }

  handle(id: number, status: StatusRequest) {
    Swal.fire({
      text: `Estas seguro de ${this.getDescription(status)} la solicitud?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${this.getDescription(status)}`,
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.teamApplicationService.handleTeamApplication(id, status).subscribe({
          next: () => {
            const updatedApp = this.applications.find(app => app.id === id);
            if (updatedApp) {
              updatedApp.statusRequest = status;
              Swal.fire({
                icon: 'success',
                title: 'Solicitud respondida',
                text: 'Has respondido la solicitud correctamente.',
                confirmButtonText: 'Aceptar',
                customClass: { confirmButton: 'swal-confirm-btn' },
                buttonsStyling: false,
              });
            }
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al responder solicitud',
              text: err?.error?.message || 'No se pudo responder a la solicitud.',
              confirmButtonText: 'Aceptar',
              customClass: { confirmButton: 'swal-confirm-btn' },
              buttonsStyling: false,
            });
          }
        });
      }
    });
  }

  validateOwnership(application: TeamApplication) {
    return application.player.id === this.user.id;
  }
}
