import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './users.state';

export const selectUsersState = createFeatureSelector<UserState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state: UserState) => state?.users || []
);

export const selectSelectedUser = createSelector(
  selectUsersState,
  (state: UserState) => state.selectedUser
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state: UserState) => state.isLoading
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state: UserState) => state.error
);

export const selectUserById = (id: string) =>
  createSelector(selectAllUsers, (users) =>
    users?.find(user => user.id === id)
  );

export const selectUsersCount = createSelector(
  selectAllUsers,
  (users) => users?.length || 0
);
