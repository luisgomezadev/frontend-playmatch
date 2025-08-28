import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { roleGuard } from './core/guards/role.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['PLAYER', 'FIELD_ADMIN'] }, // acceso base para dashboard
    children: [
      {
        path: 'home-admin',
        loadComponent: () =>
          import('./features/user/components/home-admin/home-admin.component')
            .then(m => m.HomeAdminComponent),
        canActivate: [roleGuard],
        data: { roles: ['FIELD_ADMIN'] }
      },
      {
        path: 'field',
        loadComponent: () =>
          import('./features/field/components/field-detail/field-detail.component')
            .then(m => m.FieldDetailComponent),
        canActivate: [roleGuard],
        data: { roles: ['FIELD_ADMIN'] }
      },
      {
        path: 'field/list',
        loadComponent: () =>
          import('./features/field/components/fields-list/fields-list.component')
            .then(m => m.FieldsListComponent),
        canActivate: [roleGuard],
        data: { roles: ['FIELD_ADMIN', 'PLAYER'] }
      },
      {
        path: 'field/form',
        loadComponent: () =>
          import('./features/field/components/field-form/field-form.component')
            .then(m => m.FieldFormComponent),
        canActivate: [roleGuard],
        data: { roles: ['FIELD_ADMIN'] }
      },
      {
        path: 'field/form/:id',
        loadComponent: () =>
          import('./features/field/components/field-form/field-form.component')
            .then(m => m.FieldFormComponent),
        canActivate: [roleGuard],
        data: { roles: ['FIELD_ADMIN'] }
      },
      {
        path: 'reservation/list',
        loadComponent: () =>
          import('./features/reservation/pages/reservation-list/reservation-list.component')
            .then(m => m.ReservationListComponent),
        canActivate: [roleGuard],
        data: { roles: ['PLAYER', 'FIELD_ADMIN'] }
      },
      {
        path: 'reservation/form/field/:id',
        loadComponent: () =>
          import('./features/reservation/pages/reservation-form/reservation-form.component')
            .then(m => m.ReservationFormComponent),
        canActivate: [roleGuard],
        data: { roles: ['PLAYER'] }
      },
      {
        path: 'player/list',
        loadComponent: () =>
          import('./features/user/components/player-list/player-list.component')
            .then(m => m.PlayerListComponent),
        canActivate: [roleGuard],
        data: { roles: ['PLAYER'] }
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user/components/profile/profile.component')
            .then(m => m.ProfileComponent),
        canActivate: [roleGuard],
        data: { roles: ['PLAYER', 'FIELD_ADMIN'] }
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./shared/components/menu/menu.component')
            .then(m => m.MenuComponent),
        canActivate: [roleGuard],
        data: { roles: ['PLAYER', 'FIELD_ADMIN'] }
      }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

