import { db, ensureSchema } from '../_lib/db.js';
import { handle, hashPassword, httpError, normalizeEmail, readJson, send, startSession, verifyPassword } from '../_lib/auth.js';

// Compared against when the email is unknown, so a wrong email takes as long as a wrong password.
const placeholderHash = hashPassword('placeholder-password');

export default handle(async (request, response) => {
  const body = await readJson(request);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  if (!email || !password) throw httpError(400, 'Enter your email and password.');

  await ensureSchema();
  const { rows } = await db().query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  const valid = await verifyPassword(password, user ? user.password_hash : await placeholderHash);
  if (!user || !valid) throw httpError(401, 'That email and password don’t match an account.');

  await startSession(request, response, user.id);
  send(response, 200, { user: { id: user.id, name: user.name, email: user.email } });
});
