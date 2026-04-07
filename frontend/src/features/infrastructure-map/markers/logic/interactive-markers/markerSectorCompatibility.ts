import type {
  InteractiveMarker,
  MapZone,
  PlacementCandidate,
} from "@/features/infrastructure-map/model/types";
import { getResolvedPcLocation } from "@/features/infrastructure-map/model/pcValueResolvers";

export function isMarkerCompatibleWithZone(
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

export function doesPlacementCandidateMatchZoneSector(
  candidate: PlacementCandidate,
  zone: MapZone,
): boolean {
  const candidateSector = normalizeSectorName(candidate.sector);
  const zoneSector = normalizeSectorName(zone.sectorName);

  return candidateSector === zoneSector;
}

function normalizeSectorName(value: string | undefined): string {
  if (value === undefined) {
    return "";
  }

  return value.trim().toUpperCase();
}
