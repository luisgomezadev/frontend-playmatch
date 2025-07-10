import { Component, Input } from '@angular/core';
import { User } from '../../../../core/interfaces/user';
import { Team } from '../../interfaces/team';
import { TeamService } from '../../services/team.service';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeamApplicationService } from '../../../team-application/services/team-application.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { TeamApplicationRequest } from '../../../team-application/interfaces/team-application';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonActionComponent, RouterModule, LoadingComponent],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss',
})
export class TeamListComponent {
  user!: User;
  teamList: Team[] = [];
  @Input() showHeader: boolean = true;

  selectedTeam: Team | null = null;
  showModal = false;
  applicationForm!: FormGroup;

  loading = false;

  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private teamApplicationService: TeamApplicationService,
    private fb: FormBuilder,
    private router: Router
  ) {

    this.applicationForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    });

    this.route.queryParams.subscribe((params) => {
      if (params['showHeader'] !== undefined) {
        this.showHeader = params['showHeader'] !== 'false';
      }
    });
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    this.getTeams();
  }

  getTeams() {
    this.loading = true;
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.loading = false;
        this.teamList = data;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: err.error.message || 'Error al cargar la lista de equipos',
          timer: 2000,
        });
      },
    });
  }

  openModal(team: Team) {
    this.selectedTeam = team;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.applicationForm.reset();
  }

  submitApplication() {
    if (this.applicationForm.invalid || !this.selectedTeam) return;

    const request: TeamApplicationRequest = {
      playerId: this.user.id,
      teamId: this.selectedTeam.id,
      description: this.applicationForm.value.description,
    };

    this.teamApplicationService.sendTeamApplication(request)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Solicitud enviada',
            text: `Has enviado una solicitud para unirte al equipo ${this.selectedTeam?.name}.`,
            confirmButtonText: 'OK',
            customClass: { confirmButton: 'swal-confirm-btn' },
            buttonsStyling: false,
          });
          this.closeModal();
          this.router.navigate(['/dashboard/requests']);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar solicitud',
            text:
              err?.error?.message || 'No se enviar la solicitud.',
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'swal-confirm-btn' },
            buttonsStyling: false,
          });
          this.closeModal();
        },
      })
  }

  getImageUrl(team: Team): string {
    return team.imageUrl?.startsWith('http')
      ? team.imageUrl
      : '/assets/team.webp';
  }
}
