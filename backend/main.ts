import { createApiApp } from "@/app/createApiApp.ts";
import { backendConfig } from "@/config/env.ts";

const apiApp = createApiApp();

console.log(`Serveur Hono lance sur http://localhost:${backendConfig.apiPort}`);
Deno.serve({ port: backendConfig.apiPort }, apiApp.fetch);
