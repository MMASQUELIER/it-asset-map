import type {
  MapZone,
  RectangleBounds,
} from "@/features/infrastructure-map/model/types";

export function doesZoneOverlap(
  zones: MapZone[],
  candidateBounds: RectangleBounds,
): boolean {
  return zones.some((zone) => rectanglesOverlap(zone.bounds, candidateBounds));
}

export function sortZonesById(zones: MapZone[]): MapZone[] {
  return [...zones].sort((firstZone, secondZone) =>
    firstZone.id - secondZone.id
  );
}

export function findZoneById(
  zones: MapZone[],
  zoneId: number | null,
): MapZone | null {
  if (zoneId === null) {
    return null;
  }

  return zones.find((zone) => zone.id === zoneId) ?? null;
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
