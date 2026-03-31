import type { MapImageDimensions, RectangleBounds } from "@/features/infrastructure-map/model/types/map";

export interface StoredMapZone {
  id: number;
  sector: string;
  prodsched: string;
  bounds: RectangleBounds;
}

export interface StoredMarkerPlacement {
  markerId: string;
  x: number;
  y: number;
  zoneId: number | null;
}

export interface MapLayoutData {
  mapImage: MapImageDimensions;
  zones: StoredMapZone[];
  markerPlacements: StoredMarkerPlacement[];
}
