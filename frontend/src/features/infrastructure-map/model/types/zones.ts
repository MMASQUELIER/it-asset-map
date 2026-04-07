import type { RectangleBounds } from "@/features/infrastructure-map/model/types/map";

export interface ZoneDraft {
  bounds: RectangleBounds;
}

export interface ZoneDraftValues {
  code: string;
  name: string;
  sectorName: string;
}

export interface MapZone {
  bounds: RectangleBounds;
  code: string;
  color: string;
  id: number;
  name?: string;
  sectorId: number;
  sectorName: string;
}
