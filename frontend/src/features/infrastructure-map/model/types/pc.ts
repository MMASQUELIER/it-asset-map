export const EDITABLE_PC_FIELD_IDS = [
  "contact",
  "pinKey",
  "sector",
  "zoneCode",
  "manufacturingStationNames",
  "lastInventoryDate",
  "assetType",
  "manufacturer",
  "model",
  "sap",
  "hostname",
  "operatingSystem",
  "storage",
  "ipAddress",
  "oldIpAddress",
  "newIpAddress",
  "subnetMask",
  "macAddress",
  "vlan",
  "vlanNew",
  "networkScope",
  "idPort",
  "newPortAuto",
  "switchName",
  "switchIpAddress",
  "connectedToSwitchName",
  "connectedToSwitchPort",
  "wifiOrWiredConnection",
  "ticketBrassage",
  "ipFilter",
  "directoryAccount",
  "secondaryComment",
  "serialNumber",
  "status",
] as const;

export type EditablePcFieldId = typeof EDITABLE_PC_FIELD_IDS[number];

export interface PcTechnicalDetails {
  catalogIssues?: string[];
  contact?: string;
  pinKey?: string;
  sector?: string;
  floorLocation?: string;
  zoneCode?: string;
  manufacturingStationNames?: string;
  lastInventoryDate?: string;
  assetType?: string;
  manufacturer?: string;
  model?: string;
  sap?: string;
  hostname?: string;
  operatingSystem?: string;
  storage?: string;
  ipAddress?: string;
  oldIpAddress?: string;
  newIpAddress?: string;
  subnetMask?: string;
  macAddress?: string;
  vlan?: string;
  vlanNew?: string;
  networkScope?: string;
  idPort?: string;
  newPortAuto?: string;
  switchName?: string;
  connectedToSwitchName?: string;
  switchIpAddress?: string;
  connectedToSwitchPort?: string;
  // Legacy aliases still accepted for rows not yet normalized in CMDB.
  connectionType?: string;
  wifiOrWiredConnection?: string;
  ticketBrassage?: string;
  ipFilter?: string;
  directoryAccount?: string;
  comment?: string;
  secondaryComment?: string;
  serialNumber?: string;
  status?: string;
  securityStatus?: string;
}

export interface MapPc {
  id: string;
  equipmentDataId: number;
  x: number;
  y: number;
  technicalDetails: PcTechnicalDetails;
}
