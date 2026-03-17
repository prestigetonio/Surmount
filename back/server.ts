import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/coordinates', (req, res) => {
    const { latitude, longitude } = req.body;
    res.status(200).json({ message: 'Coordinates received', latitude, longitude });
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});

app.get('/api/coordinates', (req, res) => {
    // restore coordinates later
});
