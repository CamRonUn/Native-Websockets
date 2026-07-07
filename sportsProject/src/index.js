import express from 'express';
import {matchRouter} from './routes/matches.js'

const PORT = 8000;
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// GET route that returns a short message
app.get('/getroute', (req, res) => {
    res.send("Hello! This is a short message from getroute." );
});

app.use('/matches', matchRouter)

// Start the server and log the URL
app.listen(PORT, () => {
    console.log(`Server is running and listening at http://localhost:${PORT}`);
});