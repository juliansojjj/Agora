import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { environment } from '../environments/environment.development';

import {provideAuth, getAuth } from '@angular/fire/auth'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
import { TitleStrategyService } from './core/services/title-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideExperimentalZonelessChangeDetection(), 
    provideRouter(routes,withComponentInputBinding()), 
    provideClientHydration(), 
    provideHttpClient(withInterceptors([errorHandlerInterceptor])),
    // provideHttpClient(withFetch(), withInterceptors([errorHandlerInterceptor])),
    provideFirebaseApp(()=>initializeApp(environment.firebase)),
    provideAuth(()=>getAuth()),
    provideFirestore(()=>getFirestore()),
    {
      provide: TitleStrategy,
      useClass: TitleStrategyService
    }
  ]
};

/*
disable zoneless change detection

RuntimeError: NG0953: Unexpected emit for destroyed `OutputRef`. The owning directive/component is destroyed.
    at OutputEmitterRef.emit (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), <anonymous>:6829:13)
    at getter.set (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), 
<anonymous>:13554:18)
    at Object.eval [as next] (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), <anonymous>:731:19)
    at ConsumerObserver2.next (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), <anonymous>:569:29)
    at Subscriber2._next (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), <anonymous>:538:26)
    at Subscriber2.next (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), <anonymous>:511:16)
    at eval (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), <anonymous>:3230:24)
    at _ZoneDelegate.invoke (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), <anonymous>:312:158)
    at _ZoneImpl.run (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), <anonymous>:106:35)
    at eval (eval at instantiateModule (file:///E:/Proyectos/PROGRAMACION/agora-app%20ssr/node_modules/vite/dist/node/chunks/dep-NjL7WTE1.js:52835:24), <anonymous>:1011:30) {
  code: 953
}
*/