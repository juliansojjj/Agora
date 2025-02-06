import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {provideAuth, getAuth } from '@angular/fire/auth'

import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
import { TitleStrategyService } from './core/services/title-strategy.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), 
    provideRouter(
      routes,
      withComponentInputBinding(), 
      withInMemoryScrolling({scrollPositionRestoration: 'enabled',anchorScrolling:'enabled'})
    ),
    provideClientHydration(), 
    provideHttpClient(withFetch(), withInterceptors([errorHandlerInterceptor])),
    provideFirebaseApp(() => initializeApp({
      projectId:import.meta.env.NG_APP_PROJECTID,
      appId:import.meta.env.NG_APP_APPID,
      storageBucket:import.meta.env.NG_APP_STORAGE_BUCKET,
      apiKey:import.meta.env.NG_APP_API_KEY,
      messagingSenderId:import.meta.env.NG_APP_MESSAGING_SENDER_ID
    })), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()),
    {
      provide: TitleStrategy,
      useClass: TitleStrategyService
    }, 
  ]
};