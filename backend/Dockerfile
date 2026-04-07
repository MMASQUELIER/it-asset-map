FROM denoland/deno:alpine AS base

WORKDIR /app/backend

COPY backend/deno.json ./
COPY backend/main.ts ./
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY assets /app/assets

RUN deno task prisma:generate
RUN deno cache main.ts scripts/prisma.ts scripts/check_database.ts
FROM base AS development

CMD ["task", "dev"]

FROM base AS runtime

CMD ["run", "-A", "main.ts"]
