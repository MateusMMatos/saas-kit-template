import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, TokenResponse } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)

  register(@Body() dto: RegisterDto): Promise<TokenResponse> {
    return this.service.register(dto.email, dto.password);
  }
  
  @Post('login')
  @HttpCode(HttpStatus.OK)

  login(@Body() dto: LoginDto): Promise<TokenResponse> {
    return this.service.login(dto.email, dto.password);
  }
}
