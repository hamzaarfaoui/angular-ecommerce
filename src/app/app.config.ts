import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // L'ordre d'enregistrement compte : JWT d'abord, puis gestionnaire d'erreurs
    provideHttpClient(
      withInterceptors([jwtInterceptor, errorInterceptor])
    )
  ]
};