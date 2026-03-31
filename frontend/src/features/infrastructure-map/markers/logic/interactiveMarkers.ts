import { assignMarkersWithinBoundsToZone, reconcileMarkersWithZoneBounds } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerAssignments";
import { findContainingZone, findContainingZoneId } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerBounds";
import { createMarkerDraft } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerDraft";
import { generateSuggestedMarkerId, isMarkerIdUnique } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerIds";
import { hydratePlacedMarkers, serializeMarkerPlacements } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerHydration";
import { moveMarkerToCoordinates } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerMovement";

export {
  assignMarkersWithinBoundsToZone,
  createMarkerDraft,
  findContainingZone,
  findContainingZoneId,
  generateSuggestedMarkerId,
  hydratePlacedMarkers,
  isMarkerIdUnique,
  moveMarkerToCoordinates,
  reconcileMarkersWithZoneBounds,
  serializeMarkerPlacements,
};
