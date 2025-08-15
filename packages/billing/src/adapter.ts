export interface CheckoutSession {
  url: string; externalId?: string;
}
export interface BillingAdapter {
  createCheckoutSession(input: { orgId: string; planCode: string; successUrl: string; cancelUrl: string }): Promise<CheckoutSession>;
  getInvoice(externalId: string): Promise<{ status: 'open'|'paid'|'void'; amountCents: number }>;
  // ...
}
