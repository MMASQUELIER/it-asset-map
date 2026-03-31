import type {
  InteractiveMarker,
  MapZone,
  PlacementPcCandidate,
  StoredMarkerPlacement,
} from "@/features/infrastructure-map/model/types";
import { syncPcTechnicalDetailsWithZone } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";
import { doesPlacementCandidateMatchZoneSector } from "@/features/infrastructure-map/markers/logic/interactive-markers/markerSectorCompatibility";

export function hydratePlacedMarkers(
  markerPlacements: StoredMarkerPlacement[],
  placementPcCandidates: PlacementPcCandidate[],
  zones: MapZone[],
): InteractiveMarker[] {
  const zoneById = new Map<number, MapZone>();
  const candidateByMarkerId = new Map<string, PlacementPcCandidate>();
  const hydratedMarkers: InteractiveMarker[] = [];

  for (const zone of zones) {
    zoneById.set(zone.id, zone);
  }

  for (const placementCandidate of placementPcCandidates) {
    candidateByMarkerId.set(placementCandidate.markerId, placementCandidate);
  }

  for (const markerPlacement of markerPlacements) {
    const placementCandidate = candidateByMarkerId.get(
      markerPlacement.markerId,
    );

    if (placementCandidate === undefined) {
      continue;
    }

    const resolvedZone = resolvePlacedMarkerZone(
      markerPlacement,
      placementCandidate,
      zoneById,
    );

    hydratedMarkers.push({
      id: placementCandidate.markerId,
      x: Math.round(markerPlacement.x),
      y: Math.round(markerPlacement.y),
      zoneId: resolvedZone === null ? null : resolvedZone.id,
      technicalDetails: syncPcTechnicalDetailsWithZone(
        placementCandidate.technicalDetails,
        resolvedZone,
      ),
    });
  }

  return hydratedMarkers;
}

export function serializeMarkerPlacements(
  markers: InteractiveMarker[],
): StoredMarkerPlacement[] {
  const serializedMarkers: StoredMarkerPlacement[] = [];

  for (const marker of markers) {
    serializedMarkers.push({
      markerId: marker.id,
      x: marker.x,
      y: marker.y,
      zoneId: marker.zoneId,
    });
  }

  return serializedMarkers;
}

function resolvePlacedMarkerZone(
  markerPlacement: StoredMarkerPlacement,
  placementCandidate: PlacementPcCandidate,
  zoneById: Map<number, MapZone>,
): MapZone | null {
  if (markerPlacement.zoneId === null) {
    return null;
  }

  const assignedZone = zoneById.get(markerPlacement.zoneId) ?? null;

  if (assignedZone === null) {
    return null;
  }

  if (!doesPlacementCandidateMatchZoneSector(placementCandidate, assignedZone)) {
    return null;
  }

  return assignedZone;
}
