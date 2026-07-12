import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authPagesGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map(isAuth => {
      if (isAuth) {
        return router.createUrlTree(['/dashboard']);
      }
      return true;
    }),
    catchError(() => of(true))
  );
};
