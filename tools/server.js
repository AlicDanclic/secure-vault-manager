const http = require('http');
const fs = require('fs');
const path = require('path');
const { serveStatic } = require('./static-server');
const { handleApi } = require('./vault-api');

const PORT = Number(process.env.PORT || 3003);
const ROOT = path.resolve(__dirname, '..');
const RENDERER_ROOT = fs.existsSync(path.join(ROOT, 'out', 'renderer'))
  ? path.join(ROOT, 'out', 'renderer')
  : path.join(ROOT, 'src', 'renderer');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    handleApi(req, res);
    return;
  }
  serveStatic(req, res, RENDERER_ROOT);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SecureVault web preview: http://localhost:${PORT}`);
});
