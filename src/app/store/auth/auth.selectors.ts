import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';
import { UserRole } from '../../core/models/auth.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggedIn
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUserRole = createSelector(
  selectCurrentUser,
  (user) => user?.role || null
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === UserRole.ADMIN
);

export const selectIsRegularUser = createSelector(
  selectUserRole,
  (role) => role === UserRole.REGULAR
);
