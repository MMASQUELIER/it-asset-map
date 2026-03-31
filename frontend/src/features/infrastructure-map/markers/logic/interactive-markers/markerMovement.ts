import type {
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
} from "@/features/infrastructure-map/model/types";
import { syncPcTechnicalDetailsWithZone } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";
import {
  clampMarkerCoordinate,
  findContainingZone,
} from "@/features/infrastructure-map/markers/logic/interactive-markers/markerBounds";
import { isMarkerCompatibleWithZone } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerSectorCompatibility";

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
  const updatedMarkers: InteractiveMarker[] = [];

  for (const marker of existingMarkers) {
    if (marker.id !== markerId) {
      updatedMarkers.push(marker);
      continue;
    }

    const resolvedZone = resolveMarkerZoneAfterMove(marker, nextZone);

    updatedMarkers.push({
      ...marker,
      x: nextX,
      y: nextY,
      zoneId: resolvedZone === null ? null : resolvedZone.id,
      technicalDetails: syncPcTechnicalDetailsWithZone(
        marker.technicalDetails,
        resolvedZone,
      ),
    });
  }

  return updatedMarkers;
}

function resolveMarkerZoneAfterMove(
  marker: InteractiveMarker,
  nextZone: MapZone | null,
): MapZone | null {
  if (nextZone === null) {
    return null;
  }

  if (!isMarkerCompatibleWithZone(marker, nextZone)) {
    return null;
  }

  return nextZone;
}
