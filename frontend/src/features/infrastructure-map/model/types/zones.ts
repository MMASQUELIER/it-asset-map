import type { RectangleBounds } from "@/features/infrastructure-map/model/types/map";

export interface ZoneMetadata {
  label: string;
  sector: string;
  prodsched: string;
}

export interface ZoneDraft {
  bounds: RectangleBounds;
  suggestedId: number;
}

export interface MapZone extends ZoneMetadata {
  id: number;
  color: string;
  bounds: RectangleBounds;
}
