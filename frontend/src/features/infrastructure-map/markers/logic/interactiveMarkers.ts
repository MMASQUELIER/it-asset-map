import type {
  InteractiveMarker,
  MapZone,
  StaticMapZone,
  MarkerDraft,
  RectangleBounds,
  StaticMapImage,
} from "../../shared/types";
import { createPcTechnicalDetails } from "../../pc-details/logic/pcTechnicalDetails";

/**
 * Flattens the zone seed data into a dedicated interactive marker collection.
 *
 * @param zones Seed zones containing their initial PCs.
 * @returns Marker list used by the interactive map state.
 */
export function buildInitialMarkers(zones: StaticMapZone[]): InteractiveMarker[] {
  return zones.flatMap((zone) =>
    zone.pcs.map((pc) => ({
      ...pc,
      zoneId: zone.id,
    })),
  );
}

/**
 * Creates the draft displayed when the user clicks to add a marker.
 *
 * @param availableZones Zones currently displayed on the map.
 * @param existingMarkers Existing interactive markers.
 * @param mapX Clicked X coordinate.
 * @param mapY Clicked Y coordinate.
 * @returns Marker draft enriched with a suggested identifier.
 */
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

/**
 * Finds the zone containing a given point.
 *
 * @param availableZones Zones to inspect.
 * @param x X coordinate in image space.
 * @param y Y coordinate in image space.
 * @returns Containing zone identifier or `null` when the point is outside all zones.
 */
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

/**
 * Suggests the next marker identifier based on the current zone.
 *
 * @param existingMarkers Existing interactive markers.
 * @param zoneId Zone containing the marker, if any.
 * @returns Suggested marker identifier.
 */
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

/**
 * Checks whether a marker identifier is valid and available.
 *
 * @param existingMarkers Existing interactive markers.
 * @param candidateId Proposed identifier.
 * @returns `true` when the identifier is unique and non-empty.
 */
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

/**
 * Assigns all markers located inside the given bounds to a zone.
 *
 * @param markers Existing markers.
 * @param zoneId Zone receiving the markers.
 * @param bounds Zone bounds.
 * @returns Updated marker collection.
 */
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

/**
 * Reconciles marker membership after a zone is resized.
 *
 * @param markers Existing markers.
 * @param zoneId Resized zone identifier.
 * @param bounds Updated zone bounds.
 * @returns Updated marker collection.
 */
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

/**
 * Moves a marker while keeping it inside the image and updating its zone.
 *
 * @param existingMarkers Existing markers.
 * @param availableZones Zones currently displayed on the map.
 * @param markerId Marker being moved.
 * @param x Requested X coordinate.
 * @param y Requested Y coordinate.
 * @param image Map image dimensions.
 * @returns Updated marker collection.
 */
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

/**
 * Creates default technical details for a user-created marker.
 *
 * @param markerId Marker identifier.
 * @param zoneId Zone currently containing the marker.
 * @returns Generated technical details.
 */
export function createDefaultMarkerTechnicalDetails(
  markerId: string,
  zoneId: number | null,
): InteractiveMarker["technicalDetails"] {
  return createPcTechnicalDetails(markerId, zoneId);
}

/**
 * Normalises marker identifiers so uniqueness checks are case-insensitive.
 *
 * @param markerId Marker identifier to normalise.
 * @returns Uppercased and trimmed identifier.
 */
function normalizeMarkerId(markerId: string): string {
  return markerId.trim().toUpperCase();
}

/**
 * Escapes a string before building a regular expression from it.
 *
 * @param value Raw string value.
 * @returns Regular-expression-safe string.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Clamps one marker coordinate inside the image.
 *
 * @param value Proposed coordinate.
 * @param maxValue Maximum coordinate allowed on the image.
 * @returns Rounded coordinate constrained to the image.
 */
function clampMarkerCoordinate(value: number, maxValue: number): number {
  return Math.max(0, Math.min(Math.round(value), maxValue));
}

/**
 * Checks whether a point is contained inside rectangle bounds.
 *
 * @param x Point X coordinate.
 * @param y Point Y coordinate.
 * @param bounds Rectangle bounds.
 * @returns `true` when the point is inside the rectangle.
 */
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
