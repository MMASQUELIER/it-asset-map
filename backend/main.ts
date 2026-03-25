import { Hono } from "hono";
import { cors } from "hono/cors";

/** Port used by the local Deno API. */
const SERVER_PORT = 8000;
/** Absolute URL to the static plant map image served by the API. */
const mapImagePath = new URL("../assets/map.png", import.meta.url);
/** Main HTTP application serving the map image and health endpoint. */
const app = new Hono();

app.use("*", cors());

/**
 * Returns a simple health response used to confirm the API is reachable.
 *
 * @returns Plain text confirmation message.
 */
app.get("/", (c) => {
  return c.text("API IT Map est en ligne.");
});

/**
 * Serves the map image consumed by the frontend overlay.
 *
 * @returns PNG image response or a JSON 404 payload when the file is missing.
 */
app.get("/api/map", async (c) => {
  try {
    const image = await Deno.readFile(mapImagePath);

    return new Response(image, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Erreur lecture image:", error);
    return c.json(
      { error: "Image introuvable", details: String(error) },
      404,
    );
  }
});

console.log(`Serveur Hono lance sur http://localhost:${SERVER_PORT}`);
Deno.serve({ port: SERVER_PORT }, app.fetch);
