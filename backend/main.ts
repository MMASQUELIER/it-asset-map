/**
 * @file main.ts
 * @brief Point d'entree du backend Deno.
 */

import { createApiApp } from "./src/app.ts";
import { backendConfig } from "./src/config/env.ts";

const apiApp = createApiApp();

console.log(`Serveur Hono lance sur http://localhost:${backendConfig.apiPort}`);
Deno.serve({ port: backendConfig.apiPort }, apiApp.fetch);
