import type { Context, Hono } from "hono";
import {
  getNumericRouteParam,
  handleRouteError,
  readJsonBody,
} from "@/features/infrastructure-map/shared/http.ts";
import {
  createEquipmentData,
  deleteEquipmentData,
  listEquipmentData,
  updateEquipmentData,
} from "@/features/infrastructure-map/equipment-data/service.ts";

export function registerEquipmentDataRoutes(apiApp: Hono): void {
  apiApp.get("/api/equipment-data", handleListEquipmentData);
  apiApp.post("/api/equipment-data", handleCreateEquipmentData);
  apiApp.patch("/api/equipment-data/:equipmentDataId", handleUpdateEquipmentData);
  apiApp.delete(
    "/api/equipment-data/:equipmentDataId",
    handleDeleteEquipmentData,
  );
}

async function handleListEquipmentData(context: Context) {
  try {
    return context.json(await listEquipmentData());
  } catch (error) {
    return handleRouteError(context, error, "Unable to load equipment data.");
  }
}

async function handleCreateEquipmentData(context: Context) {
  try {
    const payload = await readJsonBody(context);
    return context.json(await createEquipmentData(payload), 201);
  } catch (error) {
    return handleRouteError(
      context,
      error,
      "Unable to create the equipment data record.",
    );
  }
}

async function handleUpdateEquipmentData(context: Context) {
  try {
    const equipmentDataId = getNumericRouteParam(context, "equipmentDataId");
    const payload = await readJsonBody(context);

    return context.json(await updateEquipmentData(equipmentDataId, payload));
  } catch (error) {
    return handleRouteError(
      context,
      error,
      "Unable to update the equipment data record.",
    );
  }
}

async function handleDeleteEquipmentData(context: Context) {
  try {
    const equipmentDataId = getNumericRouteParam(context, "equipmentDataId");

    await deleteEquipmentData(equipmentDataId);
    return context.body(null, 204);
  } catch (error) {
    return handleRouteError(
      context,
      error,
      "Unable to delete the equipment data record.",
    );
  }
}
