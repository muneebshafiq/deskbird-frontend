import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserRole } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Get the expected roles from route data
    const expectedRoles = route.data['roles'] as UserRole[];
    
    // Get the current user's role
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.jwtHelper.decodeToken(token).role as UserRole;

    // Check if user has any of the expected roles
    if (expectedRoles && !expectedRoles.includes(userRole)) {
      this.router.navigate(['/users']);
      return false;
    }

    return true;
  }
}