import { User } from '../../users/user.entity.js';

export class AuthResponse {
  /** Short-lived JWT to send as "Authorization: Bearer <token>" */
  accessToken: string;

  /** Long-lived token for POST /auth/refresh to get a new pair; single use */
  refreshToken: string;

  user: User;
}
