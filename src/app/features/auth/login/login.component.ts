import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';
import { MessageModule } from 'primeng/message';

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
export class LoginComponent {
  credentials: LoginRequest = { email: '', password: '' };
  loading = false;
  error = '';

  constructor(private authService: AuthService) {}

  onInputChange() {
    // Clear error message when user starts typing
    if (this.error) {
      this.error = '';
    }
  }

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Login successful - AuthService handles navigation
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading = false;
        
        // Set user-friendly error message
        if (err.status === 401 || err.status === 400) {
          this.error = 'Invalid email or password';
        } else if (err.status === 0) {
          this.error = 'Unable to connect to server. Please try again.';
        } else {
          this.error = 'Login failed. Please try again.';
        }
        
        // Ensure no invalid token is stored
        localStorage.removeItem('access_token');
      }
    });
  }
}