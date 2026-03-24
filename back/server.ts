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
    const result = await pool.query(
        'INSERT INTO coordinates (name, latitude, longitude, altitude) VALUES ($1, $2, $3, $4) RETURNING id',
        [name || 'sans nom', latitude, longitude, altitude || 0]
    );
    res.status(200).json({ id: result.rows[0].id, latitude, longitude });
});

app.delete('/api/coordinates/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    await pool.query('DELETE FROM coordinates WHERE id = $1', [id]);
    res.status(200).json({ message: 'Point supprimé' });
});

app.get('/api/coordinates', async (_req: Request, res: Response) => {
    const result = await pool.query(
        'SELECT name, latitude, longitude, altitude, added_at FROM coordinates ORDER BY added_at ASC'
    );
    res.status(200).json(result.rows);
});

app.get('/api/mountain-data', async (req: Request, res: Response) => {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Paramètres lat/lon invalides' });
    }
    try {
        const [weatherRes, elevRes] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=snowfall_sum&hourly=snow_depth&forecast_days=1&timezone=auto`),
            fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat},${lat + 0.001},${lat}&longitude=${lon},${lon},${lon + 0.001}`)
        ]);
        const weather = await weatherRes.json() as any;
        const elevData = await elevRes.json() as any;
        const temperature: number = weather.current_weather?.temperature ?? 0;
        const windSpeed: number = weather.current_weather?.windspeed ?? 0;
        const snowfall: number = Math.round((weather.daily?.snowfall_sum?.[0] ?? 0) * 10) / 10;
        const snowDepth: number = Math.round((weather.hourly?.snow_depth?.[0] ?? 0) * 100);
        const [elev0, elevN, elevE]: number[] = elevData.elevation ?? [0, 0, 0];
        const latRad = lat * Math.PI / 180;
        const dzN = Math.abs(elevN - elev0) / (0.001 * 111000);
        const dzE = Math.abs(elevE - elev0) / (0.001 * 111000 * Math.cos(latRad));
        const slopeAngle = Math.round(Math.atan(Math.sqrt(dzN * dzN + dzE * dzE)) * 180 / Math.PI);
        let risk = 1;
        if (snowDepth > 30) {
            risk++;
        }
        if (snowfall > 10) {
            risk++;
        }
        if (windSpeed > 40) {
            risk++;
        }
        if (slopeAngle > 30) {
            risk++;
        }
        risk = Math.min(5, risk);
        const riskLabels = ['', 'Faible', 'Limité', 'Marqué', 'Fort', 'Trés Fort'];
        res.json({ temperature, windSpeed, snowDepth, snowfall, slopeAngle, risk, riskLabel: riskLabels[risk] });
    } catch (err) {
        console.error('Erreur lors de la récupération des données : ', err);
        res.status(500).json({ error: 'Échec de la récupération des données externes' });
    }
});

initDb().then(() => {
    app.listen(port, () => {
        console.log(`Backend listening at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
