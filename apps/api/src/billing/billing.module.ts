// apps/api/src/billing/billing.module.ts
import { Module } from '@nestjs/common';
import { BillingWebhookController } from './webhook.controller';
import { BillingWebhookService } from './webhook.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [BillingWebhookController],
  providers: [BillingWebhookService, PrismaClient],
})
export class BillingModule {}
