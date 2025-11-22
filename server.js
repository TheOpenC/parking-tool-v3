import express from 'express';
import cors from 'cors';
import { combineAPIData } from './js/report.js';


const app = express();
app.use(cors());

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
  console.log(`Server is listening on http://localhost:${PORT}`);
});
