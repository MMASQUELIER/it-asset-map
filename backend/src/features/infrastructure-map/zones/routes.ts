import type { Hono } from "hono";
import {
  createJsonRoute,
  createNoContentRoute,
  getNumericRouteParam,
  readJsonBodyAs,
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

const zonesPath = "/api/zones";
const zoneByIdPath = `${zonesPath}/:zoneId`;

export function registerZoneRoutes(apiApp: Hono): void {
  apiApp.get(
    zonesPath,
    createJsonRoute("Unable to load zones.", () => listZones()),
  );
  apiApp.post(
    zonesPath,
    createJsonRoute(
      "Unable to create the zone.",
      async (context) =>
        createZone(await readJsonBodyAs<CreateZoneInput>(context)),
      201,
    ),
  );
  apiApp.patch(
    zoneByIdPath,
    createJsonRoute(
      "Unable to update the zone.",
      async (context) =>
        updateZone(
          getNumericRouteParam(context, "zoneId"),
          await readJsonBodyAs<UpdateZoneInput>(context),
        ),
    ),
  );
  apiApp.delete(
    zoneByIdPath,
    createNoContentRoute(
      "Unable to delete the zone.",
      (context) => deleteZone(getNumericRouteParam(context, "zoneId")),
    ),
  );
}
