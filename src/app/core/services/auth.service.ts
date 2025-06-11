import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Player } from '../models/player';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  private url = environment.authUrl;

  authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  loginPlayer(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/authenticate/player`, { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.authStatus.next(true);
      })
    );
  }

  loginAdmin(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/authenticate/admin`, { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.authStatus.next(true);
      })
    );
  }

  register(player: Player): Observable<any> {
    return this.http.post(`${this.url}/player/register`, player);
  }

  logout(): void {
    this.clearToken();
    this.authStatus.next(false);
    this.router.navigate(['/home']);
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
}