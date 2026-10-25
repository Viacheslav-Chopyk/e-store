import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthResponse } from './dto/auth-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { hashPassword, verifyPassword } from './password.js';

// What we put inside the token. `sub` (subject) is the standard JWT field for "who this token belongs to".
export interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, name, password }: RegisterDto): Promise<AuthResponse> {
    if (await this.usersService.existsByEmail(email)) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.usersService.create({ email, name, passwordHash: await hashPassword(password) });
    return this.buildResponse(user);
  }

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmailWithPassword(email);
    // Same message for "no such user" and "wrong password" so attackers can't probe which emails exist.
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const { passwordHash: _, ...safeUser } = user;
    return this.buildResponse(safeUser as User);
  }

  private async buildResponse(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return { accessToken: await this.jwtService.signAsync(payload), user };
  }
}
