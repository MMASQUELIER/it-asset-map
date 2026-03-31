import type {
  MapZone,
  RectangleBounds,
  StoredMapZone,
} from "@/features/infrastructure-map/model/types";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

/**
 * Converts persisted backend zones into interactive zones enriched for the UI.
 *
 * @param zones Zones loaded from the backend JSON layout.
 * @returns Zones ready to be stored in interactive state.
 */
export function hydrateMapZones(zones: StoredMapZone[]): MapZone[] {
  return zones.map((zone) => ({
    id: zone.id,
    label: zone.prodsched,
    sector: zone.sector,
    prodsched: zone.prodsched,
    color: getSectorColor(zone.sector),
    bounds: { ...zone.bounds },
  }));
}

/**
 * Converts interactive zones back to their persisted JSON representation.
 *
 * @param zones Interactive zones currently displayed on the map.
 * @returns Persistable zone list.
 */
export function serializeMapZones(zones: MapZone[]): StoredMapZone[] {
  return zones.map((zone) => ({
    id: zone.id,
    sector: zone.sector,
    prodsched: zone.prodsched,
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
