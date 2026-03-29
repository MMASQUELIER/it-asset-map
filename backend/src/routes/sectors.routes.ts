/**
 * @file sectors.routes.ts
 * @brief Declaration des routes HTTP liees aux secteurs autorises.
 */

import type { Hono } from "hono";
import { backendConfig } from "../config/env.ts";

/**
 * @brief Enregistre les routes HTTP des secteurs backend.
 * @param apiApp Application Hono cible.
 */
export function registerSectorRoutes(apiApp: Hono) {
  apiApp.get("/sectors", (context) => context.json(backendConfig.sectors));
  apiApp.get("/api/sectors", (context) => context.json(backendConfig.sectors));
}
