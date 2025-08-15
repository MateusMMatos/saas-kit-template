import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';

describe('AuthService', () => {
  const prisma = new PrismaClient();
  const service = new AuthService(prisma);

  it('register returns tokens', async () => {
    const email = `a${Date.now()}@b.com`;
    const t = await service.register(email, 'verysecret1');
    expect(t.accessToken).toBeTruthy();
  });
});
