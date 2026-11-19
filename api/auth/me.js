import { currentUser, handle, send } from '../_lib/auth.js';

export default handle(async (request, response) => {
  send(response, 200, { user: await currentUser(request) });
});
