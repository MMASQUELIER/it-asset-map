import type { Hono } from "hono";
import { backendConfig } from "@/config/env.ts";
import { readMapFile } from "@/features/infrastructure-map/map-image/repository.ts";
import { createRouteHandler } from "@/features/infrastructure-map/shared/http.ts";

const mapImagePath = "/api/map-image";

export function registerMapImageRoutes(apiApp: Hono): void {
  apiApp.get(
    mapImagePath,
    createRouteHandler("Unable to load the map image.", async (context) => {
      const mapFileBuffer = await readMapFile(backendConfig.mapFilePath);

      return context.body(mapFileBuffer, 200, {
        "Content-Type": "image/png",
      });
    }),
  );
}
