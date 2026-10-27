import { createHash, randomBytes } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthResponse } from './dto/auth-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { hashPassword, verifyPassword } from './password.js';
import { ERole } from '../users/role.enum.js';
import { RefreshToken } from './refresh-token.entity.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface JwtPayload {
  sub: number;
  email: string;
  role: ERole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
  ) {}

  async register({
    email,
    name,
    password,
  }: RegisterDto): Promise<AuthResponse> {
    if (await this.usersService.existsByEmail(email)) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.usersService.create({
      email,
      name,
      passwordHash: await hashPassword(password),
    });
    return this.buildResponse(user);
  }

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const { passwordHash: _, ...safeUser } = user;
    return this.buildResponse(safeUser as User);
  }

  private async buildResponse(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.issueRefreshToken(user.id),
      user,
    };
  }

  async refresh(token: string): Promise<AuthResponse> {
    const record = await this.refreshTokens.findOne({
      where: { tokenHash: this.hashToken(token) },
      relations: { user: true },
    });
    if (!record) {
      throw new UnauthorizedException();
    }
    await this.refreshTokens.delete({ id: record.id });
    if (record.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException();
    }
    return this.buildResponse(record.user);
  }

  async logout(token: string): Promise<void> {
    await this.refreshTokens.delete({ tokenHash: this.hashToken(token) });
  }

  private async issueRefreshToken(userId: number): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const days = Number(this.config.get('REFRESH_TOKEN_TTL_DAYS', 7));
    await this.refreshTokens.save({
      tokenHash: this.hashToken(token),
      userId,
      expiresAt: new Date(Date.now() + days * DAY_MS),
    });
    return token;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
