import express from 'express';
import cors from 'cors';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { combineAPIData } from './js/report.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORT_PATH = path.join(__dirname, 'public', 'report.txt');

async function updateReportFile() {
    const report = await combineAPIData();
    await fs.writeFile('public/report.txt', report, 'utf8');
    console.log('Report updated');
}

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log('🌐 REQUEST:', req.method, req.url);
  next();
});


app.use((req, res, next) => {
  console.log('[app.use] incoming:', req.method, req.url);
  next();
});

app.get('/api/report', async (req, res) => {
  console.log('[route] GET /api/report reached (calling combineAPIData)');
  try {
    const report = await combineAPIData();
    console.log('[route] combineAPIData finished');
    res.type('text/plain').send(report);
  } catch (err) {
    console.error('[route] combineAPIData error:', err);
    res.status(500).type('text/plain').send('Error: ' + err.message);
  }
});

app.use((req, res) => {
  console.log('[fallback] no route matched for', req.method, req.url);
  res.status(404).type('text/plain').send('No route matched\n');
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
  
  //generate once on startup
  updateReportFile();

  //every three hours

  const THREE_HOURS = 3 * 60 * 60 * 1000;
  setInterval(updateReportFile, THREE_HOURS);
});
