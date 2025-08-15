import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { parseEnv } from '@core/env';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaClient) {}
  private env = parseEnv(process.env);

  async register(email: string, password: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new Error('AUTH_EMAIL_TAKEN');
    const hash = await argon2.hash(password);
    const user = await this.prisma.user.create({ data: { email, password: hash }});
    return this.tokens(user.id, 'MEMBER');
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) throw new Error('AUTH_INVALID_CREDENTIALS');
    const ok = await argon2.verify(user.password, password);
    if (!ok) throw new Error('AUTH_INVALID_CREDENTIALS');
    return this.tokens(user.id, 'MEMBER');
  }

  private tokens(sub: string, role: string) {
    const accessToken = jwt.sign({ sub, role }, this.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub, role, typ: 'refresh' }, this.env.JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}
