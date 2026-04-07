import type { Context, Hono } from "hono";
import { backendConfig } from "@/config/env.ts";
import { readMapFile } from "@/features/infrastructure-map/map-image/repository.ts";

export function registerMapImageRoutes(apiApp: Hono): void {
  apiApp.get("/api/map-image", handleGetMap);
}

async function handleGetMap(context: Context) {
  try {
    const mapFileBuffer = new Uint8Array(
      await readMapFile(backendConfig.mapFilePath),
    );

    return context.body(mapFileBuffer, 200, {
      "Content-Type": "image/png",
    });
  } catch {
    return context.json({ error: "Unable to load the map image." }, 500);
  }
}
