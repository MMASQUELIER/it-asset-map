import type { Context, Hono } from "hono";
import {
  getStringRouteParam,
  handleRouteError,
  readJsonBody,
} from "@/features/infrastructure-map/shared/http.ts";
import {
  createEquipment,
  deleteEquipment,
  listEquipment,
  updateEquipment,
} from "@/features/infrastructure-map/equipment/service.ts";

export function registerEquipmentRoutes(apiApp: Hono): void {
  apiApp.get("/api/equipment", handleListEquipment);
  apiApp.post("/api/equipment", handleCreateEquipment);
  apiApp.patch("/api/equipment/:equipmentId", handleUpdateEquipment);
  apiApp.delete("/api/equipment/:equipmentId", handleDeleteEquipment);
}

async function handleListEquipment(context: Context) {
  try {
    return context.json(await listEquipment());
  } catch (error) {
    return handleRouteError(context, error, "Unable to load equipment.");
  }
}

async function handleCreateEquipment(context: Context) {
  try {
    const payload = await readJsonBody(context);
    return context.json(await createEquipment(payload), 201);
  } catch (error) {
    return handleRouteError(context, error, "Unable to create the equipment.");
  }
}

async function handleUpdateEquipment(context: Context) {
  try {
    const equipmentId = getStringRouteParam(context, "equipmentId");
    const payload = await readJsonBody(context);

    return context.json(await updateEquipment(equipmentId, payload));
  } catch (error) {
    return handleRouteError(context, error, "Unable to update the equipment.");
  }
}

async function handleDeleteEquipment(context: Context) {
  try {
    const equipmentId = getStringRouteParam(context, "equipmentId");

    await deleteEquipment(equipmentId);
    return context.body(null, 204);
  } catch (error) {
    return handleRouteError(context, error, "Unable to delete the equipment.");
  }
}
