import type { BillingAdapter, CheckoutSession } from '../adapter';
export class StripeAdapter implements BillingAdapter {
  constructor(private apiKey: string) {}
  async createCheckoutSession(input: { orgId: string; planCode: string; successUrl: string; cancelUrl: string }): Promise<CheckoutSession> {
    // chamar stripe.checkout.sessions.create(...)
    return { url: 'https://checkout.stripe.com/s/xyz', externalId: 'cs_test_123' };
  }
  async getInvoice(externalId: string) { return { status: 'paid', amountCents: 9900 }; }
}
