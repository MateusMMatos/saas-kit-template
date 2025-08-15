// apps/api/src/tenant/tenant.resolver.ts
import { Injectable, ExecutionContext, createParamDecorator } from '@nestjs/common';

@Injectable()
export class TenantResolver {
  fromRequest(req: any): string | null {
    const header = req.headers['x-tenant-id'];
    if (header) return String(header);
    const host = req.headers.host as string | undefined;
    if (host && host.includes('.')) return host.split('.')[0]; // subdomínio
    return null;
  }
}

export const Tenant = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return new TenantResolver().fromRequest(req); // opcional: pode ler de req.tenantId setado pelo guard
});
