import { COLUMN_KEYS } from "@/features/infrastructure-map/catalog/lib/columns.ts";

export const EDITABLE_CATALOG_FIELD_COLUMN_NAMES = {
  contact: COLUMN_KEYS.collaborator,
  pinKey: COLUMN_KEYS.pinKey,
  sector: COLUMN_KEYS.sector,
  manufacturingStationNames: COLUMN_KEYS.stationName,
  lastInventoryDate: COLUMN_KEYS.lastInventoryDate,
  assetType: COLUMN_KEYS.assetType,
  manufacturer: COLUMN_KEYS.manufacturer,
  model: COLUMN_KEYS.model,
  sap: COLUMN_KEYS.sap,
  hostname: COLUMN_KEYS.hostname,
  operatingSystem: COLUMN_KEYS.operatingSystem,
  storage: COLUMN_KEYS.storage,
  ipAddress: COLUMN_KEYS.ipAddress,
  oldIpAddress: COLUMN_KEYS.oldIpAddress,
  newIpAddress: COLUMN_KEYS.newIpAddress,
  subnetMask: COLUMN_KEYS.subnetMask,
  macAddress: COLUMN_KEYS.macAddress,
  vlan: COLUMN_KEYS.vlan,
  vlanNew: COLUMN_KEYS.vlanNew,
  networkScope: COLUMN_KEYS.networkScope,
  gateway: COLUMN_KEYS.gateway,
  idPort: COLUMN_KEYS.idPort,
  newPortAuto: COLUMN_KEYS.newPortAuto,
  switchName: COLUMN_KEYS.switchName,
  switchIpAddress: COLUMN_KEYS.switchIpAddress,
  connectedToSwitchName: COLUMN_KEYS.connectedToSwitchName,
  connectedToSwitchPort: COLUMN_KEYS.connectedToSwitchPort,
  wifiOrWiredConnection: COLUMN_KEYS.wifiOrWiredConnection,
  ticketBrassage: COLUMN_KEYS.ticketBrassage,
  ipFilter: COLUMN_KEYS.ipFilter,
  directoryAccount: COLUMN_KEYS.directoryAccount,
  commentaire2: [COLUMN_KEYS.commentaire2, COLUMN_KEYS.comment],
  serialNumber: COLUMN_KEYS.serialNumber,
  etat: COLUMN_KEYS.etat,
  securityStatus: COLUMN_KEYS.securityStatus,
} as const;

export type EditableCatalogFieldId =
  keyof typeof EDITABLE_CATALOG_FIELD_COLUMN_NAMES;

export function isEditableCatalogFieldId(
  value: string,
): value is EditableCatalogFieldId {
  return value in EDITABLE_CATALOG_FIELD_COLUMN_NAMES;
}
