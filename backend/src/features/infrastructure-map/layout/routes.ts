import type { Context, Hono } from "hono";
import { backendConfig } from "@/config/env.ts";
import {
  InvalidMapLayoutError,
  MapLayoutFileNotFoundError,
  readMapLayoutFile,
  writeMapLayoutFile,
} from "@/features/infrastructure-map/layout/service.ts";

export function registerLayoutRoutes(apiApp: Hono): void {
  apiApp.get("/api/layout", handleGetLayout);
  apiApp.put("/api/layout", handlePutLayout);
}

async function handleGetLayout(context: Context) {
  try {
    return context.json(await readMapLayoutFile(backendConfig.layoutFilePath));
  } catch (error) {
    if (error instanceof MapLayoutFileNotFoundError) {
      return context.json({ error: error.message }, 404);
    }

    if (error instanceof InvalidMapLayoutError) {
      return context.json({ error: error.message }, 500);
    }

    return context.json({ error: "Impossible de lire le layout JSON." }, 500);
  }
}

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
        { error: error.message || "Le layout envoye est invalide." },
        400,
      );
    }

    return context.json(
      { error: "Impossible de sauvegarder le layout JSON." },
      500,
    );
  }
}
