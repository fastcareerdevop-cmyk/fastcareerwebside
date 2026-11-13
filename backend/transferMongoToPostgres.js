const mongoose = require('mongoose');
const dns = require('dns');
const { Client } = require('pg');

// Custom DNS to bypass ISP blocking of .aws.neon.tech
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

const MONGO_URI = 'mongodb://localhost:27017/fastcareers';
const POSTGRES_URL = 'postgresql://neondb_owner:npg_JwrFOyUq1M7P@ep-curly-term-bez2czm3-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function migrateData() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB!');

  console.log('Connecting to Neon PostgreSQL...');
  const pg = new Client({
    connectionString: POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });
  await pg.connect();
  console.log('Connected to Neon PostgreSQL!');

  const db = mongoose.connection.db;

  // 1. MIGRATE USERS
  console.log('\n--- Migrating Users ---');
  const mongoUsers = await db.collection('users').find().toArray();
  console.log(`Found ${mongoUsers.length} users in MongoDB.`);

  let insertedUsers = 0;
  const validUserIds = new Set();
  const seenEmails = new Set();

  for (const u of mongoUsers) {
    const id = u._id.toString();
    const email = (u.email || '').trim().toLowerCase();
    if (!email || seenEmails.has(email)) {
      continue;
    }
    seenEmails.add(email);

    const query = `
      INSERT INTO "users" (
        "id", "__v", "firstName", "lastName", "email", "password", "role",
        "phone", "phoneNormalized", "headline", "resumeUrl", "linkedinUrl",
        "skills", "experience", "profileCompleted", "personalDetails",
        "caPortfolio", "qualifications", "experienceInfo", "companyName",
        "companyWebsite", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19, $20,
        $21, $22, $23
      ) ON CONFLICT ("id") DO UPDATE SET
        "email" = EXCLUDED."email",
        "updatedAt" = EXCLUDED."updatedAt"
    `;

    const phone = u.phone || (u.personalDetails && u.personalDetails.phone) || null;
    const phoneNorm = phone ? phone.replace(/\D/g, '').slice(-10) : null;

    const values = [
      id,
      u.__v ?? 0,
      u.firstName || 'Candidate',
      u.lastName || '',
      email,
      u.password || '$2b$10$defaultHashPlaceholderForSafety1234567890',
      u.role || 'candidate',
      phone,
      phoneNorm || null,
      u.headline || null,
      u.resumeUrl || null,
      u.linkedinUrl || '',
      Array.isArray(u.skills) ? u.skills : [],
      typeof u.experience === 'number' ? u.experience : null,
      Boolean(u.profileCompleted),
      u.personalDetails ? JSON.stringify(u.personalDetails) : null,
      u.caPortfolio ? JSON.stringify(u.caPortfolio) : null,
      u.qualifications ? JSON.stringify(u.qualifications) : null,
      u.experienceInfo ? JSON.stringify(u.experienceInfo) : null,
      u.companyName || null,
      u.companyWebsite || null,
      u.createdAt ? new Date(u.createdAt) : new Date(),
      u.updatedAt ? new Date(u.updatedAt) : new Date()
    ];

    try {
      await pg.query(query, values);
      validUserIds.add(id);
      insertedUsers++;
    } catch (err) {
      console.warn(`User skip [${email}]: ${err.message}`);
    }
  }
  console.log(`Successfully migrated ${insertedUsers} users to PostgreSQL.`);

  // 2. MIGRATE JOBS
  console.log('\n--- Migrating Jobs ---');
  const mongoJobs = await db.collection('jobs').find().toArray();
  console.log(`Found ${mongoJobs.length} jobs in MongoDB.`);

  let insertedJobs = 0;
  const validJobIds = new Set();

  for (const j of mongoJobs) {
    const id = j._id.toString();
    const postedById = j.postedBy ? j.postedBy.toString() : null;
    const validPoster = postedById && validUserIds.has(postedById) ? postedById : null;

    const query = `
      INSERT INTO "jobs" (
        "id", "__v", "title", "company", "location", "type", "category",
        "salaryRange", "description", "requirements", "responsibilities",
        "isHot", "postedById", "sharedHrEmails", "shareShortlistedCandidates",
        "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11,
        $12, $13, $14, $15,
        $16, $17
      ) ON CONFLICT ("id") DO NOTHING
    `;

    const values = [
      id,
      j.__v ?? 0,
      j.title || 'Untitled Job',
      j.company || 'Fast Careers',
      j.location || 'Remote',
      j.type || 'Full-time',
      j.category || 'Accounting',
      j.salaryRange || 'Competitive',
      j.description || '',
      Array.isArray(j.requirements) ? j.requirements : [],
      Array.isArray(j.responsibilities) ? j.responsibilities : [],
      Boolean(j.isHot),
      validPoster,
      Array.isArray(j.sharedHrEmails) ? j.sharedHrEmails : [],
      j.shareShortlistedCandidates !== false,
      j.createdAt ? new Date(j.createdAt) : new Date(),
      j.updatedAt ? new Date(j.updatedAt) : new Date()
    ];

    try {
      await pg.query(query, values);
      validJobIds.add(id);
      insertedJobs++;
    } catch (err) {
      console.warn(`Job skip [${id}]: ${err.message}`);
    }
  }
  console.log(`Successfully migrated ${insertedJobs} jobs to PostgreSQL.`);

  // 3. MIGRATE APPLICATIONS
  console.log('\n--- Migrating Applications ---');
  const mongoApps = await db.collection('applications').find().toArray();
  console.log(`Found ${mongoApps.length} applications in MongoDB.`);

  let insertedApps = 0;
  for (const a of mongoApps) {
    const id = a._id.toString();
    const jobId = a.job ? a.job.toString() : null;
    const candidateId = a.candidate ? a.candidate.toString() : null;

    if (!jobId || !validJobIds.has(jobId)) {
      continue;
    }
    if (!candidateId || !validUserIds.has(candidateId)) {
      continue;
    }

    const query = `
      INSERT INTO "applications" (
        "id", "__v", "jobId", "candidateId", "resumeUrl", "coverLetter",
        "status", "companyStatus", "sharedWithEmployer",
        "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9,
        $10, $11
      ) ON CONFLICT ("id") DO NOTHING
    `;

    const values = [
      id,
      a.__v ?? 0,
      jobId,
      candidateId,
      a.resumeUrl || '',
      a.coverLetter || '',
      a.status || 'applied',
      a.companyStatus || 'Pending Review',
      Boolean(a.sharedWithEmployer),
      a.createdAt ? new Date(a.createdAt) : new Date(),
      a.updatedAt ? new Date(a.updatedAt) : new Date()
    ];

    try {
      await pg.query(query, values);
      insertedApps++;
    } catch (err) {
      console.warn(`App skip [${id}]: ${err.message}`);
    }
  }
  console.log(`Successfully migrated ${insertedApps} applications to PostgreSQL.`);

  // 4. MIGRATE INDUSTRIAL TRAININGS
  console.log('\n--- Migrating Industrial Trainings ---');
  const mongoIT = await db.collection('industrialtrainings').find().toArray();
  console.log(`Found ${mongoIT.length} industrial training applications in MongoDB.`);
  let insertedIT = 0;
  for (const it of mongoIT) {
    const id = it._id.toString();
    const query = `
      INSERT INTO "industrial_trainings" (
        "id", "__v", "name", "email", "phone", "currentLocation", "currentState",
        "permanentLocation", "permanentState", "dob", "gender", "caInterBatch",
        "bothGroups1stAttempt", "group1", "group2", "group1Batch", "group2Batch",
        "caInterRank", "articleshipFirmName", "articleshipStartMonthYear",
        "big6Articleship", "preferredCities", "preferredSectors", "remarks",
        "resumeUrl", "isVerified", "verificationMethod", "verificationCode",
        "status", "notes", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17,
        $18, $19, $20,
        $21, $22, $23, $24,
        $25, $26, $27, $28,
        $29, $30, $31, $32
      ) ON CONFLICT ("id") DO NOTHING
    `;
    const values = [
      id,
      it.__v ?? 0,
      it.name || 'Candidate',
      (it.email || '').toLowerCase(),
      it.phone || '',
      it.currentLocation || '',
      it.currentState || '',
      it.permanentLocation || '',
      it.permanentState || '',
      it.dob || '',
      it.gender || 'Male',
      it.caInterBatch || 'Nov 2023',
      it.bothGroups1stAttempt || 'No',
      it.group1 || '1st Attempt',
      it.group2 || '1st Attempt',
      it.group1Batch || null,
      it.group2Batch || null,
      it.caInterRank || 'No Rank',
      it.articleshipFirmName || '',
      it.articleshipStartMonthYear || '',
      it.big6Articleship || '',
      Array.isArray(it.preferredCities) ? it.preferredCities : [],
      Array.isArray(it.preferredSectors) ? it.preferredSectors : [],
      it.remarks || '',
      it.resumeUrl || '',
      it.isVerified !== false,
      it.verificationMethod || 'OTP & ICAI Declaration',
      it.verificationCode || null,
      it.status || 'Applied',
      it.notes || null,
      it.createdAt ? new Date(it.createdAt) : new Date(),
      it.updatedAt ? new Date(it.updatedAt) : new Date()
    ];
    try {
      await pg.query(query, values);
      insertedIT++;
    } catch (err) {
      console.warn(`IT skip [${id}]: ${err.message}`);
    }
  }
  console.log(`Successfully migrated ${insertedIT} industrial training applications.`);

  // 5. MIGRATE SHARED JOBS
  console.log('\n--- Migrating Shared Jobs ---');
  const mongoSJ = await db.collection('sharedjobs').find().toArray();
  let insertedSJ = 0;
  for (const sj of mongoSJ) {
    const id = sj._id.toString();
    const query = `
      INSERT INTO "shared_jobs" (
        "id", "__v", "industry", "companyName", "jobDescription", "location",
        "role", "source", "status", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11
      ) ON CONFLICT ("id") DO NOTHING
    `;
    const values = [
      id,
      sj.__v ?? 0,
      sj.industry || 'Finance',
      sj.companyName || 'Unknown',
      sj.jobDescription || null,
      sj.location || null,
      sj.role || 'CA',
      sj.source || 'Website',
      sj.status || 'Pending',
      sj.createdAt ? new Date(sj.createdAt) : new Date(),
      sj.updatedAt ? new Date(sj.updatedAt) : new Date()
    ];
    try {
      await pg.query(query, values);
      insertedSJ++;
    } catch (err) {
      console.warn(`SJ skip [${id}]: ${err.message}`);
    }
  }
  console.log(`Successfully migrated ${insertedSJ} shared jobs.`);

  // SUMMARY CHECK
  console.log('\n======================================');
  console.log('--- POSTGRESQL MIGRATION SUMMARY ---');
  const tables = ['users', 'jobs', 'applications', 'industrial_trainings', 'shared_jobs'];
  for (const t of tables) {
    const countRes = await pg.query(`SELECT COUNT(*) FROM "${t}";`);
    console.log(`Table "${t}": ${countRes.rows[0].count} rows`);
  }
  console.log('======================================');

  await pg.end();
  await mongoose.disconnect();
  console.log('\nMigration script completed successfully!');
}

migrateData().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
