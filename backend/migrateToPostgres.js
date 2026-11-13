const fs = require('fs');
const { execSync } = require('child_process');
const dns = require('dns');

// Configure custom DNS resolution to bypass ISP DNS block of .aws.neon.tech
const originalLookup = dns.lookup;
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.lookup = function(hostname, options, callback) {
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

const { Client } = require('pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_JwrFOyUq1M7P@ep-curly-term-bez2czm3-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function createTables() {
  console.log('Generating PostgreSQL schema DDL via Prisma...');
  const sql = execSync('npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script', {
    cwd: __dirname,
    encoding: 'utf8'
  });

  console.log(`Generated DDL SQL (${sql.length} bytes). Connecting to Neon...`);

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to Neon PostgreSQL!');

  console.log('Executing DDL to create tables and relations...');
  await client.query(sql);
  console.log('All tables created successfully!');

  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
  console.log('Created tables in Neon:');
  res.rows.forEach(r => console.log('  [x] ' + r.table_name));

  await client.end();
}

createTables().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
