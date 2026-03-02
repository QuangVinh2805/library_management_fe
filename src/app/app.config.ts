import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';
import {authInterceptor} from './_services/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 2500,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    }),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ]
};
