import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse, JwtPayload, UserRole } from '../models/auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<JwtPayload | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
  isAdmin$ = this.currentUser$.pipe(map(user => user?.role === UserRole.ADMIN));

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.access_token && response.access_token.trim() !== '') {
          this.storeToken(response.access_token);
          this.router.navigate(['/users']);
        } else {
          throw new Error('Invalid response: no valid token received');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private initializeAuthState() {
    const token = localStorage.getItem('access_token');
    if (token && token.trim() !== '') {
      try {
        if (!this.jwtHelper.isTokenExpired(token)) {
          const decodedToken = this.jwtHelper.decodeToken(token);
          this.currentUserSubject.next(decodedToken);
        } else {
          // Token is expired, clear it
          this.clearInvalidToken();
        }
      } catch (error) {
        // Token is malformed or invalid, clear it
        console.warn('Invalid token detected, clearing token:', error);
        this.clearInvalidToken();
      }
    } else {
      // No valid token, ensure user is logged out
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUserRole(): UserRole | null {
    const token = localStorage.getItem('access_token');
    if (!token || token.trim() === '') return null;
    
    try {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.clearInvalidToken();
        return null;
      }
      return this.jwtHelper.decodeToken(token).role;
    } catch (error) {
      console.warn('Error decoding token for role:', error);
      this.clearInvalidToken();
      return null;
    }
  }

  hasRole(role: UserRole): boolean {
    const currentRole = this.getCurrentUserRole();
    return currentRole === role;
  }

  private storeToken(token: string) {
    if (!token || token.trim() === '') {
      console.error('Attempted to store empty or invalid token');
      return;
    }
    
    try {
      // Validate token before storing
      const decodedToken = this.jwtHelper.decodeToken(token);
      localStorage.setItem('access_token', token);
      this.currentUserSubject.next(decodedToken);
    } catch (error) {
      console.error('Failed to store invalid token:', error);
      this.clearInvalidToken();
    }
  }

  private clearInvalidToken() {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
  }
}