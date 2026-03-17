# Organisation de l'équipe — Surmount

## Membres et responsabilités

| Membre | Domaine | Responsabilités |
|--------|---------|-----------------|
| **Tony** | Base de données + Frontend | Conception et gestion de la base de données PostgreSQL (stockage des coordonnées), affichage des marqueurs sur la carte Cesium |
| **Sven** | Frontend | Affichage des informations et données des points (panneau latéral, fiches de points, compteur) |
| **Mathis** | Frontend | Affichage et configuration de la carte Cesium (initialisation du viewer, couches d'imagerie, caméra, terrain) |
| **Tom** | Backend + Infrastructure | Serveur Express (API REST), configuration Docker et Docker Compose, orchestration des conteneurs |

## Répartition détaillée

### Tony — Base de données & Carte (affichage)
- Schéma de la table `coordinates` (PostgreSQL)
- Connexion et requêtes depuis le backend (`pg`)
- Chargement des points existants au démarrage de l'app
- Envoi et réception des coordonnées depuis/vers la carte

### Sven — Frontend (informations)
- Panneau latéral listant les points placés
- Fiches de points (nom, latitude, longitude, altitude, heure)
- Compteur de points
- Modal de saisie du nom d'un point

### Mathis — Frontend (carte)
- Initialisation du viewer Cesium 3D
- Configuration des couches (satellite ArcGIS + labels CartoDB)
- Positionnement initial de la caméra sur les Pyrénées
- Ajout et style des marqueurs sur la carte
- Gestion des clics sur le globe

### Tom — Backend & Docker
- Serveur Express (`server.ts`) et routes API
- Configuration des `Dockerfile` (backend et frontend)
- `docker-compose.yaml` (orchestration des 3 services)
- Script de démarrage `start-docker.sh`
