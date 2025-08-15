import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { TenantModule } from '../tenant/tenant.module';
import { AuditModule } from '../audit/audit.module'; // <- wrapper local da API

@Module({
  imports: [TenantModule, AuditModule],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
