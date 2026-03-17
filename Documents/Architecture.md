# Architecture du code — Surmount

## Vue d'ensemble

Surmount est une application web full-stack composée de 3 services Docker :

```
┌─────────────────────────────────────────────────────────┐
│                      Navigateur                         │
│              http://localhost:5173                      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              Frontend (Vite + Cesium.js)                │
│                  surmount-front :5173                   │
│  Proxy /api/* ──────────────────────────────────────┐   │
└─────────────────────────────────────────────────────┼───┘
                                                      │
┌─────────────────────────────────────────────────────▼───┐
│              Backend (Express + TypeScript)             │
│                  surmount-back :3000                    │
│  POST /api/coordinates   ──────────────────────────┐    │
│  GET  /api/coordinates   ──────────────────────┐   │    │
└────────────────────────────────────────────────┼───┼────┘
                                                 │   │
┌────────────────────────────────────────────────▼───▼────┐
│              Base de données (PostgreSQL 16)            │
│                   surmount-db :5432                     │
│  Table : coordinates                                    │
│  (id, name, latitude, longitude, altitude, added_at)   │
└─────────────────────────────────────────────────────────┘
```

---

## Structure des fichiers

```
Surmount/
├── back/
│   ├── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── front/
│   ├── src/
│   │   ├── main.ts
│   │   ├── map.ts
│   │   ├── panel.ts
│   │   ├── modal.ts
│   │   ├── ui.ts
│   │   ├── types.ts
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yaml
├── start-docker.sh
└── Documents/
```

---

## Base de données

### Table `coordinates`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant unique auto-incrémenté |
| `name` | TEXT | Nom du point saisi par l'utilisateur |
| `latitude` | DOUBLE PRECISION | Latitude en degrés décimaux |
| `longitude` | DOUBLE PRECISION | Longitude en degrés décimaux |
| `altitude` | DOUBLE PRECISION | Altitude en mètres |
| `added_at` | TIMESTAMP | Date et heure d'ajout (UTC) |

La table est créée automatiquement au démarrage du backend si elle n'existe pas.

---

## API REST

### `POST /api/coordinates`
Enregistre un nouveau point en base de données.

**Corps de la requête :**
```json
{
  "name": "Mon point",
  "latitude": 42.6977,
  "longitude": 0.5432,
  "altitude": 1200.5
}
```

**Réponse :**
```json
{ "message": "Coordinates received", "latitude": 42.6977, "longitude": 0.5432 }
```

---

### `GET /api/coordinates`
Retourne tous les points enregistrés, triés par date d'ajout.

**Réponse :**
```json
[
  {
    "name": "Mon point",
    "latitude": 42.6977,
    "longitude": 0.5432,
    "altitude": 1200.5,
    "added_at": "2026-03-17T15:42:00.000Z"
  }
]
```

---

## Flux de données

### Ajout d'un point
1. L'utilisateur clique sur la carte → Cesium calcule les coordonnées 3D
2. Une modal s'ouvre → l'utilisateur saisit un nom
3. Le point est ajouté localement (tableau `points`) et affiché sur la carte
4. `POST /api/coordinates` envoie les données au backend
5. Le backend insère le point en base de données

### Chargement initial
1. Au démarrage de l'app, `GET /api/coordinates` est appelé
2. Chaque point retourné est ajouté au tableau `points`
3. Un marqueur est placé sur la carte pour chaque point
4. Le panneau latéral est mis à jour

---

## Technologies utilisées

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Cesium.js 1.139 | Carte 3D interactive |
| Frontend | Vite 5 + TypeScript | Build et développement |
| Backend | Express 4 + TypeScript | Serveur HTTP et API REST |
| Backend | node-postgres (pg) | Connexion à PostgreSQL |
| Base de données | PostgreSQL 16 | Persistance des données |
| Infrastructure | Docker + Docker Compose | Conteneurisation et orchestration |
