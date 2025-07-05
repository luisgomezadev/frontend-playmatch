import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { HomeAdminComponent } from './features/dashboard/admin/components/home-admin/home-admin.component';
import { FieldDetailComponent } from './features/field/components/field-detail/field-detail.component';
import { FieldFormComponent } from './features/field/components/field-form/field-form.component';
import { ProfileComponent } from './features/dashboard/profile/profile.component';
import { HomePlayerComponent } from './features/dashboard/player/components/home-player/home-player.component';
import { PlayerListComponent } from './features/dashboard/player/components/player-list/player-list.component';
import { TeamDetailComponent } from './features/team/components/team-detail/team-detail.component';
import { TeamFormComponent } from './features/team/components/team-form/team-form.component';
import { TeamListComponent } from './features/team/components/team-list/team-list.component';
import { FieldsListComponent } from './features/field/components/fields-list/fields-list.component';
import { ReservationListComponent } from './features/reservation/components/reservation-list/reservation-list.component';
import { TeamAddPlayerComponent } from './features/team/components/team-add-player/team-add-player.component';
import { ReservationFormComponent } from './features/reservation/components/reservation-form/reservation-form.component';
import { ProfileFormComponent } from './features/dashboard/profile/profile-form/profile-form.component';
import { TeamApplicationListComponent } from './features/team-application/components/team-application-list/team-application-list.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home-admin', component: HomeAdminComponent },
      { path: 'home-player', component: HomePlayerComponent },

      // Rutas de cancha
      { path: 'field', component: FieldDetailComponent },
      { path: 'field/detail/:id', component: FieldDetailComponent },
      { path: 'field/list', component: FieldsListComponent },
      { path: 'field/form', component: FieldFormComponent },
      { path: 'field/form/:id', component: FieldFormComponent },

      // Rutas de equipo
      { path: 'team', component: TeamDetailComponent },
      { path: 'team/form', component: TeamFormComponent },
      { path: 'team/form/:id', component: TeamFormComponent },
      { path: 'team/list', component: TeamListComponent },
      { path: 'add/player', component: TeamAddPlayerComponent },

      // Rutas de reserva
      { path: 'reservation/list/:var', component: ReservationListComponent },
      {
        path: 'reservation/form/field/:id',
        component: ReservationFormComponent,
      },

      // Ruta de solicitud
      {
        path: 'requests',
        component: TeamApplicationListComponent,
      },

      { path: 'player/list', component: PlayerListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/:user/:id', component: ProfileFormComponent },
    ],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }, // opcional para manejar rutas inválidas
];
