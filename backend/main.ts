// api_oak.ts
import { Application, Router, Context } from "jsr:@oak/oak";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();

// routes
router.get("/", (ctx: Context) => {
  ctx.response.body = "API IT Map est en ligne 🟢";
});

router.get("/api/map", async (ctx: Context) => {
  try {
    const image = await Deno.readFile("../assets/map.png");
    
    ctx.response.headers.set("Content-Type", "image/png");
    ctx.response.body = image;
  } catch (error) {
    console.error("Erreur lecture image:", error);
    ctx.response.status = 404;
    // En cas d'erreur, renvoyer du JSON
    ctx.response.body = { error: "Image introuvable", details: String(error) };
  }
});

const app = new Application();

app.use(oakCors());

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Serveur lancé sur http://localhost:8000");

await app.listen({ port: 8000 });