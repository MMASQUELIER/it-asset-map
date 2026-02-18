import { ZonesFile, Zone } from "./types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateZoneFile(data: unknown): ZonesFile {
  if (!isRecord(data) || !("zones" in data)) {
    throw new Error("Structure attendue: { zones: [...] }");
  }

  if (!Array.isArray(data.zones)) {
    throw new Error(`"zones" doit être un tableau`);
  }

  const zones: Zone[] = data.zones.map((zoneSource, index) => {
    if (!isRecord(zoneSource)) {
      throw new Error(`Zone #${index} n'est pas un objet`);
    }

    if (typeof zoneSource.id !== "number") {
      throw new Error(`Zone #${index}: "id" doit être un nombre`);
    }

    if (typeof zoneSource.nom !== "string") {
      throw new Error(`Zone #${index}: "nom" doit être une chaîne`);
    }

    if (
      !Array.isArray(zoneSource.position) ||
      zoneSource.position.length !== 4 ||
      !zoneSource.position.every((value) => typeof value === "number" || typeof value === "string")
    ) {
      throw new Error(
        `Zone #${index}: "position" doit être un tableau [x1, x2, y1, y2]`
      );
    }

    const converted = zoneSource.position.map((value) => Number(value));

    if (converted.some((value) => Number.isNaN(value))) {
      throw new Error(`Zone #${index}: valeurs non numériques dans "position"`);
    }

    const [x1, x2, y1, y2] = converted;

    return {
      id: zoneSource.id,
      nom: zoneSource.nom,
      position: [x1, x2, y1, y2],
    };
  });

  return { zones };
}
