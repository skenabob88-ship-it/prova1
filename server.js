const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cambia-password';

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cb(null, `${timestamp}_${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024, files: 20 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Sono ammessi solo file immagine o video.'));
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

app.get('/qr.png', async (req, res) => {
  try {
    const buffer = await QRCode.toBuffer(PUBLIC_URL, { width: 900, margin: 2 });
    res.type('png').send(buffer);
  } catch (err) {
    res.status(500).send('Errore generazione QR');
  }
});

app.post('/upload', upload.array('photos', 20), (req, res) => {
  res.json({ ok: true, count: req.files.length });
});

function requireAdmin(req, res, next) {
  const password = req.query.password || req.headers['x-admin-password'];
  if (password === ADMIN_PASSWORD) return next();
  res.status(401).send('Password amministratore richiesta. Aggiungi ?password=LA_PASSWORD all indirizzo.');
}

app.get('/admin', requireAdmin, (req, res) => {
  const files = fs.readdirSync(uploadDir).sort().reverse();
  const items = files.map(f => `<li><a href="/uploads/${encodeURIComponent(f)}" target="_blank">${f}</a></li>`).join('');
  res.send(`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Foto caricate</title><link rel="stylesheet" href="/style.css"></head><body><main class="card"><h1>Foto e video caricati</h1><p>${files.length} file ricevuti.</p><p><a class="button" href="/qr.png" target="_blank">Apri QR code</a></p><ul class="file-list">${items || '<li>Nessun file caricato.</li>'}</ul></main></body></html>`);
});

app.listen(PORT, () => {
  console.log(`Sito avviato: ${PUBLIC_URL}`);
  console.log(`Admin: ${PUBLIC_URL}/admin?password=${ADMIN_PASSWORD}`);
});
