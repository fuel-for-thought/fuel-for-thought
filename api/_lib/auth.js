import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { db, ensureSchema } from './db.js';

const scryptAsync = promisify(scrypt);
const COOKIE = 'fft_session';
const SESSION_DAYS = 30;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, salt, hash] = String(stored).split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64');
  const actual = await scryptAsync(password, Buffer.from(salt, 'base64'), expected.length);
  return timingSafeEqual(actual, expected);
}

const tokenHash = token => createHash('sha256').update(token).digest('hex');

function cookieHeader(request, value, maxAge) {
  const host = String(request.headers.host || '');
  const secure = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? '' : '; Secure';
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function readCookie(request) {
  const match = String(request.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export async function startSession(request, response, userId) {
  const token = randomBytes(32).toString('base64url');
  await db().query(
    `INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3))`,
    [tokenHash(token), userId, SESSION_DAYS],
  );
  response.setHeader('Set-Cookie', cookieHeader(request, token, SESSION_DAYS * 86400));
}

export async function endSession(request, response) {
  const token = readCookie(request);
  if (token) await db().query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash(token)]);
  response.setHeader('Set-Cookie', cookieHeader(request, '', 0));
}

export async function currentUser(request) {
  const token = readCookie(request);
  if (!token) return null;
  await ensureSchema();
  const { rows } = await db().query(
    `SELECT users.id, users.name, users.email FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = $1 AND sessions.expires_at > now()`,
    [tokenHash(token)],
  );
  return rows[0] || null;
}

// Accepts only JSON POSTs. Browsers cannot send a cross-site JSON request without
// a CORS preflight, which these endpoints never approve, so this also blocks CSRF.
export async function readJson(request) {
  if (request.method !== 'POST') throw httpError(405, 'Use POST.');
  if (!String(request.headers['content-type'] || '').includes('application/json')) throw httpError(415, 'Send JSON.');
  if (request.body && typeof request.body === 'object') return request.body;
  let raw = '';
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 10_000) throw httpError(413, 'Request is too large.');
  }
  try {
    return JSON.parse(raw || '{}');
  } catch {
    throw httpError(400, 'Request body is not valid JSON.');
  }
}

export function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}

export function send(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

export function handle(fn) {
  return async (request, response) => {
    try {
      await fn(request, response);
    } catch (error) {
      if (error.status) return send(response, error.status, { error: error.message });
      console.error(error);
      send(response, 500, { error: 'Something went wrong on our end. Please try again.' });
    }
  };
}

export const normalizeEmail = email => String(email || '').trim().toLowerCase();
export const isUhEmail = email => /^[^\s@]+@hawaii\.edu$/.test(email);
