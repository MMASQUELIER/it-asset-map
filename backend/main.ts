// api_hono.ts
import { Hono } from "https://deno.land/x/hono/mod.ts";
import { cors } from "https://deno.land/x/hono/middleware.ts";
import { Context } from "node:vm";

const app = new Hono();

// Activer CORS
app.use('*', cors());

// Route principale
app.get("/", (c : Context) => {
  return c.text("API IT Map est en ligne 🟢");
});

// Route pour récupérer l'image
app.get("/api/map", async (c : Context) => {
  try {
    const image = await Deno.readFile("../assets/map.png");

    return new Response(image, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Erreur lecture image:", error);
    return c.json(
      { error: "Image introuvable", details: String(error) },
      404
    );
  }
});

// Lancer le serveur
console.log("Serveur Hono lancé sur http://localhost:8000");
Deno.serve(app.fetch);