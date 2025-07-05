import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../core/interfaces/user';
import { TeamService } from '../../services/team.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ButtonActionComponent } from '../../../../shared/components/button-action/button-action.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonActionComponent, LoadingComponent],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss'
})
export class TeamFormComponent {
  teamForm!: FormGroup;
  loading = false;
  playerId!: number;
  userActive!: User;
  editing = false;
  teamId!: number;
  loadingForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    // Obtener el usuario
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.playerId = user.id;
        this.userActive = user;
        this.teamForm = this.fb.group({
          name: ['', Validators.required],
          neighborhood: ['', Validators.required],
          city: ['Cartagena', Validators.required],
          maxPlayers: [4, [Validators.required, Validators.min(3)]],
          ownerId: [this.playerId, Validators.required]
        });
      }
    });

    // Verificar si hay id en la URL => modo edición
    this.teamId = +this.route.snapshot.paramMap.get('id')!;
    if (this.teamId) {
      this.editing = true;
      this.loadTeam();
    }
  }

  goBack(): void {
    this.location.back();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  loadTeam() {
    this.loadingForm = true;
    this.teamService.getTeamById(this.teamId).subscribe({
      next: (team) => {
        this.teamForm.patchValue(team);
        this.loadingForm = false;
      },
      error: () => {
        this.loadingForm = false;
        Swal.fire('Error', 'No se pudo cargar información del equipo', 'error');
        this.router.navigate(['/dashboard/team']);
      }
    });
  }

  onSubmit() {
    if (this.teamForm.invalid) return;

    this.loading = true;

    const teamData = this.teamForm.value;

    if (this.editing) {
      teamData['id'] = this.teamId; // Añadir el ID si estamos editando
    }

    const request$ = this.editing
      ? this.teamService.updateTeam(teamData)
      : this.teamService.createTeam(teamData);

    request$.subscribe({
      next: (data: any) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: this.editing ? 'Equipo actualizado' : 'Equipo registrado',
          confirmButtonText: 'Aceptar',
          customClass: { confirmButton: 'swal-confirm-btn' },
          buttonsStyling: false,
        });
        this.authService.setUser({ ...this.userActive, team: data });
        this.router.navigate(['/dashboard/team']);
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Algo salió mal',
        });
      }
    });
  }
}
