/**
 * @file layout.service.ts
 * @brief Lecture et ecriture du layout JSON de la carte.
 */

import { dirname } from "@std/path";

/**
 * @brief Dimensions de l'image de fond de la carte.
 */
export interface MapImageDimensions {
  width: number;
  height: number;
}

/**
 * @brief Zone persistante stockee dans le fichier JSON.
 */
export interface StoredMapZone {
  id: number;
  sector: string;
  prodsched: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * @brief Position persistante d'un PC sur la carte.
 */
export interface StoredMarkerPlacement {
  markerId: string;
  x: number;
  y: number;
  zoneId: number | null;
}

/**
 * @brief Structure complete du fichier JSON de layout.
 */
export interface MapLayoutData {
  mapImage: MapImageDimensions;
  zones: StoredMapZone[];
  markerPlacements: StoredMarkerPlacement[];
}

/**
 * @brief Erreur levee quand le fichier JSON de layout est invalide.
 */
export class InvalidMapLayoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMapLayoutError";
  }
}

/**
 * @brief Cree un layout vide pour initialiser un nouveau fichier JSON.
 * @param mapImage Dimensions de l'image de fond.
 * @returns Layout vide mais valide.
 */
export function createEmptyMapLayout(
  mapImage: MapImageDimensions,
): MapLayoutData {
  return {
    mapImage,
    zones: [],
    markerPlacements: [],
  };
}

/**
 * @brief Lit le fichier JSON de layout et le valide.
 * @param layoutFilePath Chemin absolu du fichier JSON.
 * @param fallbackMapImage Dimensions utilisees si le fichier doit etre cree.
 * @returns Layout valide pret a etre servi par l'API.
 */
export async function readMapLayoutFile(
  layoutFilePath: string,
  fallbackMapImage: MapImageDimensions,
): Promise<MapLayoutData> {
  await ensureLayoutFileExists(layoutFilePath, fallbackMapImage);

  const rawLayoutContent = await Deno.readTextFile(layoutFilePath);
  const parsedLayout = JSON.parse(rawLayoutContent) as unknown;

  return normalizeMapLayoutData(parsedLayout, fallbackMapImage);
}

/**
 * @brief Ecrit un layout valide dans le fichier JSON.
 * @param layoutFilePath Chemin absolu du fichier JSON.
 * @param layoutData Layout a persister.
 */
export async function writeMapLayoutFile(
  layoutFilePath: string,
  layoutData: MapLayoutData,
): Promise<void> {
  const normalizedLayout = normalizeMapLayoutData(layoutData);

  await Deno.mkdir(dirname(layoutFilePath), { recursive: true });
  await Deno.writeTextFile(
    layoutFilePath,
    `${JSON.stringify(normalizedLayout, null, 2)}\n`,
  );
}

async function ensureLayoutFileExists(
  layoutFilePath: string,
  fallbackMapImage: MapImageDimensions,
): Promise<void> {
  try {
    await Deno.stat(layoutFilePath);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }

    await writeMapLayoutFile(
      layoutFilePath,
      createEmptyMapLayout(fallbackMapImage),
    );
  }
}

function normalizeMapLayoutData(
  value: unknown,
  fallbackMapImage?: MapImageDimensions,
): MapLayoutData {
  if (!isRecord(value)) {
    throw new InvalidMapLayoutError("Le layout JSON doit etre un objet.");
  }

  const mapImage = normalizeMapImageDimensions(
    value.mapImage,
    fallbackMapImage,
  );
  const zones = normalizeStoredZones(value.zones);
  const markerPlacements = normalizeMarkerPlacements(value.markerPlacements);

  ensureUniqueZoneIds(zones);
  ensureUniqueMarkerIds(markerPlacements);

  return {
    mapImage,
    zones,
    markerPlacements,
  };
}

function normalizeMapImageDimensions(
  value: unknown,
  fallbackValue?: MapImageDimensions,
): MapImageDimensions {
  if (!isRecord(value)) {
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }

    throw new InvalidMapLayoutError(
      "La section mapImage est obligatoire dans le layout JSON.",
    );
  }

  return {
    width: readPositiveNumber(value.width, "mapImage.width"),
    height: readPositiveNumber(value.height, "mapImage.height"),
  };
}

function normalizeStoredZones(value: unknown): StoredMapZone[] {
  if (!Array.isArray(value)) {
    throw new InvalidMapLayoutError("La section zones doit etre un tableau.");
  }

  return value.map((zone, zoneIndex) => normalizeStoredZone(zone, zoneIndex));
}

