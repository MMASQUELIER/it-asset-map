import { createApiApp } from "@/app/createApiApp.ts";
import { backendConfig } from "@/config/env.ts";
import { ensureDatabaseReady } from "@/db/ensureDatabaseReady.ts";
import { closePrismaClient } from "@/db/prisma.ts";

try {
  await ensureDatabaseReady();

  const apiApp = createApiApp();

  console.log(`API server listening on http://localhost:${backendConfig.apiPort}`);
  const server = Deno.serve({ port: backendConfig.apiPort }, apiApp.fetch);
  await server.finished;
} finally {
  await closePrismaClient();
}
