import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// The session is restored in provideAppInitializer before the first navigation, so user() is already known here.

// Pages for logged-in users only: everyone else goes to /login.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn() || inject(Router).createUrlTree(['/login']);
};

// The login page: a logged-in user has nothing to do there, so send them to the shop.
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return !authService.isLoggedIn() || inject(Router).createUrlTree(['/']);
};