function normalizeStoredZone(value: unknown, zoneIndex: number): StoredMapZone {
  if (!isRecord(value)) {
    throw new InvalidMapLayoutError(
      `La zone #${zoneIndex + 1} doit etre un objet.`,
    );
  }

  return {
    id: readPositiveInteger(value.id, `zones[${zoneIndex}].id`),
    sector: readRequiredString(value.sector, `zones[${zoneIndex}].sector`),
    prodsched: readRequiredString(
      value.prodsched,
      `zones[${zoneIndex}].prodsched`,
    ),
    bounds: normalizeRectangleBounds(
      value.bounds,
      `zones[${zoneIndex}].bounds`,
    ),
  };
}

function normalizeRectangleBounds(
  value: unknown,
  fieldPath: string,
): StoredMapZone["bounds"] {
  if (!isRecord(value)) {
    throw new InvalidMapLayoutError(`${fieldPath} doit etre un objet.`);
  }

  return {
    x: readFiniteNumber(value.x, `${fieldPath}.x`),
    y: readFiniteNumber(value.y, `${fieldPath}.y`),
    width: readPositiveNumber(value.width, `${fieldPath}.width`),
    height: readPositiveNumber(value.height, `${fieldPath}.height`),
  };
}

function normalizeMarkerPlacements(value: unknown): StoredMarkerPlacement[] {
  if (!Array.isArray(value)) {
    throw new InvalidMapLayoutError(
      "La section markerPlacements doit etre un tableau.",
    );
  }

  return value.map((placement, placementIndex) =>
    normalizeMarkerPlacement(placement, placementIndex)
  );
}

function normalizeMarkerPlacement(
  value: unknown,
  placementIndex: number,
): StoredMarkerPlacement {
  if (!isRecord(value)) {
    throw new InvalidMapLayoutError(
      `Le placement #${placementIndex + 1} doit etre un objet.`,
    );
  }

  return {
    markerId: readRequiredString(
      value.markerId,
      `markerPlacements[${placementIndex}].markerId`,
    ),
    x: readFiniteNumber(value.x, `markerPlacements[${placementIndex}].x`),
    y: readFiniteNumber(value.y, `markerPlacements[${placementIndex}].y`),
    zoneId: readNullablePositiveInteger(
      value.zoneId,
      `markerPlacements[${placementIndex}].zoneId`,
    ),
  };
}

function ensureUniqueZoneIds(zones: StoredMapZone[]): void {
  const usedZoneIds = new Set<number>();

  for (const zone of zones) {
    if (usedZoneIds.has(zone.id)) {
      throw new InvalidMapLayoutError(
        `L'identifiant de zone ${zone.id} est present plusieurs fois.`,
      );
    }

    usedZoneIds.add(zone.id);
  }
}

function ensureUniqueMarkerIds(
  markerPlacements: StoredMarkerPlacement[],
): void {
  const usedMarkerIds = new Set<string>();

  for (const markerPlacement of markerPlacements) {
    if (usedMarkerIds.has(markerPlacement.markerId)) {
      throw new InvalidMapLayoutError(
        `Le PC ${markerPlacement.markerId} est present plusieurs fois dans le layout.`,
      );
    }

    usedMarkerIds.add(markerPlacement.markerId);
  }
}

function readRequiredString(value: unknown, fieldPath: string): string {
  const normalizedValue = String(value ?? "").trim();

  if (normalizedValue.length === 0) {
    throw new InvalidMapLayoutError(`${fieldPath} est obligatoire.`);
  }

  return normalizedValue;
}

function readFiniteNumber(value: unknown, fieldPath: string): number {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new InvalidMapLayoutError(`${fieldPath} doit etre un nombre valide.`);
  }

  return parsedValue;
}

function readPositiveNumber(value: unknown, fieldPath: string): number {
  const parsedValue = readFiniteNumber(value, fieldPath);

  if (parsedValue <= 0) {
    throw new InvalidMapLayoutError(
      `${fieldPath} doit etre strictement positif.`,
    );
  }

  return parsedValue;
}

function readPositiveInteger(value: unknown, fieldPath: string): number {
  const parsedValue = readPositiveNumber(value, fieldPath);

  if (!Number.isInteger(parsedValue)) {
    throw new InvalidMapLayoutError(`${fieldPath} doit etre un entier.`);
  }

  return parsedValue;
}

function readNullablePositiveInteger(
  value: unknown,
  fieldPath: string,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return readPositiveInteger(value, fieldPath);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
