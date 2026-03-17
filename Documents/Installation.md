# Installation — Surmount

## Prérequis

### Logiciels à installer

| Logiciel | Version minimale | Lien |
|----------|-----------------|------|
| **Docker** | 24+ | https://docs.docker.com/get-docker/ |
| **Docker Compose** (plugin v2) | 2.20+ | Inclus avec Docker Desktop, ou `apt install docker-compose-plugin` |
| **Node.js** *(dev local uniquement)* | 20+ | https://nodejs.org |
| **pnpm** *(dev local uniquement)* | 8+ | `npm install -g pnpm` |

> Docker Compose v2 s'utilise avec `docker compose` (avec un espace), pas `docker-compose`.

### Vérifier l'installation
```bash
docker --version
docker compose version
```

---

## Lancement avec Docker (recommandé)

```bash
./start-docker.sh
```

Ce script :
1. Vérifie que Docker est actif
2. Arrête les conteneurs Surmount existants
3. Supprime les conteneurs arrêtés
4. Reconstruit et démarre les 3 conteneurs

Une fois lancé, l'application est accessible sur :
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:3001
- **Base de données** → interne Docker (non exposée)

---

## Lancement en développement local (sans Docker)

### Prérequis supplémentaires
- PostgreSQL installé et en cours d'exécution
- Créer une base de données `surmount` avec un utilisateur `surmount` / mot de passe `surmount`

```sql
CREATE USER surmount WITH PASSWORD 'surmount';
CREATE DATABASE surmount OWNER surmount;
```

### Backend
```bash
cd back
pnpm install
pnpm run dev
# Écoute sur http://localhost:3000
```

### Frontend
```bash
cd front
npm install
npm run dev
# Écoute sur http://localhost:5173
```

---

## Variables d'environnement (backend)

| Variable | Défaut | Description |
|----------|--------|-------------|
| `DB_HOST` | `localhost` | Hôte PostgreSQL |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `DB_USER` | `surmount` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | `surmount` | Mot de passe PostgreSQL |
| `DB_NAME` | `surmount` | Nom de la base de données |

---

## Arrêter l'application

```bash
cd /chemin/vers/Surmount
sudo docker compose down
```

Pour supprimer aussi les données de la base :
```bash
sudo docker compose down -v
```
