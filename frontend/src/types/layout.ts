export interface StaticMapImage {
  width: number;
  height: number;
}

export interface RectangleBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TestPc {
  id: string;
  x: number;
  y: number;
}

export interface InteractiveMarker {
  id: string;
  x: number;
  y: number;
  zoneId: number | null;
}

export interface MarkerDraft {
  x: number;
  y: number;
  zoneId: number | null;
  suggestedId: string;
}

export interface ZoneDraft {
  bounds: RectangleBounds;
  color: string;
  suggestedId: number;
}

export interface MapZone {
  id: number;
  color: string;
  bounds: RectangleBounds;
  pcs: TestPc[];
}

export interface StaticMapData {
  image: StaticMapImage;
  zones: MapZone[];
}
