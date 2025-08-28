import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, Observable, of, map } from 'rxjs';
import { AlertService } from '@core/services/alert.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  const allowedRoles: string[] = route.data['roles'] || [];
  const tokenRole = authService.getClaimsFromToken()?.role;

  return authService.checkAuth().pipe(
    map((isAuth) => {
      console.log(isAuth);
      console.log(tokenRole);
      console.log(allowedRoles);

      if (!isAuth || !tokenRole || !allowedRoles.includes(tokenRole)) {
        authService.logout();
        alertService.error('Error', 'No estas autenticado o no tienes permisos para estar en esta vista');
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
};
