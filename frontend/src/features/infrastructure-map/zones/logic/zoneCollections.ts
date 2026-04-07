import type {
  MapZone,
  RectangleBounds,
} from "@/features/infrastructure-map/model/types";

/**
 * Detects whether a candidate zone overlaps any existing zone.
 *
 * @param zones Existing zones to compare against.
 * @param candidateBounds Candidate rectangle.
 * @returns `true` when the new rectangle overlaps another zone.
 */
export function doesZoneOverlap(
  zones: MapZone[],
  candidateBounds: RectangleBounds,
): boolean {
  return zones.some((zone) => rectanglesOverlap(zone.bounds, candidateBounds));
}

/**
 * Returns a new zone array ordered by ascending identifier.
 *
 * @param zones Zones to sort.
 * @returns Sorted copy of the zone list.
 */
export function sortZonesById(zones: MapZone[]): MapZone[] {
  return [...zones].sort((firstZone, secondZone) =>
    firstZone.id - secondZone.id
  );
}

/**
 * Resolves a zone from its identifier.
 *
 * @param zones Zone list to scan.
 * @param zoneId Identifier to match.
 * @returns Matching zone or `null` when not found.
 */
export function findZoneById(
  zones: MapZone[],
  zoneId: number | null,
): MapZone | null {
  if (zoneId === null) {
    return null;
  }

  return zones.find((zone) => zone.id === zoneId) ?? null;
}

/**
 * Determines whether two rectangles share any overlapping area.
 *
 * @param firstBounds First rectangle.
 * @param secondBounds Second rectangle.
 * @returns `true` when the rectangles overlap.
 */
function rectanglesOverlap(
  firstBounds: RectangleBounds,
  secondBounds: RectangleBounds,
): boolean {
  const firstRight = firstBounds.x + firstBounds.width;
  const firstBottom = firstBounds.y + firstBounds.height;
  const secondRight = secondBounds.x + secondBounds.width;
  const secondBottom = secondBounds.y + secondBounds.height;

  return (
    firstBounds.x < secondRight &&
    firstRight > secondBounds.x &&
    firstBounds.y < secondBottom &&
    firstBottom > secondBounds.y
  );
}
