/**
 * @file map.routes.ts
 * @brief Declaration des routes HTTP liees a la carte.
 */

import type { Context, Hono } from "hono";
import { backendConfig } from "../config/env.ts";
import { readMapFile } from "../services/map.service.ts";

/**
 * @brief Enregistre les routes HTTP de la carte.
 * @param apiApp Application Hono cible.
 */
export function registerMapRoutes(apiApp: Hono) {
  apiApp.get("/map", handleGetMap);
  apiApp.get("/api/map", handleGetMap);
}

/**
 * @brief Retourne l'image PNG de la carte.
 * @param context Contexte HTTP Hono de la requete.
 * @returns Reponse binaire PNG ou reponse JSON d'erreur.
 */
async function handleGetMap(context: Context) {
  try {
    const mapFileBuffer = await readMapFile(backendConfig.mapFilePath);

    return context.body(mapFileBuffer, 200, {
      "Content-Type": "image/png",
    });
  } catch (error) {
    console.error("Erreur map :", error);
    return context.json({ error: "Impossible de charger la carte" }, 500);
  }
}
