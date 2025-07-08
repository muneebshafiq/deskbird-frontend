import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TooltipModule } from 'primeng/tooltip';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../../core/models/user.model';
import { EditUserComponent } from '../edit/edit.component';
import { AppState } from '../../../store/app.state';
import * as UsersActions from '../../../store/users/users.actions';
import { selectAllUsers, selectUsersLoading } from '../../../store/users/users.selectors';
import { selectIsAdmin } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule,
    ConfirmPopupModule,
    TooltipModule
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.users$ = this.store.select(selectAllUsers);
    this.loading$ = this.store.select(selectUsersLoading);
    this.isAdmin$ = this.store.select(selectIsAdmin);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  editUser(user: User): void {
    const ref = this.dialogService.open(EditUserComponent, {
      header: 'Edit User',
      width: '50%',
      data: { user }
    });

    ref.onClose.subscribe((updated: boolean) => {
      if (updated) {
        this.loadUsers(); // Refresh the list
      }
    });
  }

  addUser(): void {
    // Double-check admin access using store selector
    this.isAdmin$.pipe(takeUntil(this.destroy$)).subscribe(isAdmin => {
      if (!isAdmin) {
        this.messageService.add({
          severity: 'error',
          summary: 'Access Denied',
          detail: 'Only administrators can add users'
        });
        return;
      }

      const ref = this.dialogService.open(EditUserComponent, {
        header: 'Add User',
        width: '50%',
        data: { user: null } // No user data for new user
      });

      ref.onClose.subscribe((updated: boolean) => {
        if (updated) {
          this.loadUsers(); // Refresh the list
        }
      });
    });
  }

  deleteUser(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(UsersActions.deleteUser({ id }));
      }
    });
  }
}