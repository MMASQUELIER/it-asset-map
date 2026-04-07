# it-asset-map

Stack:
- `frontend`: React + Vite
- `backend`: Deno + Hono + Prisma
- `database`: MySQL 8

Backend local config:
- `backend/.env` is loaded automatically in local Deno runs
- Docker Compose environment variables keep priority over `.env`
- `DATABASE_URL` is derived automatically from `MYSQL_*` if needed
- `deno task db:import:espagnac` reimporte le CMDB Espagnac avec seulement les champs utiles
- `deno task db:import:espagnac` imports the compatible equipment content from `CMDB Espagnac test.xlsm`
- for a reliable import with the current setup, run the task inside the Docker backend container
- `CMDB_EXCEL_PATH` can override the workbook path for the import script

Docker:
- Single stack: `docker compose up --build`
- Prisma migrations are applied automatically when the backend starts

Default ports:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:8001`
- MySQL: `localhost:3306`
