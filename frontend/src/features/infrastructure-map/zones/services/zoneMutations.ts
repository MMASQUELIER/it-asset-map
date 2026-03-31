import type {
  InteractiveMarker,
  MapZone,
} from "@/features/infrastructure-map/model/types";
import {
  assignMarkersWithinBoundsToZone,
} from "@/features/infrastructure-map/markers/logic/interactiveMarkers";
import { doesMarkerMatchZoneSector } from "@/features/infrastructure-map/markers/services/markerAssignments";
import { syncPcTechnicalDetailsWithZone } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

interface ZoneMutationResult {
  markers: InteractiveMarker[];
  zone: MapZone;
  zones: MapZone[];
}

export function applyZoneSectorChange(
  zones: MapZone[],
  markers: InteractiveMarker[],
  selectedZone: MapZone,
  sector: string,
): ZoneMutationResult {
  const nextSector = sector.trim();
  const nextZone = {
    ...selectedZone,
    color: getSectorColor(nextSector),
    label: selectedZone.prodsched,
    sector: nextSector,
  };

  return {
    zones: replaceZone(zones, nextZone),
    markers: assignMarkersWithinBoundsToZone(
      detachIncompatibleZoneMarkers(markers, nextZone),
      nextZone,
      nextZone.bounds,
    ),
    zone: nextZone,
  };
}

export function applyZoneProdschedChange(
  zones: MapZone[],
  markers: InteractiveMarker[],
  selectedZone: MapZone,
  prodsched: string,
): ZoneMutationResult {
  const nextProdsched = prodsched.trimStart();
  const nextZone = {
    ...selectedZone,
    label: nextProdsched,
    prodsched: nextProdsched,
  };

  return {
    zones: replaceZone(zones, nextZone),
    markers: assignMarkersWithinBoundsToZone(markers, nextZone, nextZone.bounds),
    zone: nextZone,
  };
}

export function deleteZoneState(
  zones: MapZone[],
  markers: InteractiveMarker[],
  zoneId: number,
): {
  markers: InteractiveMarker[];
  zones: MapZone[];
} {
  return {
    zones: zones.filter((zone) => zone.id !== zoneId),
    markers: markers.map(function removeZoneFromMarker(marker) {
      if (marker.zoneId !== zoneId) {
        return marker;
      }

      return {
        ...marker,
        zoneId: null,
        technicalDetails: syncPcTechnicalDetailsWithZone(
          marker.technicalDetails,
          null,
        ),
      };
    }),
  };
}

function detachIncompatibleZoneMarkers(
  markers: InteractiveMarker[],
  zone: MapZone,
): InteractiveMarker[] {
  return markers.map(function detachIncompatibleZoneMarker(marker) {
    if (marker.zoneId !== zone.id) {
      return marker;
    }

    if (doesMarkerMatchZoneSector(marker, zone)) {
      return marker;
    }

    return {
      ...marker,
      zoneId: null,
      technicalDetails: syncPcTechnicalDetailsWithZone(
        marker.technicalDetails,
        null,
      ),
    };
  });
}

function replaceZone(zones: MapZone[], nextZone: MapZone): MapZone[] {
  return zones.map(function replaceCurrentZone(zone) {
    if (zone.id !== nextZone.id) {
      return zone;
    }

    return nextZone;
  });
}
