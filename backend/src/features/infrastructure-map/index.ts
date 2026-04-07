import type { Hono } from "hono";
import { registerEquipmentDataRoutes } from "@/features/infrastructure-map/equipment-data/routes.ts";
import { registerEquipmentRoutes } from "@/features/infrastructure-map/equipment/routes.ts";
import { registerMapImageRoutes } from "@/features/infrastructure-map/map-image/routes.ts";
import { registerSectorRoutes } from "@/features/infrastructure-map/sectors/routes.ts";
import { registerZoneRoutes } from "@/features/infrastructure-map/zones/routes.ts";

export function registerInfrastructureMapRoutes(apiApp: Hono): void {
  registerSectorRoutes(apiApp);
  registerZoneRoutes(apiApp);
  registerEquipmentDataRoutes(apiApp);
  registerEquipmentRoutes(apiApp);
  registerMapImageRoutes(apiApp);
}
