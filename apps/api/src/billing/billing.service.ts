import { Injectable } from '@nestjs/common';
import { CheckoutInputDto } from './billing.dto';

@Injectable()
export class BillingService {
  async createCheckout(input: CheckoutInputDto) {
    // chama adapter do provedor e retorna { url, externalId }
    return { url: 'https://checkout.example/xyz', externalId: 'cs_test_123' };
  }
}
