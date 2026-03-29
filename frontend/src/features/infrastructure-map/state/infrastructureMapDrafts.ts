import type {
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
  MarkerDraft,
  PlacementPcCandidate,
  ZoneDraft,
} from "../shared/types";
import { isMarkerIdUnique } from "../markers/logic/interactiveMarkers";
import {
  clampZoneBounds,
  createBoundsFromDragPoints,
  createZoneDraft,
  doesZoneOverlap,
  hasMinimumZoneDimensions,
  isZoneIdUnique,
  MIN_ZONE_DIMENSION,
} from "../zones/logic/interactiveZones";
import { syncPcTechnicalDetailsWithZone } from "../pc-details/logic/pcTechnicalDetails";
import { doesPlacementCandidateMatchSector } from "../markers/logic/backendPlacementCandidates";
import { getSectorColor } from "../zones/logic/zoneAppearance";

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
  mapImage: MapImageDimensions;
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
 * @returns Updated draft and the optional suggested internal identifier.
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
    nextPendingZoneId: pendingZoneId.length === 0
      ? String(nextDraft.suggestedId)
      : null,
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
  zones: MapZone[],
  placementPcCandidates: PlacementPcCandidate[],
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
      error: "La selection d'un PC du catalogue est obligatoire.",
      marker: null,
    };
  }

  const selectedPlacementCandidate =
    placementPcCandidates.find((candidate) =>
      candidate.markerId === nextMarkerId
    ) ?? null;

  if (selectedPlacementCandidate === null) {
    return {
      error: "Le PC selectionne n'existe pas dans le catalogue charge.",
      marker: null,
    };
  }

  if (!isMarkerIdUnique(markers, nextMarkerId)) {
    return {
      error: "Ce PC est deja place sur la carte.",
      marker: null,
    };
  }

  const containingZone = pendingMarkerDraft.zoneId === null
    ? null
    : (zones.find((zone) => zone.id === pendingMarkerDraft.zoneId) ?? null);

  if (
    containingZone !== null &&
    !doesPlacementCandidateMatchSector(
      selectedPlacementCandidate,
      containingZone.sector,
    )
  ) {
    return {
      error: "Ce PC n'appartient pas au secteur de la zone selectionnee.",
      marker: null,
    };
  }

  return {
    error: null,
    marker: {
      id: nextMarkerId,
      x: pendingMarkerDraft.x,
      y: pendingMarkerDraft.y,
      technicalDetails: syncPcTechnicalDetailsWithZone(
        selectedPlacementCandidate.technicalDetails,
        containingZone,
      ),
      zoneId: pendingMarkerDraft.zoneId,
    },
  };
}

/**
 * Validates a zone draft and builds the final interactive zone when valid.
 *
 * @param pendingZoneDraft Draft being confirmed.
 * @param pendingZoneId Internal identifier generated for the new zone.
 * @param zones Existing zones.
 * @param mapImage Current map image metadata.
 * @returns Either a validation error or the zone ready to insert.
 */
export function validateZoneDraftSave(
  pendingZoneDraft: ZoneDraft | null,
  pendingZoneId: string,
  pendingZoneSector: string,
  pendingZoneProdsched: string,
  zones: MapZone[],
  mapImage: MapImageDimensions,
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
      error:
        "Impossible de generer un identifiant interne valide pour la zone.",
      zone: null,
    };
  }

  const nextZoneSector = pendingZoneSector.trim();
  const nextZoneProdsched = pendingZoneProdsched.trim();

  if (nextZoneSector.length === 0) {
    return {
      error: "Le secteur de zone est obligatoire.",
      zone: null,
    };
  }

  if (nextZoneProdsched.length === 0) {
    return {
      error: "Le prodsched de zone est obligatoire.",
      zone: null,
    };
  }

  if (!isZoneIdUnique(zones, nextZoneId)) {
    return {
      error:
        "Impossible d'enregistrer la zone car son identifiant interne existe deja.",
      zone: null,
    };
  }

  if (!hasMinimumZoneDimensions(pendingZoneDraft.bounds)) {
    return {
      error:
        `La zone doit faire au moins ${MIN_ZONE_DIMENSION} x ${MIN_ZONE_DIMENSION} pixels.`,
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
      label: nextZoneProdsched,
      sector: nextZoneSector,
      prodsched: nextZoneProdsched,
      color: getSectorColor(nextZoneSector),
      bounds: nextBounds,
    },
  };
}
