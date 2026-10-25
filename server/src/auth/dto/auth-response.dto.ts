import { User } from '../../users/user.entity.js';

export class AuthResponse {
  /** JWT to send as "Authorization: Bearer <token>" */
  accessToken: string;

  user: User;
}
