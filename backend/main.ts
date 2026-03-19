import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { cors } from "https://deno.land/x/hono@v4.3.11/middleware.ts";

const app = new Hono();
const mapImagePath = new URL("../assets/map.png", import.meta.url);

app.use("*", cors());

app.get("/", (c) => {
  return c.text("API IT Map est en ligne.");
});

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

console.log("Serveur Hono lance sur http://localhost:8000");
Deno.serve({ port: 8000 }, app.fetch);
