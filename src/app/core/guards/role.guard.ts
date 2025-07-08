import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserRole } from '../models/auth.model';
import { AppState } from '../../store/app.state';
import { selectUserRole } from '../../store/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Get the expected roles from route data
    const expectedRoles = route.data['roles'] as UserRole[];
    
    return this.store.select(selectUserRole).pipe(
      take(1),
      map(userRole => {
        if (!userRole) {
          this.router.navigate(['/login']);
          return false;
        }

        // Check if user has any of the expected roles
        if (expectedRoles && !expectedRoles.includes(userRole)) {
          this.router.navigate(['/users']);
          return false;
        }

        return true;
      })
    );
  }
}