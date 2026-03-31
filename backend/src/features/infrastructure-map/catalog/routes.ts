import type { Context, Hono } from "hono";
import { backendConfig } from "@/config/env.ts";
import { ExcelSheetNotFoundError, readAssetsFromExcelFile } from "@/features/infrastructure-map/catalog/repository.ts";
import { buildInfrastructureCatalog } from "@/features/infrastructure-map/catalog/service.ts";

export function registerCatalogRoutes(apiApp: Hono): void {
  apiApp.get("/api/catalog", handleGetCatalog);
}

async function handleGetCatalog(context: Context) {
  try {
    const assets = await readAssetsFromExcelFile(
      backendConfig.excelFilePath,
      backendConfig.excelAssetSheetName,
    );

    return context.json(
      buildInfrastructureCatalog(assets, backendConfig.assetSectorColumnName),
    );
  } catch (error) {
    if (error instanceof ExcelSheetNotFoundError) {
      return context.json({ error: error.message }, 404);
    }

    return context.json(
      { error: "Impossible de charger le catalogue infrastructure." },
      500,
    );
  }
}
