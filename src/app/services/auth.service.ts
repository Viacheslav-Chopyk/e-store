import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import {ERoles, IAuthResponse, ILoginRequest, IRegisterRequest, IUser} from '../models/user';

const TOKEN_KEY = 'accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  readonly user = signal<IUser | null>(null);
  readonly isAdmin = computed(() => this.user()?.role === ERoles.Admin);
  readonly isLoggedIn = computed(() => this.user() !== null);

  get token(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  login(data: ILoginRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, data).pipe(map(res => this.startSession(res)));
  }

  register(data: IRegisterRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register`, data).pipe(map(res => this.startSession(res)));
  }

  // Called on app start: if a token was saved earlier, ask the server who it belongs to.
  restoreSession(): Observable<unknown> {
    if (!this.token) {
      return of(null);
    }
    return this.http.get<IUser>(`${this.apiUrl}/me`).pipe(
      tap(user => this.user.set(user)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  logout() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    this.user.set(null);
  }

  private startSession({ accessToken, user }: IAuthResponse): IUser {
    try {
      localStorage.setItem(TOKEN_KEY, accessToken);
    } catch {}
    this.user.set(user);
    return user;
  }
}
