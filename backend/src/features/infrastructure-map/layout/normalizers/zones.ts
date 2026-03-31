import type { StoredMapZone } from "@/features/infrastructure-map/layout/types.ts";
import { InvalidMapLayoutError } from "@/features/infrastructure-map/layout/errors.ts";
import {
  isRecord,
  readFiniteNumber,
  readPositiveInteger,
  readPositiveNumber,
  readRequiredString,
} from "@/features/infrastructure-map/layout/normalizers/primitives.ts";

export function normalizeStoredZones(value: unknown): StoredMapZone[] {
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
