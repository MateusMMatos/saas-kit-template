import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuditService } from './audit.service';

@Global() // opcional: deixa disponível em toda a app sem precisar importar em cada módulo
@Module({
  providers: [PrismaClient, AuditService],
  exports: [AuditService],
})
export class AuditModule {}
