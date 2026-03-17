import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();
const port = 3000;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'surmount',
    password: process.env.DB_PASSWORD || 'surmount',
    database: process.env.DB_NAME || 'surmount',
});

async function initDb() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS coordinates (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL DEFAULT 'sans nom',
            latitude DOUBLE PRECISION NOT NULL,
            longitude DOUBLE PRECISION NOT NULL,
            altitude DOUBLE PRECISION NOT NULL DEFAULT 0,
            added_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    `);
}

app.use(bodyParser.json());

app.post('/api/coordinates', async (req: Request, res: Response) => {
    const { name, latitude, longitude, altitude } = req.body;
    await pool.query(
        'INSERT INTO coordinates (name, latitude, longitude, altitude) VALUES ($1, $2, $3, $4)',
        [name || 'sans nom', latitude, longitude, altitude || 0]
    );
    res.status(200).json({ message: 'Coordinates received', latitude, longitude });
});

app.get('/api/coordinates', async (_req: Request, res: Response) => {
    const result = await pool.query(
        'SELECT name, latitude, longitude, altitude, added_at FROM coordinates ORDER BY added_at ASC'
    );
    res.status(200).json(result.rows);
});

initDb().then(() => {
    app.listen(port, () => {
        console.log(`Backend listening at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
