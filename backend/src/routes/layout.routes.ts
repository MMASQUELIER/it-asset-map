/**
 * @file layout.routes.ts
 * @brief Declaration des routes HTTP liees au layout JSON de la carte.
 */

import type { Context, Hono } from "hono";
import { backendConfig } from "../config/env.ts";
import {
  InvalidMapLayoutError,
  readMapLayoutFile,
  writeMapLayoutFile,
} from "../services/layout.service.ts";

const DEFAULT_MAP_IMAGE = {
  width: backendConfig.mapImageWidth,
  height: backendConfig.mapImageHeight,
};

/**
 * @brief Enregistre les routes HTTP de lecture et d'ecriture du layout.
 * @param apiApp Application Hono cible.
 */
export function registerLayoutRoutes(apiApp: Hono) {
  apiApp.get("/layout", handleGetLayout);
  apiApp.get("/api/layout", handleGetLayout);
  apiApp.put("/layout", handlePutLayout);
  apiApp.put("/api/layout", handlePutLayout);
}

/**
 * @brief Retourne le layout JSON persiste.
 * @param context Contexte HTTP Hono de la requete.
 * @returns Reponse JSON de succes ou d'erreur.
 */
async function handleGetLayout(context: Context) {
  try {
    const mapLayout = await readMapLayoutFile(
      backendConfig.layoutFilePath,
      DEFAULT_MAP_IMAGE,
    );

    return context.json(mapLayout);
  } catch (error) {
    if (error instanceof InvalidMapLayoutError) {
      return context.json({ error: error.message }, 500);
    }

    console.error("Erreur layout :", error);
    return context.json({ error: "Impossible de lire le layout JSON." }, 500);
  }
}

/**
 * @brief Persiste le layout JSON envoye par le frontend.
 * @param context Contexte HTTP Hono de la requete.
 * @returns Reponse JSON de succes ou d'erreur.
 */
async function handlePutLayout(context: Context) {
  try {
    const nextMapLayout = await context.req.json();

    await writeMapLayoutFile(
      backendConfig.layoutFilePath,
      nextMapLayout,
    );

    return context.json({ success: true });
  } catch (error) {
    if (
      error instanceof InvalidMapLayoutError || error instanceof SyntaxError
    ) {
      return context.json(
        {
          error: error.message || "Le layout envoye est invalide.",
        },
        400,
      );
    }

    console.error("Erreur sauvegarde layout :", error);
    return context.json(
      { error: "Impossible de sauvegarder le layout JSON." },
      500,
    );
  }
}
