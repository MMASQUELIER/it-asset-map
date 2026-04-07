import type { Context, Hono } from "hono";
import { readJsonBody, getNumericRouteParam, handleRouteError } from "@/features/infrastructure-map/shared/http.ts";
import {
  createSector,
  deleteSector,
  listSectors,
  updateSector,
} from "@/features/infrastructure-map/sectors/service.ts";
import type { SectorMutationInput } from "@/features/infrastructure-map/sectors/types.ts";

export function registerSectorRoutes(apiApp: Hono): void {
  apiApp.get("/api/sectors", handleListSectors);
  apiApp.post("/api/sectors", handleCreateSector);
  apiApp.patch("/api/sectors/:sectorId", handleUpdateSector);
  apiApp.delete("/api/sectors/:sectorId", handleDeleteSector);
}

async function handleListSectors(context: Context) {
  try {
    return context.json(await listSectors());
  } catch (error) {
    return handleRouteError(context, error, "Unable to load sectors.");
  }
}

async function handleCreateSector(context: Context) {
  try {
    const input = await readJsonBody(context) as SectorMutationInput;
    return context.json(await createSector(input), 201);
  } catch (error) {
    return handleRouteError(context, error, "Unable to create the sector.");
  }
}

async function handleUpdateSector(context: Context) {
  try {
    const sectorId = getNumericRouteParam(context, "sectorId");
    const input = await readJsonBody(context) as SectorMutationInput;

    return context.json(await updateSector(sectorId, input));
  } catch (error) {
    return handleRouteError(context, error, "Unable to update the sector.");
  }
}

async function handleDeleteSector(context: Context) {
  try {
    const sectorId = getNumericRouteParam(context, "sectorId");

    await deleteSector(sectorId);
    return context.body(null, 204);
  } catch (error) {
    return handleRouteError(context, error, "Unable to delete the sector.");
  }
}
