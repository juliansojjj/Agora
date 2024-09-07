import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS, withInterceptors } from '@angular/common/http';

import {provideAuth0} from '@auth0/auth0-angular';
import { environment } from '../environments/environment.development';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes,withComponentInputBinding()), 
    provideClientHydration(), 
    provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
    provideAuth0({
      domain:environment.AUTH_DOMAIN,
      clientId:environment.AUTH_CLIENT_ID,
      authorizationParams: {
        redirect_uri: 'http://localhost:4200'
      }
    })
  ]
};
