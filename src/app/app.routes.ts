import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { roleGuard } from './core/guards/role.guard';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { authPagesGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authPagesGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authPagesGuard]
  },
  {
    path: 'venue',
    loadComponent: () =>
      import('./features/venue/pages/venue-list/venue-list.component').then(
        m => m.VenueListComponent
      )
  },
  {
    path: 'reservation',
    loadComponent: () =>
      import('./features/reservation/pages/reservation-detail/reservation-detail.component').then(
        m => m.ReservationDetailComponent
      )
  },
  {
    path: 'reservation/:code',
    loadComponent: () =>
      import('./features/reservation/pages/reservation-form/reservation-form.component').then(
        m => m.ReservationFormComponent
      )
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [roleGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/user/pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'venue',
        loadComponent: () =>
          import('./features/venue/pages/venue/venue.component').then(
            m => m.VenueComponent
          )
      },
      {
        path: 'field/form',
        loadComponent: () =>
          import('./features/field/pages/field-form/field-form.component').then(
            m => m.FieldFormComponent
          )
      },
      {
        path: 'reservation',
        loadComponent: () =>
          import('./features/reservation/pages/reservation-list/reservation-list.component').then(
            m => m.ReservationListComponent
          )
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import(
            './features/reservation/pages/reservation-calendar/reservation-calendar.component'
          ).then(m => m.ReservationCalendarComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user/pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
