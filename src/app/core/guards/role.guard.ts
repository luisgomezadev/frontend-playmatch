import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivateFn, CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

function checkRole(route: ActivatedRouteSnapshot): Observable<boolean> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  const allowedRoles: string[] = route.data['roles'] || [];
  const tokenRole = authService.getClaimsFromToken()?.role;

  return authService.checkAuth().pipe(
    map((isAuth) => {
      if (!isAuth || !tokenRole || !allowedRoles.includes(tokenRole)) {
        authService.logout();
        alertService.error('Error', 'No estás autenticado o no tienes permisos para estar en esta vista');
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      authService.logout();
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) =>
  checkRole(route);

export const roleChildGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot) =>
  checkRole(route);
