import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { roleChildGuard, roleGuard } from './core/guards/role.guard';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [roleGuard], // valida el acceso base al dashboard
    canActivateChild: [roleChildGuard], // valida todos los hijos
    data: { roles: ['PLAYER', 'FIELD_ADMIN'] },
    children: [
      {
        path: 'home-admin',
        loadComponent: () =>
          import('./features/user/pages/home-admin/home-admin.component').then(
            m => m.HomeAdminComponent
          ),
        data: { roles: ['FIELD_ADMIN'] }
      },
      {
        path: 'field',
        loadComponent: () =>
          import('./features/field/components/field-detail/field-detail.component').then(
            m => m.FieldDetailComponent
          ),
        data: { roles: ['FIELD_ADMIN'] }
      },
      {
        path: 'field/list',
        loadComponent: () =>
          import('./features/field/components/fields-list/fields-list.component').then(
            m => m.FieldsListComponent
          ),
        data: { roles: ['FIELD_ADMIN', 'PLAYER'] }
      },
      {
        path: 'field/form',
        loadComponent: () =>
          import('./features/field/components/field-form/field-form.component').then(
            m => m.FieldFormComponent
          ),
        data: { roles: ['FIELD_ADMIN'] }
      },
      {
        path: 'field/form/:id',
        loadComponent: () =>
          import('./features/field/components/field-form/field-form.component').then(
            m => m.FieldFormComponent
          ),
        data: { roles: ['FIELD_ADMIN'] }
      },
      {
        path: 'reservation/list',
        loadComponent: () =>
          import('./features/reservation/pages/reservation-list/reservation-list.component').then(
            m => m.ReservationListComponent
          ),
        data: { roles: ['PLAYER', 'FIELD_ADMIN'] }
      },
      {
        path: 'reservation/calendar',
        loadComponent: () =>
          import(
            './features/reservation/pages/reservation-calendar/reservation-calendar.component'
          ).then(m => m.ReservationCalendarComponent),
        data: { roles: ['FIELD_ADMIN'] }
      },
      {
        path: 'reservation/form/field/:id',
        loadComponent: () =>
          import('./features/reservation/pages/reservation-form/reservation-form.component').then(
            m => m.ReservationFormComponent
          ),
        data: { roles: ['PLAYER'] }
      },
      {
        path: 'player/list',
        loadComponent: () =>
          import('./features/user/components/player-list/player-list.component').then(
            m => m.PlayerListComponent
          ),
        data: { roles: ['PLAYER'] }
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user/components/profile/profile.component').then(
            m => m.ProfileComponent
          ),
        data: { roles: ['PLAYER', 'FIELD_ADMIN'] }
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./shared/components/menu/menu.component').then(m => m.MenuComponent),
        data: { roles: ['PLAYER', 'FIELD_ADMIN'] }
      }
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
