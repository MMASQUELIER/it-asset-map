import type { InteractiveMarker } from "@/features/infrastructure-map/model/types";

export interface MarkerSearchResult {
  marker: InteractiveMarker;
  matchedFieldLabel: string;
  matchedValue: string;
}

export interface SearchField {
  getValue: (marker: InteractiveMarker) => string | undefined;
  label: string;
  weight: number;
}

export interface RankedMarkerSearchResult extends MarkerSearchResult {
  score: number;
}
