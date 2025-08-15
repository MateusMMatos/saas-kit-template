// apps/api/src/billing/webhook.controller.ts
import { Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import { BillingWebhookService } from './webhook.service';
import type { Request } from 'express';

type RawRequest = Request & { rawBody: Buffer };

@Controller('billing/webhooks/stripe')
export class BillingWebhookController {
  constructor(private readonly svc: BillingWebhookService) {}

  @Post()
  @HttpCode(200) // Stripe espera 2xx
  async handle(@Req() req: RawRequest, @Headers('stripe-signature') sig: string) {
    // 1) valida e obtém o evento
    const event = this.svc.verifyAndParseStripe(req, sig);

    // 2) idempotência
    const firstTime = await this.svc.ensureOnce(event.id, event.type, event.data);
    if (!firstTime) return { ok: true, duplicate: true };

    // 3) processa (de preferência de forma assíncrona/leve)
    await this.svc.handleStripeEvent(event);

    // 4) marca processado
    await this.svc.markProcessed(event.id);

    return { ok: true, id: event.id, type: event.type };
  }
}
