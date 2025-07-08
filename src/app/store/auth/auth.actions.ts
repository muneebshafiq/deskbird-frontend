import { createAction, props } from '@ngrx/store';
import { LoginRequest, AuthResponse, JwtPayload } from '../../core/models/auth.model';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: AuthResponse; user: JwtPayload }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Initialize Auth State
export const initializeAuth = createAction('[Auth] Initialize Auth');

export const setUser = createAction(
  '[Auth] Set User',
  props<{ user: JwtPayload | null }>()
);

// Clear Error
export const clearAuthError = createAction('[Auth] Clear Error');
