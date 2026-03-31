import type { RankedMarkerSearchResult } from "@/features/infrastructure-map/markers/logic/marker-search/types";
import { normalizeSearchValue } from "@/features/infrastructure-map/markers/logic/marker-search/normalization";

const EXACT_MATCH_SCORE = 1000;
const PREFIX_MATCH_SCORE = 700;
const CONTAINS_MATCH_SCORE = 420;

export function calculateSearchScore(
  value: string,
  normalizedSearchQuery: string,
  fieldWeight: number,
): number | null {
  const normalizedValue = normalizeSearchValue(value);

  if (normalizedValue.length === 0) {
    return null;
  }

  if (normalizedValue === normalizedSearchQuery) {
    return EXACT_MATCH_SCORE + fieldWeight;
  }

  if (normalizedValue.startsWith(normalizedSearchQuery)) {
    return PREFIX_MATCH_SCORE + fieldWeight - normalizedValue.length;
  }

  const matchingIndex = normalizedValue.indexOf(normalizedSearchQuery);

  if (matchingIndex === -1) {
    return null;
  }

  return CONTAINS_MATCH_SCORE + fieldWeight - matchingIndex;
}

export function compareSearchResults(
  firstResult: RankedMarkerSearchResult,
  secondResult: RankedMarkerSearchResult,
): number {
  if (secondResult.score !== firstResult.score) {
    return secondResult.score - firstResult.score;
  }

  return firstResult.marker.id.localeCompare(secondResult.marker.id, "fr");
}
