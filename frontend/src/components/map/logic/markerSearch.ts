import type { InteractiveMarker } from "../../../types/layout";

export interface MarkerSearchResult {
  marker: InteractiveMarker;
  matchedFieldLabel: string;
  matchedValue: string;
}

interface SearchFieldDefinition {
  getValue: (marker: InteractiveMarker) => string | undefined;
  label: string;
  weight: number;
}

interface RankedMarkerSearchResult extends MarkerSearchResult {
  score: number;
}

const SEARCH_FIELDS: SearchFieldDefinition[] = [
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

export function searchMarkers(
  markers: InteractiveMarker[],
  query: string,
  limit = 6,
): MarkerSearchResult[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (normalizedQuery.length === 0) {
    return [];
  }

  return markers
    .map((marker) => getBestMarkerMatch(marker, normalizedQuery))
    .filter(
      (result): result is RankedMarkerSearchResult => result !== null,
    )
    .sort((firstResult, secondResult) => {
      if (secondResult.score !== firstResult.score) {
        return secondResult.score - firstResult.score;
      }

      return firstResult.marker.id.localeCompare(secondResult.marker.id, "fr");
    })
    .slice(0, limit)
    .map(({ marker, matchedFieldLabel, matchedValue }) => ({
      marker,
      matchedFieldLabel,
      matchedValue,
    }));
}

function getBestMarkerMatch(
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
    return 1000 + fieldWeight;
  }

  if (normalizedValue.startsWith(normalizedQuery)) {
    return 700 + fieldWeight - normalizedValue.length;
  }

  const matchingIndex = normalizedValue.indexOf(normalizedQuery);

  if (matchingIndex === -1) {
    return null;
  }

  return 420 + fieldWeight - matchingIndex;
}

function isSearchableValue(value: string | undefined): value is string {
  return value !== undefined && value.trim().length > 0;
}

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
