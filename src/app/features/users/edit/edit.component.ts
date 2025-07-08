import { Component, inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { UsersService } from '../../../core/services/users.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UserRole } from '../../../core/models/auth.model';

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
export class EditUserComponent {
  private usersService = inject(UsersService);
  public dialogRef = inject(DynamicDialogRef, { optional: true }); // Made optional
  private config = inject(DynamicDialogConfig, { optional: true }); // Made optional
  private messageService = inject(MessageService);
  private router = inject(Router);

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
  
  loading = false;

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
    this.loading = true;

    let operation;
    
    if (this.isNew) {
      const createRequest: CreateUserRequest = {
        email: this.user.email,
        name: this.user.role === UserRole.ADMIN ? 'Admin' : this.user.name,
        password: this.password,
        role: this.user.role
      };
      operation = this.usersService.createUser(createRequest);
    } else {
      const updateRequest: UpdateUserRequest = {
        email: this.user.email,
        name: this.user.role === UserRole.ADMIN ? 'Admin' : this.user.name,
        role: this.user.role
      };
      operation = this.usersService.updateUser((this.user as User).id, updateRequest);
    }

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${this.isNew ? 'created' : 'updated'} successfully`
        });
        
        if (this.dialogRef) {
          // Component is being used in a dialog
          this.dialogRef.close(true);
        } else {
          // Component is being used as a standalone page
          this.router.navigate(['/users']);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.isNew ? 'create' : 'update'} user`
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}