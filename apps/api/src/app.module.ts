import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { BillingModule } from './billing/billing.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [AuthModule, ProjectsModule, BillingModule, AuditModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}

