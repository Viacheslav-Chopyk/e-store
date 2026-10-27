import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ERoutes } from '../models/routes';

const API_URL = 'http://localhost:3000/api';
const NO_REFRESH_URLS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].map(path => API_URL + path);

const withToken = (req: HttpRequest<unknown>, token: string) =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.token;

  if (!token || !req.url.startsWith(API_URL) || NO_REFRESH_URLS.includes(req.url)) {
    return next(req);
  }

  return next(withToken(req, token)).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }
      const current = authService.token;
      if (current && current !== token) {
        return next(withToken(req, current));
      }
      if (!authService.refreshToken) {
        authService.logout();
        router.navigate(['/', ERoutes.Login]);
        return throwError(() => error);
      }
      return authService.refresh().pipe(
        catchError(refreshError => {
          authService.logout();
          router.navigate(['/', ERoutes.Login]);
          return throwError(() => refreshError);
        }),
        switchMap(() => next(withToken(req, authService.token!)))
      );
    })
  );
};
