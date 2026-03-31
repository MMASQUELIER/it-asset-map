import type {
  InteractiveMarker,
  MapZone,
  RectangleBounds,
} from "@/features/infrastructure-map/model/types";
import { syncPcTechnicalDetailsWithZone } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";
import { isPointWithinBounds } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerBounds";
import { isMarkerCompatibleWithZone } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerSectorCompatibility";

export function assignMarkersWithinBoundsToZone(
  markers: InteractiveMarker[],
  zone: MapZone,
  bounds: RectangleBounds,
): InteractiveMarker[] {
  const updatedMarkers: InteractiveMarker[] = [];

  for (const marker of markers) {
    if (!isPointWithinBounds(marker.x, marker.y, bounds)) {
      updatedMarkers.push(marker);
      continue;
    }

    if (!isMarkerCompatibleWithZone(marker, zone)) {
      updatedMarkers.push(marker);
      continue;
    }

    updatedMarkers.push({
      ...marker,
      zoneId: zone.id,
      technicalDetails: syncPcTechnicalDetailsWithZone(
        marker.technicalDetails,
        zone,
      ),
    });
  }

  return updatedMarkers;
}

export function reconcileMarkersWithZoneBounds(
  markers: InteractiveMarker[],
  zone: MapZone,
  bounds: RectangleBounds,
): InteractiveMarker[] {
  const updatedMarkers: InteractiveMarker[] = [];

  for (const marker of markers) {
    const isInsideZoneBounds = isPointWithinBounds(marker.x, marker.y, bounds);
    const isCompatibleWithZone = isMarkerCompatibleWithZone(marker, zone);

    if (isInsideZoneBounds && isCompatibleWithZone) {
      updatedMarkers.push({
        ...marker,
        zoneId: zone.id,
        technicalDetails: syncPcTechnicalDetailsWithZone(
          marker.technicalDetails,
          zone,
        ),
      });
      continue;
    }

    if (marker.zoneId === zone.id) {
      updatedMarkers.push({
        ...marker,
        zoneId: null,
        technicalDetails: syncPcTechnicalDetailsWithZone(
          marker.technicalDetails,
          null,
        ),
      });
      continue;
    }

    updatedMarkers.push(marker);
  }

  return updatedMarkers;
}
