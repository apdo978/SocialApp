import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {  provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './Interceptors/TokenInter/token-interceptor';


// import { requestesInterInterceptor } from './Interceptors/requestes-inter-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors( [tokenInterceptor] )) ,
  ]
};
