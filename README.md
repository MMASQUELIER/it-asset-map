# it-asset-map

Application de cartographie d'atelier avec :
- `frontend` : React + Vite
- `backend` : Deno + Hono
- `base` : SQLite fichier unique dans `backend/data/app.sqlite`

Le projet est maintenant volontairement simple :
- un schema SQL unique dans `backend/db/schema.sql`
- une base locale creee automatiquement au demarrage

## Lancement

Backend :
```bash
cd backend
deno task dev
```

Frontend :
```bash
cd frontend
npm install
npm run dev
```

## Ports par defaut

- frontend : `http://localhost:5173`
- backend : `http://localhost:8000`

## Configuration backend

`backend/.env` est charge automatiquement en local.

Variables utiles :
- `API_PORT`
- `SQLITE_PATH`
- `MAP_FILE_PATH`

Exemple :
```env
API_PORT=8000
SQLITE_PATH=./data/app.sqlite
MAP_FILE_PATH=../assets/map.png
```

## Base de donnees

- schema SQL : `backend/db/schema.sql`
- fichier SQLite : `backend/data/app.sqlite`
- creation automatique si la base n'existe pas
- le contrat API frontend/backend reste inchangé

Tu peux ouvrir `backend/data/app.sqlite` avec un outil SQLite de bureau pour consulter ou sauvegarder les donnees.

## Commandes utiles

Backend :
- `deno task dev`
- `deno task start`
- `deno task db:check`
- `deno task test`

Frontend :
- `npm run dev`
- `npm run build`
- `npm run lint`
