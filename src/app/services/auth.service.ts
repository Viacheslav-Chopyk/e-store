import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';
import {ERoles, IAuthResponse, ILoginRequest, IRegisterRequest, IUser} from '../models/user';
import { EStorageKeys } from '../models/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  private refreshInFlight: Observable<void> | null = null;

  readonly user = signal<IUser | null>(null);
  readonly isAdmin = computed(() => this.user()?.role === ERoles.Admin);
  readonly isLoggedIn = computed(() => this.user() !== null);

  get token(): string | null {
    return this.read(EStorageKeys.AccessToken);
  }

  get refreshToken(): string | null {
    return this.read(EStorageKeys.RefreshToken);
  }

  login(data: ILoginRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, data).pipe(map(res => this.startSession(res)));
  }

  register(data: IRegisterRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register`, data).pipe(map(res => this.startSession(res)));
  }

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

  refresh(): Observable<void> {
    const refreshToken = this.refreshToken;
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    this.refreshInFlight ??= this.http.post<IAuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      map(res => {
        this.startSession(res);
      }),
      finalize(() => (this.refreshInFlight = null)),
      shareReplay(1)
    );
    return this.refreshInFlight;
  }

  logout() {
    const refreshToken = this.refreshToken;
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({ error: () => {} });
    }
    try {
      localStorage.removeItem(EStorageKeys.AccessToken);
      localStorage.removeItem(EStorageKeys.RefreshToken);
    } catch {}
    this.user.set(null);
  }

  private startSession({ accessToken, refreshToken, user }: IAuthResponse): IUser {
    try {
      localStorage.setItem(EStorageKeys.AccessToken, accessToken);
      localStorage.setItem(EStorageKeys.RefreshToken, refreshToken);
    } catch {}
    this.user.set(user);
    return user;
  }

  private read(key: EStorageKeys): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
}
