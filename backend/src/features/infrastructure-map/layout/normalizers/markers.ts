import type { StoredMarkerPlacement } from "@/features/infrastructure-map/layout/types.ts";
import { InvalidMapLayoutError } from "@/features/infrastructure-map/layout/errors.ts";
import {
  isRecord,
  readFiniteNumber,
  readNullablePositiveInteger,
  readRequiredString,
} from "@/features/infrastructure-map/layout/normalizers/primitives.ts";

export function normalizeMarkerPlacements(
  value: unknown,
): StoredMarkerPlacement[] {
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
      `Le marqueur #${placementIndex + 1} doit etre un objet.`,
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
