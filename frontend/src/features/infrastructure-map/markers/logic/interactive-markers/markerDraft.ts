import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
} from "@/features/infrastructure-map/model/types";
import { findContainingZoneId } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerBounds";
import { generateSuggestedMarkerId } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerIds";

export function createMarkerDraft(
  availableZones: MapZone[],
  existingMarkers: InteractiveMarker[],
  mapX: number,
  mapY: number,
): MarkerDraft {
  const x = Math.round(mapX);
  const y = Math.round(mapY);
  const zoneId = findContainingZoneId(availableZones, x, y);

  return {
    x,
    y,
    zoneId,
    suggestedId: generateSuggestedMarkerId(existingMarkers, zoneId),
  };
}
