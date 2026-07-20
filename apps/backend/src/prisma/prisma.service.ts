import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

/**
 * NestJS-managed Prisma client backed by the PostgreSQL driver adapter.
 *
 * Database connections are intentionally skipped in tests so unit tests do not
 * require a running PostgreSQL instance.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Creates a Prisma client using `DATABASE_URL`.
   *
   * @throws Error when `DATABASE_URL` is missing outside the test environment.
   */
  constructor() {
    const connectionString =
      process.env.DATABASE_URL ??
      (process.env.NODE_ENV === 'test'
        ? 'postgresql://postgres:postgres@localhost:5432/hcms?schema=public'
        : undefined);

    if (!connectionString) {
      throw new Error(
        'Missing DATABASE_URL. Set DATABASE_URL in your environment before starting the app.',
      );
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  /** Opens the database connection when the NestJS module starts. */
  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    await this.$connect();
  }

  /** Closes the database connection during NestJS module shutdown. */
  async onModuleDestroy() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    await this.$disconnect();
  }
}
