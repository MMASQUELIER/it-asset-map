import type {
  InteractiveMarker,
  MapZone,
  PlacementPcCandidate,
} from "@/features/infrastructure-map/model/types";

export function isMarkerCompatibleWithZone(
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

export function doesPlacementCandidateMatchZoneSector(
  candidate: PlacementPcCandidate,
  zone: MapZone,
): boolean {
  const candidateSector = normalizeSectorName(candidate.sector);
  const zoneSector = normalizeSectorName(zone.sector);

  return candidateSector === zoneSector;
}

function normalizeSectorName(value: string | undefined): string {
  if (value === undefined) {
    return "";
  }

  return value.trim().toUpperCase();
}
