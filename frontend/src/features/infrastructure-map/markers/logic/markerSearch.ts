import { markerSearchFields } from "@/features/infrastructure-map/markers/logic/marker-search/fields";
import {
  isNonEmptySearchValue,
  normalizeSearchValue,
} from "@/features/infrastructure-map/markers/logic/marker-search/normalization";
import {
  calculateSearchScore,
  compareSearchResults,
} from "@/features/infrastructure-map/markers/logic/marker-search/ranking";
import type {
  MarkerSearchResult,
  RankedMarkerSearchResult,
} from "@/features/infrastructure-map/markers/logic/marker-search/types";
import type { InteractiveMarker } from "@/features/infrastructure-map/model/types";

export type { MarkerSearchResult } from "@/features/infrastructure-map/markers/logic/marker-search/types";

export function searchMarkers(
  markers: InteractiveMarker[],
  searchQuery: string,
  limit = 6,
): MarkerSearchResult[] {
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);
  const rankedMarkerResults: RankedMarkerSearchResult[] = [];

  if (normalizedSearchQuery.length === 0) {
    return [];
  }

  for (const marker of markers) {
    const highestScoringMatch = findHighestScoringMarkerMatch(
      marker,
      normalizedSearchQuery,
    );

    if (highestScoringMatch !== null) {
      rankedMarkerResults.push(highestScoringMatch);
    }
  }

  rankedMarkerResults.sort(compareSearchResults);

  const visibleResults: MarkerSearchResult[] = [];

  for (const result of rankedMarkerResults) {
    visibleResults.push({
      marker: result.marker,
      matchedFieldLabel: result.matchedFieldLabel,
      matchedValue: result.matchedValue,
    });

    if (visibleResults.length === limit) {
      break;
    }
  }

  return visibleResults;
}

function findHighestScoringMarkerMatch(
  marker: InteractiveMarker,
  normalizedSearchQuery: string,
): RankedMarkerSearchResult | null {
  let highestScoringResult: RankedMarkerSearchResult | null = null;

  for (const field of markerSearchFields) {
    const fieldValue = field.getValue(marker);

    if (!isNonEmptySearchValue(fieldValue)) {
      continue;
    }

    const score = calculateSearchScore(
      fieldValue,
      normalizedSearchQuery,
      field.weight,
    );

    if (score === null) {
      continue;
    }

    if (highestScoringResult === null || score > highestScoringResult.score) {
      highestScoringResult = {
        marker,
        matchedFieldLabel: field.label,
        matchedValue: fieldValue,
        score,
      };
    }
  }

  return highestScoringResult;
}
