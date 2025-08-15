import { Test } from '@nestjs/testing';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

describe('BillingController', () => {
  it('creates checkout session', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [BillingService],
    }).compile();
    const controller = moduleRef.get(BillingController);
    const res = await controller.create({ orgId: 'o1', planCode: 'pro', successUrl: 's', cancelUrl: 'c' });
    expect(res.url).toContain('http');
  });
});
