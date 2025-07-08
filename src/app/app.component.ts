import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from './layout/header/header.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppState } from './store/app.state';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'deskbird';

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // Initialize auth state when app starts
    this.store.dispatch(AuthActions.initializeAuth());
  }
}