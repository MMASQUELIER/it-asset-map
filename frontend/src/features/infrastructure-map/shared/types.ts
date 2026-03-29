/** Dimensions of the image used as the background map. */
export interface MapImageDimensions {
  width: number;
  height: number;
}

/** Technical metadata associated with one PC marker. */
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

/** Rectangle expressed in image coordinates. */
export interface RectangleBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Business metadata attached to one production zone. */
export interface ZoneMetadata {
  label: string;
  sector: string;
  prodsched: string;
}

/** Immutable PC definition used across the map domain. */
export interface MapPc {
  id: string;
  x: number;
  y: number;
  technicalDetails: PcTechnicalDetails;
}

/** PC marker enriched with the zone currently containing it. */
export interface InteractiveMarker extends MapPc {
  zoneId: number | null;
}

/** Temporary marker state created before the user confirms insertion. */
export interface MarkerDraft {
  x: number;
  y: number;
  zoneId: number | null;
  suggestedId: string;
}

/** Searchable PC candidate loaded from the backend CMDB export. */
export interface PlacementPcCandidate {
  id: string;
  markerId: string;
  hostname: string;
  label: string;
  prodsched: string;
  sector: string;
  stationName: string;
  technicalDetails: PcTechnicalDetails;
}

/** Temporary zone state built while the user draws a new zone. */
export interface ZoneDraft {
  bounds: RectangleBounds;
  suggestedId: number;
}

/** Zone displayed and edited on top of the map image. */
export interface MapZone extends ZoneMetadata {
  id: number;
  color: string;
  bounds: RectangleBounds;
}

/** Zone persisted in the backend JSON layout. */
export interface StoredMapZone {
  id: number;
  sector: string;
  prodsched: string;
  bounds: RectangleBounds;
}

/** Marker placement persisted in the backend JSON layout. */
export interface StoredMarkerPlacement {
  markerId: string;
  x: number;
  y: number;
  zoneId: number | null;
}

/** Complete layout persisted in the backend JSON file. */
export interface MapLayoutData {
  mapImage: MapImageDimensions;
  zones: StoredMapZone[];
  markerPlacements: StoredMarkerPlacement[];
}
