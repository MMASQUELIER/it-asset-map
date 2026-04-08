import type { Hono } from "hono";
import {
  createJsonRoute,
  createNoContentRoute,
  getNumericRouteParam,
  readJsonBody,
} from "@/features/infrastructure-map/shared/http.ts";
import {
  createEquipmentData,
  deleteEquipmentData,
  listEquipmentData,
  updateEquipmentData,
} from "@/features/infrastructure-map/equipment-data/service.ts";

const equipmentDataPath = "/api/equipment-data";
const equipmentDataByIdPath = `${equipmentDataPath}/:equipmentDataId`;

export function registerEquipmentDataRoutes(apiApp: Hono): void {
  apiApp.get(
    equipmentDataPath,
    createJsonRoute(
      "Unable to load equipment data.",
      () => listEquipmentData(),
    ),
  );
  apiApp.post(
    equipmentDataPath,
    createJsonRoute(
      "Unable to create the equipment data record.",
      async (context) => createEquipmentData(await readJsonBody(context)),
      201,
    ),
  );
  apiApp.patch(
    equipmentDataByIdPath,
    createJsonRoute(
      "Unable to update the equipment data record.",
      async (context) =>
        updateEquipmentData(
          getNumericRouteParam(context, "equipmentDataId"),
          await readJsonBody(context),
        ),
    ),
  );
  apiApp.delete(
    equipmentDataByIdPath,
    createNoContentRoute(
      "Unable to delete the equipment data record.",
      (context) =>
        deleteEquipmentData(getNumericRouteParam(context, "equipmentDataId")),
    ),
  );
}
