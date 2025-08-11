import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { User, UserRole } from '../../features/user/interfaces/user';
import { LoginResponse } from '../interfaces/login-response';
import { BaseHttpService } from '../../shared/data-access/base-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  private router = inject(Router);

  private tokenKey = 'token';

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.authStatus.asObservable();

  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  loginUser(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/authenticate`, {
        email,
        password
      })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUser.next(response.user);
          this.authStatus.next(true);
        })
      );
  }

  tryRenewToken(): Observable<boolean> {
    const token = this.getToken();
    const email = this.getClaimsFromToken().sub;

    if (!token || !email) return of(false);

    return this.http.post<LoginResponse>(`${this.authUrl}/refresh`, { email, token }).pipe(
      map(res => {
        this.setToken(res.token);
        this.currentUser.next(res.user);
        this.authStatus.next(true);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  checkAuth(): Observable<boolean> {
    const role = this.getClaimsFromToken().role;
    if (!role) {
      this.logout();
      return of(false);
    }

    if (!this.isTokenExpired(this.getToken()!)) {
      if (this.currentUser.value) return of(true);
      return of(true);
    }

    return this.tryRenewToken().pipe(
      map(renewed => {
        if (!renewed) this.logout();
        return renewed;
      })
    );
  }

  logout(): void {
    this.clearToken();
    this.currentUser.next(null);
    this.authStatus.next(false);
    this.router.navigate(['/home']);
  }

  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, user);
  }

  private getTokenExpirationDate(token: string): Date | null {
    if (!token) return null;

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    try {
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);

      if (!payload.exp) return null;

      const date = new Date(0);
      date.setUTCSeconds(payload.exp);
      return date;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) return false;
    return expirationDate < new Date();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  setUser(user: User) {
    this.currentUser.next(user);
  }

  getUser(): User | null {
    return this.currentUser.value;
  }

  getClaimsFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    try {
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(payloadJson);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  redirectIfAuthenticated(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const role = this.getClaimsFromToken().role;
      if (role) {
        if (role === UserRole.FIELD_ADMIN) {
          this.router.navigate(['/dashboard/home-admin']);
        } else {
          this.router.navigate(['/dashboard/field/list']);
        }
      }
    }
  }
}
