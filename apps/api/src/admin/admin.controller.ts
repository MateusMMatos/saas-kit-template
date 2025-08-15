import { Controller, Get, Query } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}
  @Get('users') listUsers(@Query('q') q?: string) {
    return this.prisma.user.findMany({ where: q ? { email: { contains: q } } : {} });
  }
}
