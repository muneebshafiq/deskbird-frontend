import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { EditUserComponent } from '../edit/edit.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';

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
export class UsersListComponent {
  users: User[] = []; 
  loading = true;
  isAdmin$!: Observable<boolean>;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.isAdmin$ = this.authService.isAdmin$;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        this.loading = false;
      }
    });
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
    // Double-check admin access
    this.authService.isAdmin$.subscribe(isAdmin => {
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
        this.usersService.deleteUser(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully'
            });
            this.loadUsers(); // Refresh the list
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete user'
            });
          }
        });
      }
    });
  }
}