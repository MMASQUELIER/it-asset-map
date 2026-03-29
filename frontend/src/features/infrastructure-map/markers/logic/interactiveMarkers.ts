import type {
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
  MarkerDraft,
  PlacementPcCandidate,
  RectangleBounds,
  StoredMarkerPlacement,
} from "../../shared/types";
import { syncPcTechnicalDetailsWithZone } from "../../pc-details/logic/pcTechnicalDetails";

/**
 * Rebuilds interactive markers from the persisted JSON layout and the Excel catalog.
 *
 * @param markerPlacements Persisted marker positions.
 * @param placementPcCandidates Placement candidates loaded from the backend.
 * @param zones Interactive zones currently loaded on the map.
 * @returns Marker list reconstructed from persisted positions.
 */
export function hydratePlacedMarkers(
  markerPlacements: StoredMarkerPlacement[],
  placementPcCandidates: PlacementPcCandidate[],
  zones: MapZone[],
): InteractiveMarker[] {
  const zoneById = new Map(zones.map((zone) => [zone.id, zone]));
  const candidateByMarkerId = new Map(
    placementPcCandidates.map((candidate) => [candidate.markerId, candidate]),
  );

  return markerPlacements.flatMap((markerPlacement) => {
    const placementCandidate = candidateByMarkerId.get(
      markerPlacement.markerId,
    );

    if (placementCandidate === undefined) {
      console.warn(
        `Le PC ${markerPlacement.markerId} n'existe plus dans le catalogue Excel et ne peut pas etre recharge.`,
      );
      return [];
    }

    const assignedZone = markerPlacement.zoneId === null
      ? null
      : (zoneById.get(markerPlacement.zoneId) ?? null);
    const resolvedZone = assignedZone !== null &&
        doesPlacementCandidateMatchZoneSector(placementCandidate, assignedZone)
      ? assignedZone
      : null;

    return [{
      id: placementCandidate.markerId,
      x: Math.round(markerPlacement.x),
      y: Math.round(markerPlacement.y),
      zoneId: resolvedZone?.id ?? null,
      technicalDetails: syncPcTechnicalDetailsWithZone(
        placementCandidate.technicalDetails,
        resolvedZone,
      ),
    }];
  });
}

/**
 * Converts interactive markers to their persisted JSON representation.
 *
 * @param markers Interactive markers currently displayed on the map.
 * @returns Persistable marker positions.
 */
export function serializeMarkerPlacements(
  markers: InteractiveMarker[],
): StoredMarkerPlacement[] {
  return markers.map((marker) => ({
    markerId: marker.id,
    x: marker.x,
    y: marker.y,
    zoneId: marker.zoneId,
  }));
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
  return findContainingZone(availableZones, x, y)?.id ?? null;
}

/**
 * Finds the zone containing a given point.
 *
 * @param availableZones Zones to inspect.
 * @param x X coordinate in image space.
 * @param y Y coordinate in image space.
 * @returns Containing zone or `null` when the point is outside all zones.
 */
export function findContainingZone(
  availableZones: MapZone[],
  x: number,
  y: number,
): MapZone | null {
  const containingZone = availableZones.find(({ bounds }) => {
    const isInsideX = x >= bounds.x && x <= bounds.x + bounds.width;
    const isInsideY = y >= bounds.y && y <= bounds.y + bounds.height;

    return isInsideX && isInsideY;
  });

  return containingZone ?? null;
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

  return `${markerIdPrefix}-${
    String(highestExistingIndex + 1).padStart(2, "0")
  }`;
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
  zone: MapZone,
  bounds: RectangleBounds,
): InteractiveMarker[] {
  return markers.map((marker) =>
    isPointWithinBounds(marker.x, marker.y, bounds) &&
      isMarkerCompatibleWithZone(marker, zone)
      ? {
        ...marker,
        zoneId: zone.id,
        technicalDetails: syncPcTechnicalDetailsWithZone(
          marker.technicalDetails,
          zone,
        ),
      }
      : marker
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
  zone: MapZone,
  bounds: RectangleBounds,
): InteractiveMarker[] {
  return markers.map((marker) => {
    const isInsideZoneBounds = isPointWithinBounds(marker.x, marker.y, bounds);
    const isCompatibleWithZone = isMarkerCompatibleWithZone(marker, zone);

    if (isInsideZoneBounds && isCompatibleWithZone) {
      return {
        ...marker,
        zoneId: zone.id,
        technicalDetails: syncPcTechnicalDetailsWithZone(
          marker.technicalDetails,
          zone,
        ),
      };
    }

    if (marker.zoneId === zone.id) {
      return {
        ...marker,
        zoneId: null,
        technicalDetails: syncPcTechnicalDetailsWithZone(
          marker.technicalDetails,
          null,
        ),
      };
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
  image: MapImageDimensions,
): InteractiveMarker[] {
  const nextX = clampMarkerCoordinate(x, image.width);
  const nextY = clampMarkerCoordinate(y, image.height);
  const nextZone = findContainingZone(availableZones, nextX, nextY);

  return existingMarkers.map((marker) =>
    marker.id === markerId
      ? {
        ...marker,
        x: nextX,
        y: nextY,
        zoneId:
          nextZone !== null && isMarkerCompatibleWithZone(marker, nextZone)
            ? nextZone.id
            : null,
        technicalDetails: syncPcTechnicalDetailsWithZone(
          marker.technicalDetails,
          nextZone !== null && isMarkerCompatibleWithZone(marker, nextZone)
            ? nextZone
            : null,
        ),
      }
      : marker
  );
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

function isMarkerCompatibleWithZone(
  marker: InteractiveMarker,
  zone: MapZone,
): boolean {
  const markerSector = normalizeSectorName(
    marker.technicalDetails.floorLocation ?? marker.technicalDetails.sector,
  );
  const zoneSector = normalizeSectorName(zone.sector);

  return markerSector.length === 0 || zoneSector.length === 0 ||
    markerSector === zoneSector;
}

function normalizeSectorName(value: string | undefined): string {
  return value?.trim().toUpperCase() ?? "";
}

function doesPlacementCandidateMatchZoneSector(
  candidate: PlacementPcCandidate,
  zone: MapZone,
): boolean {
  return normalizeSectorName(candidate.sector) ===
    normalizeSectorName(zone.sector);
}
