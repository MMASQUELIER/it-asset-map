import type {
  PlacementCandidate,
} from "@/features/infrastructure-map/model/types";
import { normalizeSearchValue } from "@/features/infrastructure-map/markers/logic/marker-search/normalization";

export function searchPlacementCandidates(
  candidates: PlacementCandidate[],
  searchQuery: string,
  limit = 10,
): PlacementCandidate[] {
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);
  const rankedCandidates: Array<{
    candidate: PlacementCandidate;
    score: number;
  }> = [];

  if (normalizedSearchQuery.length === 0) {
    return candidates.slice(0, limit);
  }

  for (const candidate of candidates) {
    const score = getPlacementCandidateScore(candidate, normalizedSearchQuery);

    if (score === null) {
      continue;
    }

    rankedCandidates.push({ candidate, score });
  }

  rankedCandidates.sort(comparePlacementCandidates);

  const visibleCandidates: PlacementCandidate[] = [];

  for (const entry of rankedCandidates) {
    visibleCandidates.push(entry.candidate);

    if (visibleCandidates.length === limit) {
      break;
    }
  }

  return visibleCandidates;
}

export function doesPlacementCandidateMatchSector(
  candidate: PlacementCandidate,
  sectorName: string,
): boolean {
  const candidateSector = normalizeSearchValue(candidate.sector);
  const normalizedSectorName = normalizeSearchValue(sectorName);

  return candidateSector === normalizedSectorName;
}

function getPlacementCandidateScore(
  candidate: PlacementCandidate,
  normalizedSearchQuery: string,
): number | null {
  let bestScore: number | null = null;

  for (const value of getPlacementCandidateSearchValues(candidate)) {
    const normalizedValue = normalizeSearchValue(value);

    if (normalizedValue.length === 0) {
      continue;
    }

    if (normalizedValue === normalizedSearchQuery) {
      return 1000;
    }

    if (normalizedValue.startsWith(normalizedSearchQuery)) {
      bestScore = Math.max(bestScore ?? 0, 700 - normalizedValue.length);
      continue;
    }

    const matchIndex = normalizedValue.indexOf(normalizedSearchQuery);

    if (matchIndex !== -1) {
      bestScore = Math.max(bestScore ?? 0, 420 - matchIndex);
    }
  }

  return bestScore;
}

function comparePlacementCandidates(
  firstEntry: { candidate: PlacementCandidate; score: number },
  secondEntry: { candidate: PlacementCandidate; score: number },
): number {
  if (firstEntry.score !== secondEntry.score) {
    return secondEntry.score - firstEntry.score;
  }

  return firstEntry.candidate.id.localeCompare(
    secondEntry.candidate.id,
    "fr",
  );
}

function getPlacementCandidateSearchValues(
  candidate: PlacementCandidate,
): string[] {
  return [
    candidate.id,
    candidate.hostname ?? "",
    candidate.label,
    candidate.prodsheet ?? "",
    candidate.sector,
    candidate.stationName,
    candidate.technicalDetails.serialNumber ?? "",
    candidate.technicalDetails.contact ?? "",
  ];
}
