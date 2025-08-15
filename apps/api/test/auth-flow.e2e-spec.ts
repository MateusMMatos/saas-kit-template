import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomUUID } from 'crypto';

describe('Auth Flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('register → login', async () => {
    const email = `e2e-${randomUUID()}@example.com`;

    // register
    const r1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'verysecret1' });

    // ajuste: 201 se o controller usa @HttpCode(HttpStatus.CREATED), senão 200
    expect([200, 201]).toContain(r1.status);
    expect(r1.body.accessToken).toBeDefined();
    expect(r1.body.refreshToken).toBeDefined();

    // login
    const r2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'verysecret1' });

    expect(r2.status).toBe(200);
    expect(r2.body.accessToken).toBeDefined();
    expect(r2.body.refreshToken).toBeDefined();
  });
});
