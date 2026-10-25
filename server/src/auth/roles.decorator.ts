import { Reflector } from '@nestjs/core';
import { ERole } from '../users/role.enum.js';

export const Roles = Reflector.createDecorator<ERole[]>();
