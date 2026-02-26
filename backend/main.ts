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

router.get("/api/zones", async (ctx: Context) => {
  try {
    const zonesFile = await Deno.readTextFile("./data/zonesData.json");
    const pointsFile = await Deno.readTextFile("./data/pcPointsData.json");

    const zonesData = JSON.parse(zonesFile);
    const pointsData = JSON.parse(pointsFile);

    const pointsByZone = new Map<string, unknown[]>();

    for (const point of pointsData.points ?? []) {
      const zoneCode = point.zoneCode;
      const current = pointsByZone.get(zoneCode) ?? [];
      current.push(point);
      pointsByZone.set(zoneCode, current);
    }

    const zonesWithPcs = (zonesData.zones ?? []).map((zone: { code: string }) => ({
      ...zone,
      pcs: pointsByZone.get(zone.code) ?? [],
    }));

    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
      ...zonesData,
      zones: zonesWithPcs,
    };
  } catch (error) {
    console.error("Erreur lecture zones:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Impossible de lire les zones", details: String(error) };
  }
});

router.get("/api/points", async (ctx: Context) => {
  try {
    const pointsData = await Deno.readTextFile("./data/pcPointsData.json");
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = pointsData;
  } catch (error) {
    console.error("Erreur lecture points:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Impossible de lire les points", details: String(error) };
  }
});

const app = new Application();

app.use(oakCors());

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Serveur lancé sur http://localhost:8000");

await app.listen({ port: 8000 });
