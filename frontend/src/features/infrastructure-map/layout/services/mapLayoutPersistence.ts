import type {
  InteractiveMarker,
  MapImageDimensions,
  MapLayoutData,
  MapZone,
  PlacementPcCandidate,
} from "@/features/infrastructure-map/model/types";
import {
  hydratePlacedMarkers,
  serializeMarkerPlacements,
} from "@/features/infrastructure-map/markers/logic/interactiveMarkers";
import { serializeMapZones } from "@/features/infrastructure-map/zones/logic/zoneCollections";
import { hydrateMapZones } from "@/features/infrastructure-map/zones/logic/interactiveZones";

export interface HydratedInteractiveMapState {
  mapImage: MapImageDimensions;
  markers: InteractiveMarker[];
  zones: MapZone[];
}

export function createEmptyMapLayout(
  mapImage: MapImageDimensions,
): MapLayoutData {
  return {
    mapImage,
    zones: [],
    markerPlacements: [],
  };
}

export function hydrateInteractiveMapState(
  mapLayoutData: MapLayoutData,
  placementPcCandidates: PlacementPcCandidate[],
): HydratedInteractiveMapState {
  const zones = hydrateMapZones(mapLayoutData.zones);
  const markers = hydratePlacedMarkers(
    mapLayoutData.markerPlacements,
    placementPcCandidates,
    zones,
  );

  return {
    mapImage: mapLayoutData.mapImage,
    markers,
    zones,
  };
}

export function buildMapLayoutData(
  mapImage: MapImageDimensions,
  zones: MapZone[],
  markers: InteractiveMarker[],
): MapLayoutData {
  return {
    mapImage,
    zones: serializeMapZones(zones),
    markerPlacements: serializeMarkerPlacements(markers),
  };
}
