import type { MapZone, RectangleBounds } from "../../../types/layout";

export function buildInitialZones(zones: MapZone[]): MapZone[] {
  return zones.map((zone) => ({
    ...zone,
    bounds: { ...zone.bounds },
    pcs: [],
  }));
}

export function generateSuggestedZoneId(zones: MapZone[]): number {
  const highestZoneId = zones.reduce(
    (currentMax, zone) => Math.max(currentMax, zone.id),
    0,
  );

  return Math.ceil((highestZoneId + 1) / 10) * 10;
}

export function isZoneIdUnique(zones: MapZone[], zoneId: number): boolean {
  return zones.every((zone) => zone.id !== zoneId);
}

export function doesZoneOverlap(
  zones: MapZone[],
  candidateBounds: RectangleBounds,
): boolean {
  return zones.some((zone) =>
    rectanglesOverlap(zone.bounds, candidateBounds),
  );
}

export function sortZonesById(zones: MapZone[]): MapZone[] {
  return [...zones].sort((firstZone, secondZone) => firstZone.id - secondZone.id);
}

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
