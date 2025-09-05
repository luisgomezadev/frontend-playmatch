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
        // obtener role DESPUÉS de confirmar que estamos autenticados
        const role = authService.getClaimsFromToken()?.role;
        if (role === 'PLAYER') {
          return router.createUrlTree(['/dashboard/field/list']);
        } else if (role === 'FIELD_ADMIN') {
          return router.createUrlTree(['/dashboard/home-admin']);
        }
        return router.createUrlTree(['/dashboard']);
      }
      // no autenticado -> permitir acceso a /auth/login o /auth/register
      return true;
    }),
    // en caso de error dejamos pasar al formulario de login (evita bloquear la ruta)
    catchError(() => of(true))
  );
};
