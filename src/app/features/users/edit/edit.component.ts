import { Component, inject, Optional, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../../core/models/user.model';
import { MessageService } from 'primeng/api';
import { UserRole } from '../../../core/models/auth.model';
import { AppState } from '../../../store/app.state';
import * as UsersActions from '../../../store/users/users.actions';
import { selectUsersLoading } from '../../../store/users/users.selectors';

interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

interface UpdateUserRequest {
  email: string;
  name: string;
  role: UserRole;
}

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditUserComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  public dialogRef = inject(DynamicDialogRef, { optional: true }); // Made optional
  private config = inject(DynamicDialogConfig, { optional: true }); // Made optional
  private messageService = inject(MessageService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  user: User | CreateUserRequest = this.config?.data?.user || {
    email: '',
    name: '',
    password: '',
    role: UserRole.REGULAR
  };
  
  // For password field in create mode
  password: string = '';
  
  isNew = !this.config?.data?.user;
  
  roleOptions = [
    { label: 'Regular User', value: UserRole.REGULAR },
    { label: 'Administrator', value: UserRole.ADMIN }
  ];
  
  loading$: Observable<boolean> = new Observable();

  ngOnInit(): void {
    this.loading$ = this.store.select(selectUsersLoading);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFormValid(): boolean {
    if (this.isNew) {
      return !!(this.user.email && this.getEffectiveName() && this.password && this.user.role);
    } else {
      return !!(this.user.email && this.getEffectiveName() && this.user.role);
    }
  }

  getEffectiveName(): string {
    return this.user.role === UserRole.ADMIN ? 'Admin' : this.user.name;
  }

  onRoleChange(): void {
    // When role changes to admin, we don't need to clear the name field
    // as it will be automatically set to "Admin" during save
  }

  cancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      this.router.navigate(['/users']);
    }
  }

  save(): void {
    if (this.isNew) {
      const createRequest: CreateUserRequest = {
        email: this.user.email,
        name: this.user.role === UserRole.ADMIN ? 'Admin' : this.user.name,
        password: this.password,
        role: this.user.role
      };
      this.store.dispatch(UsersActions.createUser({ user: createRequest }));
    } else {
      const updateRequest: UpdateUserRequest = {
        email: this.user.email,
        name: this.user.role === UserRole.ADMIN ? 'Admin' : this.user.name,
        role: this.user.role
      };
      this.store.dispatch(UsersActions.updateUser({ 
        id: (this.user as User).id, 
        user: updateRequest 
      }));
    }

    // Listen for successful operations to close dialog
    // Note: This is a simplified approach. In a production app, you might want
    // to use a more sophisticated state management for dialogs
    this.store.select(selectUsersLoading).pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      if (!loading) {
        // Small delay to ensure the success notification shows before closing
        setTimeout(() => {
          if (this.dialogRef) {
            this.dialogRef.close(true);
          } else {
            this.router.navigate(['/users']);
          }
        }, 500);
      }
    });
  }
}