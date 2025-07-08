import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ChipModule } from 'primeng/chip';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

// NgRx imports
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './store/auth/auth.reducer';
import { usersReducer } from './store/users/users.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { UsersEffects } from './store/users/users.effects';
import { environment } from '../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    
    // NgRx Store Configuration
    provideStore({
      auth: authReducer,
      users: usersReducer
    }),
    provideEffects([AuthEffects, UsersEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
      trace: false,
      traceLimit: 75
    }),
    
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'false',
          cssLayer: false
        }
      },
      ripple: true,
      inputStyle: 'outlined'
    }),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    DialogService,
    MessageService,
    ConfirmationService,
    JwtHelperService,
    {
      provide: JWT_OPTIONS,
      useValue: {
        tokenGetter: () => localStorage.getItem('access_token'),
        allowedDomains: ['localhost:3000'], // Your API domain
        disallowedRoutes: []
      }
    },
    importProvidersFrom(
      ConfirmDialogModule,
      ToastModule,
      TableModule,
      TagModule,
      MessagesModule,
      ButtonModule,
      InputTextModule,
      DropdownModule,
      CardModule,
      ToolbarModule,
      ChipModule
    )
  ]
};
