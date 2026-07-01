import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app.routes';

/**
 * ApplicationConfig for the standalone bootstrap.
 *
 * - `provideZoneChangeDetection({ eventCoalescing: true })` — reduces change-detection churn.
 * - `provideRouter(...)` — enables lazy loading via `loadComponent` and binds route params as inputs.
 * - `provideIonicAngular({})` — registers Ionic's DI providers (overlay, modal, etc.).
 * - `provideHttpClient(...)` — exposes HttpClient for app services.
 *
 * Add `withFetch()` here once you wire up HTTP interceptors in your app.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideIonicAngular({}),
    provideHttpClient(withInterceptorsFromDi())
  ]
};