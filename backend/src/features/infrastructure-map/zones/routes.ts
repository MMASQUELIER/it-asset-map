import type { Context, Hono } from "hono";
import {
  getNumericRouteParam,
  handleRouteError,
  readJsonBody,
} from "@/features/infrastructure-map/shared/http.ts";
import {
  createZone,
  deleteZone,
  listZones,
  updateZone,
} from "@/features/infrastructure-map/zones/service.ts";
import type {
  CreateZoneInput,
  UpdateZoneInput,
} from "@/features/infrastructure-map/zones/types.ts";

export function registerZoneRoutes(apiApp: Hono): void {
  apiApp.get("/api/zones", handleListZones);
  apiApp.post("/api/zones", handleCreateZone);
  apiApp.patch("/api/zones/:zoneId", handleUpdateZone);
  apiApp.delete("/api/zones/:zoneId", handleDeleteZone);
}

async function handleListZones(context: Context) {
  try {
    return context.json(await listZones());
  } catch (error) {
    return handleRouteError(context, error, "Unable to load zones.");
  }
}

async function handleCreateZone(context: Context) {
  try {
    const input = await readJsonBody(context) as CreateZoneInput;
    return context.json(await createZone(input), 201);
  } catch (error) {
    return handleRouteError(context, error, "Unable to create the zone.");
  }
}

async function handleUpdateZone(context: Context) {
  try {
    const zoneId = getNumericRouteParam(context, "zoneId");
    const input = await readJsonBody(context) as UpdateZoneInput;

    return context.json(await updateZone(zoneId, input));
  } catch (error) {
    return handleRouteError(context, error, "Unable to update the zone.");
  }
}

async function handleDeleteZone(context: Context) {
  try {
    const zoneId = getNumericRouteParam(context, "zoneId");

    await deleteZone(zoneId);
    return context.body(null, 204);
  } catch (error) {
    return handleRouteError(context, error, "Unable to delete the zone.");
  }
}
