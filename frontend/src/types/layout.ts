export interface StaticMapImage {
  width: number;
  height: number;
}

export interface PcTechnicalDetails {
  site?: string;
  contact?: string;
  pinKey?: string;
  sector?: string;
  floorLocation?: string;
  location?: string;
  prodsched?: string;
  manufacturingStationNames?: string;
  lastInventoryDate?: string;
  assetType?: string;
  manufacturer?: string;
  model?: string;
  sap?: string;
  hostname: string;
  operatingSystem: string;
  processor: string;
  memory: string;
  storage: string;
  ipAddress: string;
  oldIpAddress?: string;
  newIpAddress?: string;
  subnetMask?: string;
  macAddress: string;
  vlan?: string;
  vlanNew?: string;
  networkScope?: string;
  gateway?: string;
  idPort?: string;
  switchPort?: string;
  newPortAuto?: string;
  switchName?: string;
  connectedToSwitchName?: string;
  switchIpAddress?: string;
  connectedToSwitchPort?: string;
  connectionType?: string;
  wifiOrWiredConnection?: string;
  ticketBrassage?: string;
  ipFilter?: string;
  directoryAccount?: string;
  comment?: string;
  commentaire2?: string;
  serialNumber: string;
  etat?: string;
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
