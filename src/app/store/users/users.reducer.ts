import { createReducer, on } from '@ngrx/store';
import { UserState } from './users.state';
import * as UsersActions from './users.actions';

export const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialState,

  // Load Users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    isLoading: false,
    error: null,
  })),

  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Load Single User
  on(UsersActions.loadUser, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UsersActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    isLoading: false,
    error: null,
  })),

  on(UsersActions.loadUserFailure, (state, { error }) => ({
    ...state,
    selectedUser: null,
    isLoading: false,
    error,
  })),

  // Create User
  on(UsersActions.createUser, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UsersActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    isLoading: false,
    error: null,
  })),

  on(UsersActions.createUserFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Update User
  on(UsersActions.updateUser, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
    isLoading: false,
    error: null,
  })),

  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Delete User
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UsersActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(u => u.id !== id),
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
    isLoading: false,
    error: null,
  })),

  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Set Selected User
  on(UsersActions.setSelectedUser, (state, { user }) => ({
    ...state,
    selectedUser: user,
  })),

  // Clear Error
  on(UsersActions.clearUsersError, (state) => ({
    ...state,
    error: null,
  }))
);
