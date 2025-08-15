// apps/api/src/tenant/tenant.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TenantResolver } from './tenant.resolver';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly resolver: TenantResolver) {} // ✅ injeta via DI
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    req.tenantId = this.resolver.fromRequest(req);
    return !!req.tenantId;
  }
}
