import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

// Ensure custom DNS resolution for Neon in local development environments
if (process.env.NODE_ENV !== 'production') {
  const originalLookup = dns.lookup;
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  (dns as any).lookup = function (hostname: string, options: any, callback: any) {
    let cb = callback;
    let opts = options;
    if (typeof options === 'function') {
      cb = options;
      opts = {};
    }
    if (hostname && hostname.includes('neon.tech')) {
      dns.resolve4(hostname, (err, addresses) => {
        if (err || !addresses || addresses.length === 0) {
          return originalLookup(hostname, options, callback);
        }
        if (opts && opts.all) {
          return cb(null, addresses.map(a => ({ address: a, family: 4 })));
        }
        return cb(null, addresses[0], 4);
      });
    } else {
      return originalLookup(hostname, options, callback);
    }
  };
}

let prisma: PrismaClient | null = null;

try {
  const connectionString = process.env.DATABASE_URL || '';
  if (connectionString) {
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
    });
  }
} catch (initErr: any) {
  console.warn('[Prisma Init Warning]:', initErr.message || initErr);
}

export const checkPostgresConnection = async () => {
  if (!prisma) {
    console.log('[PostgreSQL] DATABASE_URL not set or Prisma client not initialized yet.');
    return false;
  }
  try {
    const userCount = await prisma.user.count();
    console.log(`[PostgreSQL Neon] Connected successfully! Verified ${userCount} users.`);
    return true;
  } catch (error: any) {
    console.error('[PostgreSQL Neon] Connection Warning:', error.message || error);
    return false;
  }
};

export default prisma as PrismaClient;
