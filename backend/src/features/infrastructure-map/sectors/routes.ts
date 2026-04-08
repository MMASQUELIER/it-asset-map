import type { Hono } from "hono";
import {
  createJsonRoute,
  createNoContentRoute,
  getNumericRouteParam,
  readJsonBodyAs,
} from "@/features/infrastructure-map/shared/http.ts";
import {
  createSector,
  deleteSector,
  listSectors,
  updateSector,
} from "@/features/infrastructure-map/sectors/service.ts";
import type { SectorMutationInput } from "@/features/infrastructure-map/sectors/types.ts";

const sectorsPath = "/api/sectors";
const sectorByIdPath = `${sectorsPath}/:sectorId`;

export function registerSectorRoutes(apiApp: Hono): void {
  apiApp.get(
    sectorsPath,
    createJsonRoute("Unable to load sectors.", () => listSectors()),
  );
  apiApp.post(
    sectorsPath,
    createJsonRoute(
      "Unable to create the sector.",
      async (context) =>
        createSector(await readJsonBodyAs<SectorMutationInput>(context)),
      201,
    ),
  );
  apiApp.patch(
    sectorByIdPath,
    createJsonRoute(
      "Unable to update the sector.",
      async (context) =>
        updateSector(
          getNumericRouteParam(context, "sectorId"),
          await readJsonBodyAs<SectorMutationInput>(context),
        ),
    ),
  );
  apiApp.delete(
    sectorByIdPath,
    createNoContentRoute(
      "Unable to delete the sector.",
      (context) => deleteSector(getNumericRouteParam(context, "sectorId")),
    ),
  );
}
