import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home-admin',
        loadComponent: () =>
          import('./features/dashboard/home-admin/home-admin.component').then(
            m => m.HomeAdminComponent
          )
      },

      // Rutas de cancha
      {
        path: 'field',
        loadComponent: () =>
          import('./features/field/components/field-detail/field-detail.component').then(
            m => m.FieldDetailComponent
          )
      },
      {
        path: 'field/list',
        loadComponent: () =>
          import('./features/field/components/fields-list/fields-list.component').then(
            m => m.FieldsListComponent
          )
      },
      {
        path: 'field/form',
        loadComponent: () =>
          import('./features/field/components/field-form/field-form.component').then(
            m => m.FieldFormComponent
          )
      },
      {
        path: 'field/form/:id',
        loadComponent: () =>
          import('./features/field/components/field-form/field-form.component').then(
            m => m.FieldFormComponent
          )
      },

      // Rutas de reserva
      {
        path: 'reservation/list',
        loadComponent: () =>
          import(
            './features/reservation/components/reservation-list/reservation-list.component'
          ).then(m => m.ReservationListComponent)
      },
      {
        path: 'reservation/form/field/:id',
        loadComponent: () =>
          import(
            './features/reservation/components/reservation-form/reservation-form.component'
          ).then(m => m.ReservationFormComponent)
      },

      {
        path: 'player/list',
        loadComponent: () =>
          import('./features/user/components/player-list/player-list.component').then(
            m => m.PlayerListComponent
          )
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user/components/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./shared/components/menu/menu.component').then(m => m.MenuComponent)
      }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
