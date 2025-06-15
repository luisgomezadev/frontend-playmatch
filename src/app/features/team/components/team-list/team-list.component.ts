import { Component, Input } from '@angular/core';
import { User } from '../../../../core/interfaces/user';
import { Team } from '../../interfaces/team';
import { TeamService } from '../../services/team.service';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss'
})
export class TeamListComponent {

  user!: User;
  teamList: Team[] = [];
  @Input() showHeader: boolean = true;

  constructor(private teamService: TeamService, private authService: AuthService, private route: ActivatedRoute){
    this.route.queryParams.subscribe(params => {
      if (params['showHeader'] !== undefined) {
        this.showHeader = params['showHeader'] !== 'false';
      }
    });
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teamList = data;
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar la lista de equipos',
          timer: 2000
        })
      },
    })
  }

}
