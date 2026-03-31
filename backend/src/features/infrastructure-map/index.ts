import type { Hono } from "hono";
import { registerCatalogRoutes } from "@/features/infrastructure-map/catalog/routes.ts";
import { registerLayoutRoutes } from "@/features/infrastructure-map/layout/routes.ts";
import { registerMapImageRoutes } from "@/features/infrastructure-map/map-image/routes.ts";

export function registerInfrastructureMapRoutes(apiApp: Hono): void {
  registerCatalogRoutes(apiApp);
  registerLayoutRoutes(apiApp);
  registerMapImageRoutes(apiApp);
}
