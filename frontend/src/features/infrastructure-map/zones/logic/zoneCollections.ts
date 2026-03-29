import type { MapZone, RectangleBounds, StaticMapZone } from "../../shared/types";

/**
 * Clones the seeded zones into pure interactive zones. Static `pcs` stay in
 * the seed dataset while live markers are managed separately.
 *
 * @param zones Seed zones from the static dataset.
 * @returns Zones ready to be stored in interactive state.
 */
export function buildInitialZones(zones: StaticMapZone[]): MapZone[] {
  return zones.map((zone) => ({
    id: zone.id,
    color: zone.color,
    bounds: { ...zone.bounds },
  }));
}

/**
 * Generates the next zone identifier rounded to the next ten.
 *
 * @param zones Existing zones.
 * @returns Suggested identifier for a new zone.
 */
export function generateSuggestedZoneId(zones: MapZone[]): number {
  const highestZoneId = zones.reduce(
    (currentMax, zone) => Math.max(currentMax, zone.id),
    0,
  );

  return Math.ceil((highestZoneId + 1) / 10) * 10;
}

/**
 * Checks that a zone identifier is not already used.
 *
 * @param zones Existing zones.
 * @param zoneId Candidate identifier.
 * @returns `true` when the identifier is available.
 */
export function isZoneIdUnique(zones: MapZone[], zoneId: number): boolean {
  return zones.every((zone) => zone.id !== zoneId);
}

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
  return zones.some((zone) =>
    rectanglesOverlap(zone.bounds, candidateBounds),
  );
}

/**
 * Returns a new zone array ordered by ascending identifier.
 *
 * @param zones Zones to sort.
 * @returns Sorted copy of the zone list.
 */
export function sortZonesById(zones: MapZone[]): MapZone[] {
  return [...zones].sort((firstZone, secondZone) => firstZone.id - secondZone.id);
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
