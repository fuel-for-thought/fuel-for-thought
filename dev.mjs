import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./dist', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const port = Number(process.env.PORT || 3000);

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
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
