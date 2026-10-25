import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedRequest } from './auth.guard.js';
import { Roles } from './roles.decorator.js';

// Must run after AuthGuard: @UseGuards(AuthGuard, RolesGuard) — it relies on request.user set there.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    // No @Roles(...) on this route — nothing to check.
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException();
    }
    return true;
  }
}
