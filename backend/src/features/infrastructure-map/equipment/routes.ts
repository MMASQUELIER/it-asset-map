import type { Hono } from "hono";
import {
  createJsonRoute,
  createNoContentRoute,
  getStringRouteParam,
  readJsonBody,
} from "@/features/infrastructure-map/shared/http.ts";
import {
  createEquipment,
  deleteEquipment,
  listEquipment,
  updateEquipment,
} from "@/features/infrastructure-map/equipment/service.ts";

const equipmentPath = "/api/equipment";
const equipmentByIdPath = `${equipmentPath}/:equipmentRecordId`;

export function registerEquipmentRoutes(apiApp: Hono): void {
  apiApp.get(
    equipmentPath,
    createJsonRoute("Unable to load equipment.", () => listEquipment()),
  );
  apiApp.post(
    equipmentPath,
    createJsonRoute(
      "Unable to create the equipment.",
      async (context) => createEquipment(await readJsonBody(context)),
      201,
    ),
  );
  apiApp.patch(
    equipmentByIdPath,
    createJsonRoute(
      "Unable to update the equipment.",
      async (context) =>
        updateEquipment(
          getStringRouteParam(context, "equipmentRecordId"),
          await readJsonBody(context),
        ),
    ),
  );
  apiApp.delete(
    equipmentByIdPath,
    createNoContentRoute(
      "Unable to delete the equipment.",
      (context) =>
        deleteEquipment(getStringRouteParam(context, "equipmentRecordId")),
    ),
  );
}
