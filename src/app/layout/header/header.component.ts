import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ChipModule } from 'primeng/chip';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../store/app.state';
import { JwtPayload } from '../../core/models/auth.model';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectCurrentUser, selectIsLoggedIn, selectIsAdmin } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, ToolbarModule, ChipModule, RouterLink, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<JwtPayload | null>;

  constructor(private store: Store<AppState>) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}