import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ERole } from './role.enum.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  // Never the password itself — only its salted hash (see auth/password.ts).
  // select: false keeps it out of every query unless explicitly requested.
  @ApiHideProperty()
  @Column({ select: false })
  passwordHash: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'enum', enum: ERole, default: ERole.User })
  role: ERole;
}
