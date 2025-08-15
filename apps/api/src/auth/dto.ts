import { IsEmail, MinLength } from 'class-validator';
export class RegisterDto { @IsEmail() email!: string; @MinLength(8) password!: string; }
export class LoginDto { @IsEmail() email!: string; @MinLength(1) password!: string; }
export class TokenResponse { accessToken!: string; refreshToken!: string; }

export class RegisterDto {
  @IsEmail() email!: string;
  @MinLength(8) password!: string;
}

export class LoginDto {
  @IsEmail() email!: string;
  @MinLength(1) password!: string;
}

export class TokenResponse {
  accessToken!: string;
  refreshToken!: string;
}

export class EnableMfaDto { @IsOptional() issuer?: string }
export class VerifyMfaDto { code!: string }
