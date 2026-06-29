ISTRUZIONI RAPIDE

1) Installa Node.js sul computer/server.
2) Apri il terminale in questa cartella.
3) Esegui: npm install
4) Avvia il sito:
   PUBLIC_URL=https://tuodominio.it ADMIN_PASSWORD=la-tua-password npm start

In locale puoi usare:
   npm install
   npm start

Pagina ospiti:
   http://localhost:3000

QR code:
   http://localhost:3000/qr.png

Pannello amministratore:
   http://localhost:3000/admin?password=cambia-password

IMPORTANTE
- I file caricati finiscono nella cartella uploads.
- Per usarlo durante un evento devi pubblicarlo su un server o servizio tipo Render, Railway, VPS, NAS o hosting Node.js.
- Cambia sempre ADMIN_PASSWORD prima dell'uso reale.
