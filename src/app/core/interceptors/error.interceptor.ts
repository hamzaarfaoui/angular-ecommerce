import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      // Ignorer l'interception sur les requêtes d'authentification directes pour éviter une boucle infinie
      if (req.url.includes('/token') || req.url.includes('/register')) {
        return throwError(() => error);
      }

      // Si le serveur renvoie une erreur 401 (Non autorisé / Token expiré)
      if (error.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          // Tentative de rafraîchissement de l'access token
          return authService.refreshToken().pipe(
            switchMap((res) => {
              // Rejouer la requête initiale avec le nouvel access token
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.access}` }
              });
              return next(clonedReq);
            }),
            catchError((refreshErr) => {
              // Si le refresh token est également invalide ou expiré, déconnexion forcée
              authService.logout();
              router.navigate(['/auth/login'], { queryParams: { expired: 'true' } });
              return throwError(() => refreshErr);
            })
          );
        } else {
          authService.logout();
          router.navigate(['/auth/login']);
        }
      }

      return throwError(() => error);
    })
  );
};