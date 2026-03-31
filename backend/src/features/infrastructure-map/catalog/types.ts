export interface PcTechnicalDetailsDto {
  excelIssues?: string[];
  site?: string;
  contact?: string;
  pinKey?: string;
  sector?: string;
  floorLocation?: string;
  prodsched?: string;
  manufacturingStationNames?: string;
  lastInventoryDate?: string;
  assetType?: string;
  manufacturer?: string;
  model?: string;
  sap?: string;
  hostname?: string;
  operatingSystem?: string;
  processor?: string;
  memory?: string;
  storage?: string;
  ipAddress?: string;
  oldIpAddress?: string;
  newIpAddress?: string;
  subnetMask?: string;
  macAddress?: string;
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
  serialNumber?: string;
  etat?: string;
  securityStatus?: string;
}

export interface PlacementPcCandidateDto {
  id: string;
  markerId: string;
  hostname?: string;
  label: string;
  prodsched: string;
  sector: string;
  stationName: string;
  technicalDetails: PcTechnicalDetailsDto;
}

export interface CatalogResponseDto {
  availableSectors: string[];
  placementPcCandidates: PlacementPcCandidateDto[];
}

export type BackendAssetRecord = Record<string, unknown>;
