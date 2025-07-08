import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { UsersService } from '../../core/services/users.service';
import { MessageService } from 'primeng/api';
import * as UsersActions from './users.actions';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private usersService = inject(UsersService);
  private messageService = inject(MessageService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      exhaustMap(() =>
        this.usersService.getUsers().pipe(
          map(users => UsersActions.loadUsersSuccess({ users })),
          catchError(error => of(UsersActions.loadUsersFailure({ 
            error: error.error?.message || 'Failed to load users' 
          })))
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUser),
      exhaustMap(({ id }) =>
        this.usersService.getUser(id).pipe(
          map(user => UsersActions.loadUserSuccess({ user })),
          catchError(error => of(UsersActions.loadUserFailure({ 
            error: error.error?.message || 'Failed to load user' 
          })))
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      exhaustMap(({ user }) =>
        this.usersService.createUser(user).pipe(
          map(createdUser => UsersActions.createUserSuccess({ user: createdUser })),
          catchError(error => of(UsersActions.createUserFailure({ 
            error: error.error?.message || 'Failed to create user' 
          })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      exhaustMap(({ id, user }) =>
        this.usersService.updateUser(id, user).pipe(
          map(updatedUser => UsersActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => of(UsersActions.updateUserFailure({ 
            error: error.error?.message || 'Failed to update user' 
          })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      exhaustMap(({ id }) =>
        this.usersService.deleteUser(id).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError(error => of(UsersActions.deleteUserFailure({ 
            error: error.error?.message || 'Failed to delete user' 
          })))
        )
      )
    )
  );

  // Success notifications
  createUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUserSuccess),
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully'
        });
      })
    ),
    { dispatch: false }
  );

  updateUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserSuccess),
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully'
        });
      })
    ),
    { dispatch: false }
  );

  deleteUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUserSuccess),
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully'
        });
      })
    ),
    { dispatch: false }
  );

  // Error notifications
  usersError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UsersActions.loadUsersFailure,
        UsersActions.loadUserFailure,
        UsersActions.createUserFailure,
        UsersActions.updateUserFailure,
        UsersActions.deleteUserFailure
      ),
      tap(({ error }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      })
    ),
    { dispatch: false }
  );
}
