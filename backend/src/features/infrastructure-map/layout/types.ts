export interface MapImageDimensions {
  width: number;
  height: number;
}

export interface StoredMapZone {
  id: number;
  sector: string;
  prodsched: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
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
