import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../tenant/tenant.guard';
import { Tenant } from '../tenant/tenant.resolver';
import { AuditService } from '@audit'; // <- service vem do package

@UseGuards(TenantGuard)            // aplica o guard na classe toda
@Controller('projects')
export class ProjectsController {
  constructor(private readonly audit: AuditService) {}

  @Post()
  async create(@Tenant() tenantId: string) {
    // ...cria o projeto...
    await this.audit.log({
      action: 'project.created',
      userId: 'u1',
      orgId: tenantId ?? 'org1',
      target: 'project:p1',
      meta: { source: 'api' },
    });
    return { ok: true };
  }

  @Get()
  list(@Tenant() tenantId: string) {
    return [{ id: 'p1', tenantId }];
  }
}
