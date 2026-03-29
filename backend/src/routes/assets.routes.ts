/**
 * @file assets.routes.ts
 * @brief Declaration des routes HTTP liees aux assets.
 */

import type { Context, Hono } from "hono";
import { backendConfig } from "../config/env.ts";
import {
  ExcelSheetNotFoundError,
  filterAssetsBySector,
  readAssetsFromExcelFile,
} from "../services/assets.service.ts";

/**
 * @brief Enregistre les routes HTTP des assets.
 * @param apiApp Application Hono cible.
 */
export function registerAssetRoutes(apiApp: Hono) {
  apiApp.get("/assets", handleGetAssets);
  apiApp.get("/api/assets", handleGetAssets);
}

/**
 * @brief Retourne les assets extraits du fichier Excel.
 * @param context Contexte HTTP Hono de la requete.
 * @returns Reponse JSON de succes ou d'erreur.
 */
async function handleGetAssets(context: Context) {
  try {
    const assets = await readAssetsFromExcelFile(
      backendConfig.excelFilePath,
      backendConfig.excelAssetSheetName,
    );
    const filteredAssets = filterAssetsBySector(
      assets,
      backendConfig.assetSectorColumnName,
      backendConfig.sectors,
    );

    return context.json(filteredAssets);
  } catch (error) {
    if (error instanceof ExcelSheetNotFoundError) {
      return context.json({ error: error.message }, 404);
    }

    console.error("Erreur Excel :", error);
    return context.json({ error: "Impossible de lire le fichier Excel" }, 500);
  }
}
