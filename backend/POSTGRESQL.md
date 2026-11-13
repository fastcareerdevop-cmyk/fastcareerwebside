# Local PostgreSQL setup

This configures a local PostgreSQL schema only. The application continues using
MongoDB until the data migration, backend conversion, and endpoint verification
are completed separately.

1. Start a local PostgreSQL server and create a database named `fastcareers`.
2. Add a local `DATABASE_URL` to `backend/.env`; do not replace the existing
   MongoDB settings. Use the local PostgreSQL user's credentials and do not
   commit them.
3. From `backend`, run:

   ```sh
   npm install --legacy-peer-deps
   npm run prisma:validate
   npm run prisma:generate
   npm run prisma:migrate:dev -- --name init
   ```

The migration command creates the local tables and writes the generated
migration under `prisma/migrations`. It does not import MongoDB records or
change production environment variables.
