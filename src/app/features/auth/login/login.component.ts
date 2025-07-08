import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '../../../store/app.state';
import { LoginRequest } from '../../../core/models/auth.model';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectIsLoading, selectAuthError } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    MessageModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  credentials: LoginRequest = { email: '', password: '' };
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {
    this.loading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  ngOnInit(): void {
    // Initialize auth state on component load
    this.store.dispatch(AuthActions.initializeAuth());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInputChange() {
    // Clear error message when user starts typing
    this.store.dispatch(AuthActions.clearAuthError());
  }

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      // For validation errors, you might want to create a specific action
      // For now, we'll let the backend handle validation
      return;
    }

    this.store.dispatch(AuthActions.login({ credentials: this.credentials }));
  }
}