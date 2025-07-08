import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private jwtHelper = inject(JwtHelperService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authService.loginWithoutNavigation(credentials).pipe(
          map((response) => {
            const user = this.jwtHelper.decodeToken(response.access_token);
            return AuthActions.loginSuccess({ response, user });
          }),
          catchError(error => of(AuthActions.loginFailure({ 
            error: error.error?.message || 'Login failed' 
          })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ response }) => {
        localStorage.setItem('access_token', response.access_token);
        this.router.navigate(['/users']);
      })
    ), 
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      map(() => {
        const token = localStorage.getItem('access_token');
        if (token && token.trim() !== '') {
          try {
            if (!this.jwtHelper.isTokenExpired(token)) {
              const user = this.jwtHelper.decodeToken(token);
              return AuthActions.setUser({ user });
            } else {
              localStorage.removeItem('access_token');
              return AuthActions.setUser({ user: null });
            }
          } catch (error) {
            localStorage.removeItem('access_token');
            return AuthActions.setUser({ user: null });
          }
        }
        return AuthActions.setUser({ user: null });
      })
    )
  );
}
