import type {
  InteractiveMarker,
  MapZone,
  PlacementPcCandidate,
} from "@/features/infrastructure-map/model/types";
import { doesPlacementCandidateMatchSector } from "@/features/infrastructure-map/markers/services/placementCandidateSearch";

export function getAvailablePlacementPcCandidates(
  placementPcCandidates: PlacementPcCandidate[],
  markers: InteractiveMarker[],
  pendingMarkerZone: MapZone | null,
): PlacementPcCandidate[] {
  const availableCandidates: PlacementPcCandidate[] = [];

  for (const candidate of placementPcCandidates) {
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
      pendingMarkerZone.sector,
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
  const markerSector = normalizeSectorName(
    marker.technicalDetails.floorLocation ?? marker.technicalDetails.sector,
  );
  const zoneSector = normalizeSectorName(zone.sector);

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
  candidate: PlacementPcCandidate,
  markers: InteractiveMarker[],
): boolean {
  for (const marker of markers) {
    if (marker.id === candidate.markerId) {
      return true;
    }
  }

  return false;
}
