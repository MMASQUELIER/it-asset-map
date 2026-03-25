import type { InteractiveMarker } from "../../shared/types";

/** Search result returned to the map search panel. */
export interface MarkerSearchResult {
  marker: InteractiveMarker;
  matchedFieldLabel: string;
  matchedValue: string;
}

/** One searchable marker field and its ranking weight. */
interface SearchField {
  getValue: (marker: InteractiveMarker) => string | undefined;
  label: string;
  weight: number;
}

/** Internal search result enriched with its ranking score. */
interface RankedMarkerSearchResult extends MarkerSearchResult {
  score: number;
}

/** Bonus score applied to an exact match. */
const EXACT_MATCH_SCORE = 1000;
/** Bonus score applied to a prefix match. */
const PREFIX_MATCH_SCORE = 700;
/** Bonus score applied to a generic containment match. */
const CONTAINS_MATCH_SCORE = 420;

/** Ordered list of searchable marker fields. */
const SEARCH_FIELDS: SearchField[] = [
  { getValue: (marker) => marker.id, label: "Identifiant", weight: 120 },
  {
    getValue: (marker) => marker.technicalDetails.hostname,
    label: "Hostname",
    weight: 100,
  },
  {
    getValue: (marker) => marker.technicalDetails.ipAddress,
    label: "Adresse IP",
    weight: 95,
  },
  {
    getValue: (marker) => marker.technicalDetails.macAddress,
    label: "Adresse MAC",
    weight: 90,
  },
  {
    getValue: (marker) => marker.technicalDetails.serialNumber,
    label: "Numero de serie",
    weight: 88,
  },
  {
    getValue: (marker) => marker.technicalDetails.directoryAccount,
    label: "Compte",
    weight: 82,
  },
  {
    getValue: (marker) => marker.technicalDetails.location,
    label: "Emplacement",
    weight: 76,
  },
  {
    getValue: (marker) => marker.technicalDetails.switchName,
    label: "Switch",
    weight: 70,
  },
  {
    getValue: (marker) => marker.technicalDetails.switchPort,
    label: "Port switch",
    weight: 64,
  },
];

/**
 * Searches markers by multiple identifiers and ranks the most relevant matches.
 *
 * @param markers Markers available on the map.
 * @param query Raw user query.
 * @param limit Maximum number of results to return.
 * @returns Sorted search results.
 */
export function searchMarkers(
  markers: InteractiveMarker[],
  query: string,
  limit = 6,
): MarkerSearchResult[] {
  const normalizedQuery = normalizeSearchValue(query);
  const rankedResults: RankedMarkerSearchResult[] = [];

  if (normalizedQuery.length === 0) {
    return [];
  }

  for (const marker of markers) {
    const bestMatch = findBestMarkerMatch(marker, normalizedQuery);

    if (bestMatch !== null) {
      rankedResults.push(bestMatch);
    }
  }

  rankedResults.sort(compareSearchResults);

  return rankedResults
    .slice(0, limit)
    .map((result) => ({
      marker: result.marker,
      matchedFieldLabel: result.matchedFieldLabel,
      matchedValue: result.matchedValue,
    }));
}

/**
 * Finds the best matching field for one marker.
 *
 * @param marker Marker to inspect.
 * @param normalizedQuery Normalized search query.
 * @returns Best ranked result for that marker or `null`.
 */
function findBestMarkerMatch(
  marker: InteractiveMarker,
  normalizedQuery: string,
): RankedMarkerSearchResult | null {
  let bestResult: RankedMarkerSearchResult | null = null;

  for (const field of SEARCH_FIELDS) {
    const fieldValue = field.getValue(marker);

    if (!isSearchableValue(fieldValue)) {
      continue;
    }

    const score = getSearchScore(fieldValue, normalizedQuery, field.weight);

    if (score === null) {
      continue;
    }

    if (bestResult === null || score > bestResult.score) {
      bestResult = {
        marker,
        matchedFieldLabel: field.label,
        matchedValue: fieldValue,
        score,
      };
    }
  }

  return bestResult;
}

/**
 * Scores a field value against a normalized query.
 *
 * @param value Raw field value.
 * @param normalizedQuery Normalized user query.
 * @param fieldWeight Weight attached to the field.
 * @returns Matching score or `null` when the field does not match.
 */
function getSearchScore(
  value: string,
  normalizedQuery: string,
  fieldWeight: number,
): number | null {
  const normalizedValue = normalizeSearchValue(value);

  if (normalizedValue.length === 0) {
    return null;
  }

  if (normalizedValue === normalizedQuery) {
    return EXACT_MATCH_SCORE + fieldWeight;
  }

  if (normalizedValue.startsWith(normalizedQuery)) {
    return PREFIX_MATCH_SCORE + fieldWeight - normalizedValue.length;
  }

  const matchingIndex = normalizedValue.indexOf(normalizedQuery);

  if (matchingIndex === -1) {
    return null;
  }

  return CONTAINS_MATCH_SCORE + fieldWeight - matchingIndex;
}

/**
 * Sorts ranked search results from best to worst.
 *
 * @param firstResult First result.
 * @param secondResult Second result.
 * @returns Comparison value compatible with `Array.prototype.sort`.
 */
function compareSearchResults(
  firstResult: RankedMarkerSearchResult,
  secondResult: RankedMarkerSearchResult,
): number {
  if (secondResult.score !== firstResult.score) {
    return secondResult.score - firstResult.score;
  }

  return firstResult.marker.id.localeCompare(secondResult.marker.id, "fr");
}

/**
 * Checks whether a field value can be used for search.
 *
 * @param value Candidate field value.
 * @returns `true` when the field contains searchable text.
 */
function isSearchableValue(value: string | undefined): value is string {
  return value !== undefined && value.trim().length > 0;
}

/**
 * Normalises user text to make search case- and accent-insensitive.
 *
 * @param value Raw search string.
 * @returns Normalized search string.
 */
function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
