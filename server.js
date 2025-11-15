import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();              // 1) create the server
const PORT = 3001;                  // 2) choose a port

// serve static files
app.use(express.static('public'));

app.get('/api/calendar', (req, res) => {        // 3) handle GET / requests
    console.log('HIT /api/calendar', req.url); // debug print
    res.json({ ok: true, receivedPath: req.url }); // JSON on purpose

});

//
app.get('/hello', (req, res) => {
    res.send('Hello from Express'); // 4) send a response and end
})


app.listen(PORT, () => {            // 5) start listening
    console.log(`http://localhost:${PORT}`);
});

