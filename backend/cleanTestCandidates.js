const dns = require('dns');
const { Client } = require('pg');
const mongoose = require('mongoose');

// Bypass ISP DNS block using Google/Cloudflare DNS
const originalLookup = dns.lookup;
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.lookup = function (hostname, options, callback) {
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

const POSTGRES_URL = 'postgresql://neondb_owner:npg_JwrFOyUq1M7P@ep-curly-term-bez2czm3-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';
const MONGO_URI = 'mongodb://localhost:27017/fastcareers';

async function cleanTestUsers() {
  console.log('Connecting to Neon PostgreSQL...');
  const pg = new Client({
    connectionString: POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });
  await pg.connect();

  // Find test users in PostgreSQL
  const findQuery = `
    SELECT id, "firstName", "lastName", email, role
    FROM "users"
    WHERE email ILIKE '%example.com%'
       OR email ILIKE '%testcandidate%'
       OR email ILIKE '%test%'
       OR "firstName" ILIKE 'TestCandidate%'
       OR "lastName" ILIKE 'Doe%'
    ORDER BY "createdAt" DESC;
  `;

  const found = await pg.query(findQuery);
  console.log(`Found ${found.rows.length} test candidates in Neon PostgreSQL:`);
  found.rows.forEach(r => console.log(`  - [${r.id}] ${r.firstName} ${r.lastName} (${r.email})`));

  if (found.rows.length > 0) {
    const ids = found.rows.map(r => r.id);
    console.log(`\nDeleting applications associated with these ${ids.length} test candidates...`);
    const delApps = await pg.query(`DELETE FROM "applications" WHERE "candidateId" = ANY($1);`, [ids]);
    console.log(`Deleted ${delApps.rowCount} associated applications.`);

    console.log(`Deleting ${ids.length} test candidates from users table...`);
    const delUsers = await pg.query(`DELETE FROM "users" WHERE id = ANY($1);`, [ids]);
    console.log(`Successfully deleted ${delUsers.rowCount} test candidates from Neon PostgreSQL!`);
  }

  // Count remaining
  const remaining = await pg.query('SELECT COUNT(*) FROM "users";');
  console.log(`Total remaining users in PostgreSQL: ${remaining.rows[0].count}`);

  await pg.end();

  // Also clean from MongoDB if local mongo is running
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    const mongoDel = await mongoose.connection.db.collection('users').deleteMany({
      $or: [
        { email: { $regex: /example\.com/i } },
        { email: { $regex: /test/i } },
        { firstName: { $regex: /^Test/i } },
        { lastName: { $regex: /^Doe/i } }
      ]
    });
    console.log(`Deleted ${mongoDel.deletedCount} test candidates from local MongoDB as well.`);
    await mongoose.disconnect();
  } catch (mErr) {
    // Ignore local mongo errors
  }

  console.log('\nCleaning completed successfully!');
}

cleanTestUsers().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
