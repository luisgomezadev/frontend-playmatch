import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { User, UserAdmin, UserPlayer } from '../interfaces/user';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  private url = environment.authUrl;

  authStatus$ = this.authStatus.asObservable();

  private currentUser = new BehaviorSubject<UserAdmin | UserPlayer | null>(
    null
  );
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  loginPlayer(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.url}/authenticate/player`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.currentUser.next(response.user);
          this.authStatus.next(true);
        })
      );
  }

  loginAdmin(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.url}/authenticate/admin`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.currentUser.next(response.user);
          this.authStatus.next(true);
        })
      );
  }

  tryRenewToken(role: 'PLAYER' | 'ADMIN'): Observable<boolean> {
    const token = this.getToken();
    const email = this.getClaimsFromToken().sub;

    if (!token || !email) return of(false);

    const endpoint = role === 'ADMIN' ? 'refresh/admin' : 'refresh/player';

    return this.http
      .post<LoginResponse>(`${this.url}/${endpoint}`, { email, token })
      .pipe(
        map((res) => {
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

    return this.tryRenewToken(role).pipe(
      map((renewed) => {
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

  registerPlayer(player: User): Observable<any> {
    return this.http.post(`${this.url}/player/register`, player);
  }

  registerAdmin(admin: User): Observable<any> {
    return this.http.post(`${this.url}/admin/register`, admin);
  }

  private getTokenExpirationDate(token: string): Date | null {
    if (!token) return null;

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    try {
      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      const payload = JSON.parse(payloadJson);

      if (!payload.exp) return null;

      const date = new Date(0);
      date.setUTCSeconds(payload.exp);
      return date;
    } catch (e) {
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

  setUser(user: UserAdmin | UserPlayer) {
    this.currentUser.next(user);
  }

  getUser(): UserAdmin | UserPlayer | null {
    return this.currentUser.value;
  }

  getClaimsFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    try {
      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      return JSON.parse(payloadJson);
    } catch (e) {
      return null;
    }
  }

  redirectIfAuthenticated(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const role = this.getClaimsFromToken().role;
      if (role) {
        this.router.navigate(['/dashboard/home-' + role.toLowerCase()]);
      }
    }
  }
}
