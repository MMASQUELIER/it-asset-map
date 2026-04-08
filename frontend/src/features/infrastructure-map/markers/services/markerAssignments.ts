import type {
  InteractiveMarker,
  MapZone,
  PlacementCandidate,
} from "@/features/infrastructure-map/model/types";
import { getResolvedPcLocation } from "@/features/infrastructure-map/model/pcValueResolvers";
import { doesPlacementCandidateMatchSector } from "@/features/infrastructure-map/markers/services/placementCandidateSearch";

export function getAvailablePlacementCandidates(
  placementCandidates: PlacementCandidate[],
  markers: InteractiveMarker[],
  pendingMarkerZone: MapZone | null,
): PlacementCandidate[] {
  const availableCandidates: PlacementCandidate[] = [];

  for (const candidate of placementCandidates) {
    if (isPlacementCandidateAlreadyPlaced(candidate, markers)) {
      continue;
    }

    if (pendingMarkerZone === null) {
      availableCandidates.push(candidate);
      continue;
    }

    if (
      doesPlacementCandidateMatchSector(
      candidate,
      pendingMarkerZone.sectorName,
      )
    ) {
      availableCandidates.push(candidate);
    }
  }

  return availableCandidates;
}

export function doesMarkerMatchZoneSector(
  marker: InteractiveMarker,
  zone: MapZone,
): boolean {
  const markerSector = normalizeSectorName(getResolvedPcLocation(marker.technicalDetails));
  const zoneSector = normalizeSectorName(zone.sectorName);

  if (markerSector.length === 0) {
    return true;
  }

  if (zoneSector.length === 0) {
    return true;
  }

  return markerSector === zoneSector;
}

function normalizeSectorName(value: string | undefined): string {
  if (value === undefined) {
    return "";
  }

  return value.trim().toUpperCase();
}

function isPlacementCandidateAlreadyPlaced(
  candidate: PlacementCandidate,
  markers: InteractiveMarker[],
): boolean {
  for (const marker of markers) {
    if (marker.id === candidate.id) {
      return true;
    }
  }

  return false;
}
