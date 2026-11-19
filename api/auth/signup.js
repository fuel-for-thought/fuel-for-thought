import { db, ensureSchema } from '../_lib/db.js';
import { handle, hashPassword, httpError, isUhEmail, normalizeEmail, readJson, send, startSession } from '../_lib/auth.js';

export default handle(async (request, response) => {
  const body = await readJson(request);
  const name = String(body.name || '').trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (!name || name.length > 80) throw httpError(400, 'Enter your name (80 characters or fewer).');
  if (!isUhEmail(email)) throw httpError(400, 'Use your UH email address, ending in @hawaii.edu.');
  if (password.length < 8) throw httpError(400, 'Use a password with at least 8 characters.');
  if (password.length > 128) throw httpError(400, 'Use a password with 128 characters or fewer.');

  await ensureSchema();
  const passwordHash = await hashPassword(password);
  const { rows } = await db().query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING RETURNING id, name, email`,
    [name, email, passwordHash],
  );
  if (!rows[0]) throw httpError(409, 'An account with that email already exists. Try signing in.');

  await startSession(request, response, rows[0].id);
  send(response, 201, { user: rows[0] });
});
