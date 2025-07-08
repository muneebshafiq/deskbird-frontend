import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoggedIn: true,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialState,
  })),

  // Set User (for initialization)
  on(AuthActions.setUser, (state, { user }) => ({
    ...state,
    user,
    isLoggedIn: !!user,
    isLoading: false,
  })),

  // Clear Error
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null,
  }))
);
