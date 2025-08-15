import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TenantResolver } from './tenant.resolver';
import { TenantGuard } from './tenant.guard';

@Module({
  providers: [
    TenantResolver,
    { provide: APP_GUARD, useClass: TenantGuard }, 
  ],
  exports: [TenantResolver],
})
export class TenantModule {}
