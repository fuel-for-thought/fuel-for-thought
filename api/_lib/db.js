import pg from 'pg';

let pool;
let schemaReady;

export function db() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set. Connect a Postgres database in Vercel or add it to .env.local.');
  pool ??= new pg.Pool({ connectionString, max: 1 });
  return pool;
}

// Creates the tables on first use, so a new database needs no separate setup step.
export function ensureSchema() {
  schemaReady ??= db().query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL
    );
  `).catch(error => {
    schemaReady = undefined;
    throw error;
  });
  return schemaReady;
}
