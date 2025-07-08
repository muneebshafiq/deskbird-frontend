import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/auth.model';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'users', 
    loadComponent: () => import('./features/users/list/list.component').then(m => m.UsersListComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.REGULAR] } // Both can access list
  },
  { 
    path: 'users/new',
    loadComponent: () => import('./features/users/edit/edit.component').then(m => m.EditUserComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] } // Only admin can create
  },
  { 
    path: 'users/:id/edit',
    loadComponent: () => import('./features/users/edit/edit.component').then(m => m.EditUserComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] } // Only admin can edit
  },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { 
    path: '**', 
    loadComponent: () => import('./layout/not-found/not-found.component').then(m => m.NotFoundComponent) 
  }
];