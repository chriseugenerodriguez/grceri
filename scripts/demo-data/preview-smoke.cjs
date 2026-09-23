// Serve the production build on loopback only, run the browser smoke, then close it.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '../../website/dist/browser');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) file = path.join(root, 'index.html');
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
server.listen(4205, '127.0.0.1', () => {
  const child = spawn(process.execPath, [path.join(__dirname, 'react-smoke.cjs')], { stdio: 'inherit' });
  child.on('exit', code => { server.close(); process.exitCode = code ?? 1; });
  child.on('error', error => { console.error(error.message); server.close(); process.exitCode = 1; });
});
