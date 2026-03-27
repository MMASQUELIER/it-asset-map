import { Hono } from "hono";
import { cors } from "hono/cors";
import * as mod from "jsr:@mirror/xlsx";
import { fileURLToPath } from "node:url";

const SERVER_PORT = 8000;

const mapImagePath = new URL("../assets/map.png", import.meta.url);

const excelUrl = new URL("./data/data.xlsm", import.meta.url);
const excelPath = fileURLToPath(excelUrl);  // ✅ correct pour Windows

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => c.text("API IT Map est en ligne."));

app.get("/api/assets", async (c) => {
  try {
    console.log("Excel path:", excelPath);

    const workbook = mod.read(await Deno.readFile(excelPath), { type: "buffer" });
    const sheet = workbook.Sheets["Asset"];
    if (!sheet) return c.json({ error: "Onglet 'Asset' introuvable" }, 404);

    const data = mod.utils.sheet_to_json(sheet, { defval: "" });
    return c.json(data);

  } catch (err) {
    console.error("Erreur Excel :", err);
    return c.json({ error: "Impossible de lire le fichier Excel" }, 500);
  }
});

console.log(`Serveur Hono lancé sur http://localhost:${SERVER_PORT}`);
Deno.serve({ port: SERVER_PORT }, app.fetch);