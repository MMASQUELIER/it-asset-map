import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  StaticMapImage,
  ZoneDraft,
} from "../shared/types";
import {
  createDefaultMarkerTechnicalDetails,
  isMarkerIdUnique,
} from "../markers/logic/interactiveMarkers";
import {
  clampZoneBounds,
  createBoundsFromDragPoints,
  createZoneDraft,
  doesZoneOverlap,
  hasMinimumZoneDimensions,
  isZoneIdUnique,
  MIN_ZONE_DIMENSION,
} from "../zones/logic/interactiveZones";

/** Result of a marker draft validation. */
interface MarkerDraftSaveResult {
  error: string | null;
  marker: InteractiveMarker | null;
}

/** Input used to update a zone draft while the user is dragging. */
interface ZoneDraftPreviewOptions {
  currentDraft: ZoneDraft | null;
  pendingZoneId: string;
  zones: MapZone[];
  mapImage: StaticMapImage;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

/** Result of a zone draft preview refresh. */
interface ZoneDraftPreviewResult {
  draft: ZoneDraft;
  nextPendingZoneId: string | null;
}

/** Result of a zone draft validation. */
interface ZoneDraftSaveResult {
  error: string | null;
  zone: MapZone | null;
}

/**
 * Builds the current zone draft rectangle from drag coordinates.
 *
 * @param options Dragging context and current draft state.
 * @returns Updated draft and the optional suggested identifier to show.
 */
export function buildZoneDraftPreview({
  currentDraft,
  pendingZoneId,
  zones,
  mapImage,
  startX,
  startY,
  currentX,
  currentY,
}: ZoneDraftPreviewOptions): ZoneDraftPreviewResult {
  const nextBounds = createBoundsFromDragPoints(
    mapImage,
    startX,
    startY,
    currentX,
    currentY,
  );

  if (currentDraft !== null) {
    return {
      draft: {
        ...currentDraft,
        bounds: nextBounds,
      },
      nextPendingZoneId: null,
    };
  }

  const nextDraft = createZoneDraft(mapImage, zones, startX, startY);

  return {
    draft: {
      ...nextDraft,
      bounds: nextBounds,
    },
    nextPendingZoneId:
      pendingZoneId.length === 0 ? String(nextDraft.suggestedId) : null,
  };
}

/**
 * Validates a marker draft and builds the final interactive marker when valid.
 *
 * @param pendingMarkerDraft Draft being confirmed.
 * @param pendingMarkerId Identifier entered by the user.
 * @param markers Existing markers.
 * @returns Either a validation error or the marker ready to insert.
 */
export function validateMarkerDraftSave(
  pendingMarkerDraft: MarkerDraft | null,
  pendingMarkerId: string,
  markers: InteractiveMarker[],
): MarkerDraftSaveResult {
  if (pendingMarkerDraft === null) {
    return {
      error: null,
      marker: null,
    };
  }

  const nextMarkerId = pendingMarkerId.trim();

  if (nextMarkerId.length === 0) {
    return {
      error: "L'identifiant du marqueur est obligatoire.",
      marker: null,
    };
  }

  if (!isMarkerIdUnique(markers, nextMarkerId)) {
    return {
      error: "Cet identifiant existe deja dans la session.",
      marker: null,
    };
  }

  return {
    error: null,
    marker: {
      id: nextMarkerId,
      x: pendingMarkerDraft.x,
      y: pendingMarkerDraft.y,
      technicalDetails: createDefaultMarkerTechnicalDetails(
        nextMarkerId,
        pendingMarkerDraft.zoneId,
      ),
      zoneId: pendingMarkerDraft.zoneId,
    },
  };
}

/**
 * Validates a zone draft and builds the final interactive zone when valid.
 *
 * @param pendingZoneDraft Draft being confirmed.
 * @param pendingZoneId Identifier entered by the user.
 * @param zones Existing zones.
 * @param mapImage Current map image metadata.
 * @returns Either a validation error or the zone ready to insert.
 */
export function validateZoneDraftSave(
  pendingZoneDraft: ZoneDraft | null,
  pendingZoneId: string,
  zones: MapZone[],
  mapImage: StaticMapImage,
): ZoneDraftSaveResult {
  if (pendingZoneDraft === null) {
    return {
      error: null,
      zone: null,
    };
  }

  const nextZoneId = Number(pendingZoneId);

  if (!Number.isInteger(nextZoneId) || nextZoneId <= 0) {
    return {
      error: "L'identifiant de zone doit etre un nombre entier positif.",
      zone: null,
    };
  }

  if (!isZoneIdUnique(zones, nextZoneId)) {
    return {
      error: "Cet identifiant de zone existe deja.",
      zone: null,
    };
  }

  if (!hasMinimumZoneDimensions(pendingZoneDraft.bounds)) {
    return {
      error: `La zone doit faire au moins ${MIN_ZONE_DIMENSION} x ${MIN_ZONE_DIMENSION} pixels.`,
      zone: null,
    };
  }

  const nextBounds = clampZoneBounds(pendingZoneDraft.bounds, mapImage);

  if (doesZoneOverlap(zones, nextBounds)) {
    return {
      error: "La nouvelle zone chevauche une zone existante.",
      zone: null,
    };
  }

  return {
    error: null,
    zone: {
      id: nextZoneId,
      color: pendingZoneDraft.color,
      bounds: nextBounds,
    },
  };
}
