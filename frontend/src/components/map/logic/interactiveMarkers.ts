import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  RectangleBounds,
  StaticMapImage,
} from "../../../types/layout";

export function buildInitialMarkers(zones: MapZone[]): InteractiveMarker[] {
  return zones.flatMap((zone) =>
    zone.pcs.map((pc) => ({
      id: pc.id,
      x: pc.x,
      y: pc.y,
      zoneId: zone.id,
    })),
  );
}

export function createMarkerDraft(
  availableZones: MapZone[],
  existingMarkers: InteractiveMarker[],
  mapX: number,
  mapY: number,
): MarkerDraft {
  const roundedMapX = Math.round(mapX);
  const roundedMapY = Math.round(mapY);
  const containingZoneId = findContainingZoneId(
    availableZones,
    roundedMapX,
    roundedMapY,
  );

  return {
    x: roundedMapX,
    y: roundedMapY,
    zoneId: containingZoneId,
    suggestedId: generateSuggestedMarkerId(existingMarkers, containingZoneId),
  };
}

export function findContainingZoneId(
  availableZones: MapZone[],
  x: number,
  y: number,
): number | null {
  const containingZone = availableZones.find(({ bounds }) => {
    const isInsideX = x >= bounds.x && x <= bounds.x + bounds.width;
    const isInsideY = y >= bounds.y && y <= bounds.y + bounds.height;

    return isInsideX && isInsideY;
  });

  return containingZone?.id ?? null;
}

export function generateSuggestedMarkerId(
  existingMarkers: InteractiveMarker[],
  zoneId: number | null,
): string {
  const markerIdPrefix = zoneId === null ? "PC-TEMP" : `PC-${zoneId}`;
  const markerIdIndexPattern = new RegExp(
    `^${escapeRegExp(markerIdPrefix.toUpperCase())}-(\\d+)$`,
  );

  const highestExistingIndex = existingMarkers.reduce((maxIndex, marker) => {
    const match = normalizeMarkerId(marker.id).match(markerIdIndexPattern);

    if (match === null) {
      return maxIndex;
    }

    return Math.max(maxIndex, Number.parseInt(match[1], 10));
  }, 0);

  return `${markerIdPrefix}-${String(highestExistingIndex + 1).padStart(2, "0")}`;
}

export function isMarkerIdUnique(
  existingMarkers: InteractiveMarker[],
  candidateId: string,
): boolean {
  const normalizedCandidateId = normalizeMarkerId(candidateId);

  if (normalizedCandidateId.length === 0) {
    return false;
  }

  return existingMarkers.every(
    (marker) => normalizeMarkerId(marker.id) !== normalizedCandidateId,
  );
}

export function assignMarkersWithinBoundsToZone(
  markers: InteractiveMarker[],
  zoneId: number,
  bounds: RectangleBounds,
): InteractiveMarker[] {
  return markers.map((marker) =>
    isPointWithinBounds(marker.x, marker.y, bounds)
      ? { ...marker, zoneId }
      : marker,
  );
}

export function reconcileMarkersWithZoneBounds(
  markers: InteractiveMarker[],
  zoneId: number,
  bounds: RectangleBounds,
): InteractiveMarker[] {
  return markers.map((marker) => {
    const isInsideZoneBounds = isPointWithinBounds(marker.x, marker.y, bounds);

    if (isInsideZoneBounds) {
      return { ...marker, zoneId };
    }

    if (marker.zoneId === zoneId) {
      return { ...marker, zoneId: null };
    }

    return marker;
  });
}

export function moveMarkerToCoordinates(
  existingMarkers: InteractiveMarker[],
  availableZones: MapZone[],
  markerId: string,
  x: number,
  y: number,
  image: StaticMapImage,
): InteractiveMarker[] {
  const nextX = clampMarkerCoordinate(x, image.width);
  const nextY = clampMarkerCoordinate(y, image.height);
  const nextZoneId = findContainingZoneId(availableZones, nextX, nextY);

  return existingMarkers.map((marker) =>
    marker.id === markerId
      ? {
          ...marker,
          x: nextX,
          y: nextY,
          zoneId: nextZoneId,
        }
      : marker,
  );
}

function normalizeMarkerId(markerId: string): string {
  return markerId.trim().toUpperCase();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clampMarkerCoordinate(value: number, maxValue: number): number {
  return Math.max(0, Math.min(Math.round(value), maxValue));
}

function isPointWithinBounds(
  x: number,
  y: number,
  bounds: RectangleBounds,
): boolean {
  return (
    x >= bounds.x &&
    x <= bounds.x + bounds.width &&
    y >= bounds.y &&
    y <= bounds.y + bounds.height
  );
}
