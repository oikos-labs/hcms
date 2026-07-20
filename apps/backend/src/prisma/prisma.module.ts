import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/** Makes a single Prisma service available throughout the NestJS application. */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
