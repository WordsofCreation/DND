import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
const root = resolve(process.argv[2] || '.');
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.svg':'image/svg+xml' };
createServer((req,res)=>{
  const raw = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = resolve(join(root, raw === '/' ? 'index.html' : raw));
  if (!file.startsWith(root)) file = join(root, 'index.html');
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html');
  res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
  createReadStream(file).pipe(res);
}).listen(5173, '0.0.0.0', () => console.log(`Serving ${root} at http://localhost:5173`));
