// apps/api/src/billing/webhook.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

type RawRequest = { rawBody: Buffer };

@Injectable()
export class BillingWebhookService {
  private stripe = new Stripe(process.env.STRIPE_KEY || '', { apiVersion: '2024-06-20' });

  constructor(private prisma: PrismaClient) {}

  verifyAndParseStripe(req: RawRequest, signature: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new BadRequestException('Missing STRIPE_WEBHOOK_SECRET');
    try {
      return this.stripe.webhooks.constructEvent(req.rawBody, signature, secret);
    } catch (err: any) {
      throw new BadRequestException(`Invalid signature: ${err.message}`);
    }
  }

  async ensureOnce(eventId: string, type?: string, payload?: unknown) {
    const existing = await this.prisma.webhookEvent.findUnique({ where: { eventId } });
    if (existing?.processedAt) return false; // já processado
    if (!existing) {
      await this.prisma.webhookEvent.create({
        data: { provider: 'stripe', eventId, type, payload: payload as any },
      });
    }
    return true;
  }

  async markProcessed(eventId: string) {
    await this.prisma.webhookEvent.update({
      where: { eventId },
      data: { processedAt: new Date() },
    });
  }

  async handleStripeEvent(event: Stripe.Event) {
    // Despacho por tipo
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: ativar assinatura, atualizar plano, etc.
        break;
      case 'invoice.payment_failed':
        // TODO: dunning / notificações
        break;
      // adicione outros tipos relevantes…
      default:
        // noop
        break;
    }
  }
}
