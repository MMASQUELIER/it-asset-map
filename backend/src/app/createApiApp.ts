import { Hono } from "hono";
import { cors } from "hono/cors";
import { registerInfrastructureMapRoutes } from "@/features/infrastructure-map/index.ts";

export function createApiApp(): Hono {
  const apiApp = new Hono({ strict: false });

  apiApp.use("*", cors());
  apiApp.get("/", (context) => context.text("API IT Map est en ligne."));

  registerInfrastructureMapRoutes(apiApp);

  return apiApp;
}
