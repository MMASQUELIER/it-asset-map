import { COLUMN_KEYS } from "@/features/infrastructure-map/catalog/lib/columns.ts";
import { readCellText, readMeaningfulCell } from "@/features/infrastructure-map/catalog/lib/cellReaders.ts";
import { buildExcelIssues } from "@/features/infrastructure-map/catalog/lib/excelIssues.ts";
import { buildTechnicalLocationFields } from "@/features/infrastructure-map/catalog/lib/locationFields.ts";
import type {
  BackendAssetRecord,
  PcTechnicalDetailsDto,
} from "@/features/infrastructure-map/catalog/types.ts";

export function mapAssetToTechnicalDetails(
  asset: BackendAssetRecord,
  sectorColumnName: string,
): PcTechnicalDetailsDto {
  return {
    excelIssues: buildExcelIssues(asset, sectorColumnName),
    contact: readMeaningfulCell(asset[COLUMN_KEYS.collaborator]) ?? undefined,
    pinKey: readMeaningfulCell(asset[COLUMN_KEYS.pinKey]) ?? undefined,
    ...buildTechnicalLocationFields(asset, sectorColumnName),
    prodsched: readCellText(asset[COLUMN_KEYS.prodsched]),
    lastInventoryDate:
      readMeaningfulCell(asset[COLUMN_KEYS.lastInventoryDate]) ?? undefined,
    assetType: readMeaningfulCell(asset[COLUMN_KEYS.assetType]) ?? undefined,
    manufacturer:
      readMeaningfulCell(asset[COLUMN_KEYS.manufacturer]) ?? undefined,
    model: readMeaningfulCell(asset[COLUMN_KEYS.model]) ?? undefined,
    sap: readMeaningfulCell(asset[COLUMN_KEYS.sap]) ?? undefined,
    hostname: readMeaningfulCell(asset[COLUMN_KEYS.hostname]) ?? undefined,
    operatingSystem:
      readMeaningfulCell(asset[COLUMN_KEYS.operatingSystem]) ?? undefined,
    processor: undefined,
    memory: undefined,
    storage: readMeaningfulCell(asset[COLUMN_KEYS.storage]) ?? undefined,
    ipAddress: readMeaningfulCell(asset[COLUMN_KEYS.ipAddress]) ?? undefined,
    oldIpAddress: readMeaningfulCell(asset[COLUMN_KEYS.oldIpAddress]) ?? undefined,
    newIpAddress: readMeaningfulCell(asset[COLUMN_KEYS.newIpAddress]) ?? undefined,
    subnetMask: readMeaningfulCell(asset[COLUMN_KEYS.subnetMask]) ?? undefined,
    macAddress: readMeaningfulCell(asset[COLUMN_KEYS.macAddress]) ?? undefined,
    vlan: readMeaningfulCell(asset[COLUMN_KEYS.vlan]) ?? undefined,
    vlanNew: readMeaningfulCell(asset[COLUMN_KEYS.vlanNew]) ?? undefined,
    networkScope: readMeaningfulCell(asset[COLUMN_KEYS.networkScope]) ?? undefined,
    gateway: readMeaningfulCell(asset[COLUMN_KEYS.gateway]) ?? undefined,
    idPort: readMeaningfulCell(asset[COLUMN_KEYS.idPort]) ?? undefined,
    switchPort: readMeaningfulCell(asset[COLUMN_KEYS.newPortAuto]) ?? undefined,
    newPortAuto: readMeaningfulCell(asset[COLUMN_KEYS.newPortAuto]) ?? undefined,
    switchName: readMeaningfulCell(asset[COLUMN_KEYS.switchName]) ?? undefined,
    connectedToSwitchName:
      readMeaningfulCell(asset[COLUMN_KEYS.connectedToSwitchName]) ?? undefined,
    switchIpAddress:
      readMeaningfulCell(asset[COLUMN_KEYS.switchIpAddress]) ?? undefined,
    connectedToSwitchPort:
      readMeaningfulCell(asset[COLUMN_KEYS.connectedToSwitchPort]) ?? undefined,
    connectionType:
      readMeaningfulCell(asset[COLUMN_KEYS.wifiOrWiredConnection]) ?? undefined,
    wifiOrWiredConnection:
      readMeaningfulCell(asset[COLUMN_KEYS.wifiOrWiredConnection]) ?? undefined,
    ticketBrassage:
      readMeaningfulCell(asset[COLUMN_KEYS.ticketBrassage]) ?? undefined,
    ipFilter: readMeaningfulCell(asset[COLUMN_KEYS.ipFilter]) ?? undefined,
    directoryAccount:
      readMeaningfulCell(asset[COLUMN_KEYS.directoryAccount]) ?? undefined,
    comment: readMeaningfulCell(asset[COLUMN_KEYS.comment]) ?? undefined,
    commentaire2: readMeaningfulCell(asset[COLUMN_KEYS.commentaire2]) ?? undefined,
    serialNumber: readMeaningfulCell(asset[COLUMN_KEYS.serialNumber]) ?? undefined,
    etat: readMeaningfulCell(asset[COLUMN_KEYS.etat]) ?? undefined,
    securityStatus:
      readMeaningfulCell(asset[COLUMN_KEYS.securityStatus]) ?? undefined,
  };
}
