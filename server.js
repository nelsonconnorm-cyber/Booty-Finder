/**
 * Booty Finder — Render Proxy Server
 * ────────────────────────────────────
 * Deployed on Render.com as a Web Service.
 * The ATTOM API key lives in Render's environment variables — never in code.
 *
 * Endpoints:
 *   GET /health           → returns 200 OK (keeps Render awake)
 *   GET /attom?path=...&PARAMS  → proxies to ATTOM API with server-side key
 */

const https = require('https');
const http  = require('http');
const url   = require('url');

const PORT       = process.env.PORT || 3000;
const ATTOM_KEY  = process.env.ATTOM_API_KEY;
const ATTOM_BASE = 'https://api.attomdata.com/propertyapi/v1.0.0';

if (!ATTOM_KEY) {
  console.error('ERROR: ATTOM_API_KEY environment variable is not set.');
  console.error('Set it in Render → Your Service → Environment → Add Environment Variable');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS — allow requests from any origin (GitHub Pages, localhost, etc.)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'accept, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsed = url.parse(req.url, true);

  // ── Health check (ping to prevent cold starts) ──
  if (parsed.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'Booty Finder Proxy' }));
    return;
  }

  // ── ATTOM proxy ──
  if (parsed.pathname === '/attom') {
    const attomPath  = parsed.query.path;  // e.g. /property/snapshot
    if (!attomPath) {
      res.writeHead(400);
      res.end('Missing ?path= parameter');
      return;
    }

    // Rebuild query params (everything except 'path')
    const forwardParams = new url.URLSearchParams();
    Object.entries(parsed.query).forEach(([k, v]) => {
      if (k !== 'path') forwardParams.set(k, v);
    });

    const targetUrl = `${ATTOM_BASE}${attomPath}?${forwardParams.toString()}`;
    console.log(`→ ${new Date().toISOString()} | ${attomPath} | ${forwardParams.toString()}`);

    const options = url.parse(targetUrl);
    options.headers = {
      'apikey': ATTOM_KEY,   // Key injected server-side — never sent to browser
      'accept': 'application/json'
    };
    options.method = 'GET';

    const proxyReq = https.request(options, proxyRes => {
      let body = '';
      proxyRes.on('data', chunk => body += chunk);
      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(body);
      });
    });

    proxyReq.on('error', err => {
      console.error('Proxy error:', err.message);
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });

    proxyReq.end();
    return;
  }

  // 404 for everything else
  res.writeHead(404);
  res.end('Not found. Use /attom?path=/property/snapshot&postalcode=...');
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ☠  Booty Finder Proxy is sailing!');
  console.log(`  Listening on port ${PORT}`);
  console.log(`  ATTOM key: ${ATTOM_KEY.substring(0, 6)}${'*'.repeat(ATTOM_KEY.length - 6)}`);
  console.log('');
});
