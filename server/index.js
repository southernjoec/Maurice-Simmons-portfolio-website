import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;
const DIST = process.env.CLIENT_DIST || path.join(__dirname, '..', 'client', 'dist');
const DATA_FILE = path.join(__dirname, 'data', 'portfolio.json');

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

// Health check (useful for Cloud Run and local smoke tests)
app.get('/healthz', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Portfolio content is served dynamically from the server.
// Edit server/data/portfolio.json to change site content without touching React code.
app.get('/api/portfolio', async (_req, res, next) => {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    res.set('Cache-Control', 'no-store').json(JSON.parse(raw));
  } catch (err) {
    next(err);
  }
});

// Contact form: validates input server-side. Messages are written to the
// server log (visible in Cloud Run > Logs). No email service is required.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const recent = new Map(); // naive per-IP rate limit
app.post('/api/contact', (req, res) => {
  const { name = '', email = '', message = '', website = '' } = req.body || {};
  if (website) return res.json({ ok: true }); // honeypot field: silently drop bots

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
  const last = recent.get(ip) || 0;
  if (Date.now() - last < 30_000) {
    return res.status(429).json({ ok: false, error: 'Please wait a moment before sending another message.' });
  }

  const errors = {};
  if (String(name).trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(String(email).trim())) errors.email = 'Please enter a valid email address.';
  if (String(message).trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  if (String(message).length > 2000) errors.message = 'Message must be under 2000 characters.';
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  recent.set(ip, Date.now());
  console.log(JSON.stringify({
    severity: 'NOTICE',
    type: 'contact_message',
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    receivedAt: new Date().toISOString(),
  }));
  res.json({ ok: true });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// Serve the built React app
app.use(express.static(DIST, { index: false, maxAge: '1h' }));
app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Portfolio server listening on port ${PORT}`));
