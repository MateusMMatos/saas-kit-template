import { PrismaClient } from '@prisma/client';

export class AuditService {
  constructor(private readonly prisma: PrismaClient) {}

  async log(input: { action: string; userId?: string; orgId?: string; target?: string; meta?: any }) {
    await this.prisma.auditLog.create({
      data: {
        action: input.action,
        userId: input.userId,
        organizationId: input.orgId,
        target: input.target,
        metadata: input.meta
      }
    });
  }
}
