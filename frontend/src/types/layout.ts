export interface StaticMapImage {
  width: number;
  height: number;
}

export interface PcTechnicalDetails {
  site?: string;
  contact?: string;
  sector?: string;
  location?: string;
  lastInventoryDate?: string;
  assetType?: string;
  manufacturer?: string;
  model?: string;
  hostname: string;
  operatingSystem: string;
  processor: string;
  memory: string;
  storage: string;
  ipAddress: string;
  subnetMask?: string;
  macAddress: string;
  vlan?: string;
  networkScope?: string;
  gateway?: string;
  switchPort?: string;
  switchName?: string;
  switchIpAddress?: string;
  connectionType?: string;
  directoryAccount?: string;
  comment?: string;
  serialNumber: string;
  securityStatus: string;
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
  technicalDetails: PcTechnicalDetails;
}

export interface InteractiveMarker extends TestPc {
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
