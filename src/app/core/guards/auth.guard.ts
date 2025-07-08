import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AppState } from '../../store/app.state';
import { selectIsLoggedIn } from '../../store/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsLoggedIn).pipe(
      take(1),
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        }
        
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}