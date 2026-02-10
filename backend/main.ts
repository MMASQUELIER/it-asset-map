// api_oak.ts
import { Application, Router, Context } from "jsr:@oak/oak";
// 1. Importer oakCors
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();

router.get("/", (ctx: Context) => {
  ctx.response.body = "API IT Map est en ligne 🟢";
});

router.get("/api/map", async (ctx: Context) => {
  try {
    // 2. Vérifie bien que ce chemin est correct par rapport à l'endroit où tu lances la commande !
    // Si tu lances depuis le dossier du fichier ts, c'est ok.
    const image = await Deno.readFile("../assets/map.png");
    
    ctx.response.headers.set("Content-Type", "image/png");
    ctx.response.body = image;
  } catch (error) {
    console.error("Erreur lecture image:", error);
    ctx.response.status = 404;
    // En cas d'erreur, renvoyer du JSON c'est mieux pour le debug frontend
    ctx.response.body = { error: "Image introuvable", details: String(error) };
  }
});

const app = new Application();

// 3. UTILISER CORS AVANT LES ROUTES
// Cela autorise tout le monde (*) par défaut. 
app.use(oakCors());

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Serveur lancé sur http://localhost:8000");

await app.listen({ port: 8000 });