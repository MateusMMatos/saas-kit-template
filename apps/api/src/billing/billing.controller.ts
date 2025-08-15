import { Body, Controller, Post } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CheckoutInputDto } from './billing.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly svc: BillingService) {}

  @Post('checkout/session')
  create(@Body() dto: CheckoutInputDto) {
    return this.svc.createCheckout(dto);
  }
}
