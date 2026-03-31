import type { MapZone, RectangleBounds } from "@/features/infrastructure-map/model/types";

export function findContainingZoneId(
  availableZones: MapZone[],
  x: number,
  y: number,
): number | null {
  const containingZone = findContainingZone(availableZones, x, y);

  if (containingZone === null) {
    return null;
  }

  return containingZone.id;
}

export function findContainingZone(
  availableZones: MapZone[],
  x: number,
  y: number,
): MapZone | null {
  for (const zone of availableZones) {
    if (isPointWithinBounds(x, y, zone.bounds)) {
      return zone;
    }
  }

  return null;
}

export function clampMarkerCoordinate(value: number, maxValue: number): number {
  const roundedValue = Math.round(value);

  if (roundedValue < 0) {
    return 0;
  }

  if (roundedValue > maxValue) {
    return maxValue;
  }

  return roundedValue;
}

export function isPointWithinBounds(
  x: number,
  y: number,
  bounds: RectangleBounds,
): boolean {
  const maxX = bounds.x + bounds.width;
  const maxY = bounds.y + bounds.height;

  return (
    x >= bounds.x &&
    x <= maxX &&
    y >= bounds.y &&
    y <= maxY
  );
}
