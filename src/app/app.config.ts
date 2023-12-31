import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomErrorHandler } from './service/custom-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,withViewTransitions()),
    // provideClientHydration(),
    provideHttpClient(),
    // provideAnimations(),
    importProvidersFrom(BrowserAnimationsModule, HttpClientModule,MatSnackBarModule),
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    }
  ]
};
