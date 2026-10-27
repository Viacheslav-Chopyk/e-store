import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  /** Refresh token received from login, register or a previous refresh */
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
