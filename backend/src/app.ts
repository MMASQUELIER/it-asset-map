/**
 * @file app.ts
 * @brief Construction de l'application Hono.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { registerAssetRoutes } from "./routes/assets.routes.ts";
import { registerMapRoutes } from "./routes/map.routes.ts";

/**
 * @brief Cree l'application HTTP du backend.
 * @returns Application Hono configuree.
 */
export function createApiApp() {
  const apiApp = new Hono({ strict: false });

  apiApp.use("*", cors());
  apiApp.get("/", (context) => context.text("API IT Map est en ligne."));

  registerAssetRoutes(apiApp);
  registerMapRoutes(apiApp);

  return apiApp;
}
