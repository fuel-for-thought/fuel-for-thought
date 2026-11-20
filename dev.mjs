import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';

// Load DATABASE_URL etc. from .env.local (created by `vercel env pull`).
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2];
  }
}
const apiRoot = fileURLToPath(new URL('./api', import.meta.url));

const root = fileURLToPath(new URL('./dist', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const port = Number(process.env.PORT || 3000);

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.startsWith('/api/')) {
      const file = resolve(apiRoot, '.' + pathname.slice(4) + '.js');
      if (!file.startsWith(apiRoot + sep) || file.includes(`${sep}_`) || !existsSync(file)) throw new Error('Unknown API route');
      const { default: handler } = await import(pathToFileURL(file));
      return await handler(request, response);
    }
    const route = pathname.replace(/\/$/, '') || '/index';
    const extension = extname(route) || '.html';
    const file = resolve(root, '.' + route + (extname(route) ? '' : extension));
    if (!file.startsWith(root + sep) || !types[extension]) throw new Error('Unknown route');
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extension] });
    response.end(content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Page not found');
  }
}).listen(port, '0.0.0.0', () => console.log(`Fuel for Thought listening on port ${port}`));
