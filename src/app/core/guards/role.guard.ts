import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

function checkRole(): Observable<boolean> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  const tokenRole = authService.getClaimsFromToken()?.role;

  return authService.checkAuth().pipe(
    map((isAuth) => {
      if (!isAuth || !tokenRole) {
        authService.logout();
        alertService.error('Error', 'No estás autenticado');
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      authService.logout();
      router.navigate(['/login']);
      return of(false);
    })
  );
}

export const roleGuard: CanActivateFn = () =>
  checkRole();
