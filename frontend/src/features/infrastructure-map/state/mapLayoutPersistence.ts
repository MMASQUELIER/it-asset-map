import type {
  InteractiveMarker,
  MapImageDimensions,
  MapLayoutData,
  MapZone,
  PlacementPcCandidate,
} from "../shared/types";
import {
  hydratePlacedMarkers,
  serializeMarkerPlacements,
} from "../markers/logic/interactiveMarkers";
import { serializeMapZones } from "../zones/logic/zoneCollections";
import { hydrateMapZones } from "../zones/logic/interactiveZones";

/** Interactive map state rebuilt from the persisted backend layout. */
export interface HydratedInteractiveMapState {
  mapImage: MapImageDimensions;
  markers: InteractiveMarker[];
  zones: MapZone[];
}

/**
 * Rebuilds the interactive frontend state from the persisted backend layout.
 *
 * @param mapLayoutData Raw layout loaded from the backend.
 * @param placementPcCandidates Placement candidates built from the Excel export.
 * @returns Hydrated zones, markers and map image dimensions.
 */
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

/**
 * Builds the JSON layout payload that must be persisted by the backend.
 *
 * @param mapImage Current map image dimensions.
 * @param zones Interactive zones currently displayed on the map.
 * @param markers Interactive markers currently displayed on the map.
 * @returns Serializable layout payload.
 */
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
