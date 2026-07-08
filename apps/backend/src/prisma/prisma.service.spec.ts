import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }

    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it('throws a clear error when DATABASE_URL is missing outside test mode', () => {
    delete process.env.DATABASE_URL;
    process.env.NODE_ENV = 'development';

    expect(() => new PrismaService()).toThrow(
      'Missing DATABASE_URL. Set DATABASE_URL in your environment before starting the app.',
    );
  });
});
