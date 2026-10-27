import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService, type JwtPayload } from './auth.service.js';
import { CurrentUser } from './current-user.decorator.js';
import { AuthResponse } from './dto/auth-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /** Create an account and get a token right away */
  @Post('register')
  @UseGuards(ThrottlerGuard)
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiTooManyRequestsResponse({ description: 'Too many attempts' })
  @ApiConflictResponse({ description: 'Email is already taken' })
  register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  /** Exchange email + password for a token */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiTooManyRequestsResponse({ description: 'Too many attempts' })
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  /** The user the token belongs to */
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token' })
  async me(@CurrentUser() payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    // Token is valid but the user was deleted since it was issued.
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
