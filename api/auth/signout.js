import { endSession, handle, readJson, send } from '../_lib/auth.js';
import { ensureSchema } from '../_lib/db.js';

export default handle(async (request, response) => {
  await readJson(request);
  await ensureSchema();
  await endSession(request, response);
  send(response, 200, { ok: true });
});
