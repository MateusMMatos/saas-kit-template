import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  it('register returns tokens', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
    const ctrl = moduleRef.get(AuthController);
    const res: any = await ctrl.register({ email: `x${Date.now()}@y.com`, password: 'verysecret1' } as any);
    expect(res.accessToken).toBeDefined();
  });
});
