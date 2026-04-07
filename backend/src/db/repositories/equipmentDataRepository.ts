import { isRecordNotFoundError } from "@/db/errors.ts";
import { getPrismaClient, Prisma } from "@/db/prisma.ts";
import { normalizeEquipmentDataAliases } from "@/features/infrastructure-map/equipment-data/aliases.ts";
import { EQUIPMENT_DATA_FIELDS } from "@/features/infrastructure-map/equipment-data/types.ts";
import type {
  EquipmentDataCreateInput,
  EquipmentDataDto,
  EquipmentDataPatch,
} from "@/features/infrastructure-map/equipment-data/types.ts";

interface EquipmentDataRow {
  assetType: string | null;
  comment: string | null;
  connectedToSwitchName: string | null;
  connectedToSwitchPort: string | null;
  connectionType: string | null;
  contact: string | null;
  directoryAccount: string | null;
  equipmentId: string;
  floorLocation: string | null;
  gateway: string | null;
  hostname: string | null;
  id: bigint;
  idPort: string | null;
  ipAddress: string | null;
  ipFilter: string | null;
  lastInventoryDate: string | null;
  macAddress: string | null;
  manufacturer: string | null;
  manufacturingStationNames: string | null;
  memory: string | null;
  model: string | null;
  networkScope: string | null;
  newIpAddress: string | null;
  newPortAuto: string | null;
  oldIpAddress: string | null;
  operatingSystem: string | null;
  pinKey: string | null;
  processor: string | null;
  sap: string | null;
  secondaryComment: string | null;
  sector: string | null;
  securityStatus: string | null;
  serialNumber: string | null;
  site: string | null;
  status: string | null;
  storage: string | null;
  subnetMask: string | null;
  switchIpAddress: string | null;
  switchName: string | null;
  switchPort: string | null;
  ticketBrassage: string | null;
  vlan: string | null;
  vlanNew: string | null;
  wifiOrWiredConnection: string | null;
  zoneCode: string | null;
}

export async function listEquipmentDataRecords(): Promise<EquipmentDataDto[]> {
  const rows = await getPrismaClient().equipmentData.findMany({
    orderBy: { equipmentId: "asc" },
  });

  return rows.map(mapEquipmentDataRowToDto);
}

export async function findEquipmentDataRecordById(
  id: number,
): Promise<EquipmentDataDto | null> {
  const row = await getPrismaClient().equipmentData.findUnique({
    where: { id: BigInt(id) },
  });

  return row === null ? null : mapEquipmentDataRowToDto(row);
}

export async function createEquipmentDataRecord(
  input: EquipmentDataCreateInput,
): Promise<EquipmentDataDto> {
  const data = omitUndefinedValues(input) as Prisma.EquipmentDataCreateInput;
  const row = await getPrismaClient().equipmentData.create({ data });

  return mapEquipmentDataRowToDto(row);
}

export async function updateEquipmentDataRecord(
  id: number,
  patch: EquipmentDataPatch,
): Promise<boolean> {
  const data = buildEquipmentDataUpdateInput(patch);

  try {
    await getPrismaClient().equipmentData.update({
      data,
      where: { id: BigInt(id) },
    });
    return true;
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return false;
    }

    throw error;
  }
}

export async function deleteEquipmentDataRecord(id: number): Promise<boolean> {
  try {
    await getPrismaClient().equipmentData.delete({
      where: { id: BigInt(id) },
    });
    return true;
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return false;
    }

    throw error;
  }
}

function buildEquipmentDataUpdateInput(
  patch: EquipmentDataPatch,
): Prisma.EquipmentDataUpdateInput {
  const data: Record<string, string | null> = {};

  for (const field of EQUIPMENT_DATA_FIELDS) {
    if (!Object.hasOwn(patch, field)) {
      continue;
    }

    data[field] = patch[field] ?? null;
  }

  return data as Prisma.EquipmentDataUpdateInput;
}

function omitUndefinedValues<T extends Record<string, unknown>>(
  input: T,
): Record<string, unknown> {
  const filteredInput: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      filteredInput[key] = value;
    }
  }

  return filteredInput;
}

function mapEquipmentDataRowToDto(row: EquipmentDataRow): EquipmentDataDto {
  return normalizeEquipmentDataAliases({
    assetType: row.assetType ?? undefined,
    comment: row.comment ?? undefined,
    connectedToSwitchName: row.connectedToSwitchName ?? undefined,
    connectedToSwitchPort: row.connectedToSwitchPort ?? undefined,
    connectionType: row.connectionType ?? undefined,
    contact: row.contact ?? undefined,
    directoryAccount: row.directoryAccount ?? undefined,
    equipmentId: row.equipmentId,
    floorLocation: row.floorLocation ?? undefined,
    gateway: row.gateway ?? undefined,
    hostname: row.hostname ?? undefined,
    id: Number(row.id),
    idPort: row.idPort ?? undefined,
    ipAddress: row.ipAddress ?? undefined,
    ipFilter: row.ipFilter ?? undefined,
    lastInventoryDate: row.lastInventoryDate ?? undefined,
    macAddress: row.macAddress ?? undefined,
    manufacturer: row.manufacturer ?? undefined,
    manufacturingStationNames: row.manufacturingStationNames ?? undefined,
    memory: row.memory ?? undefined,
    model: row.model ?? undefined,
    networkScope: row.networkScope ?? undefined,
    newIpAddress: row.newIpAddress ?? undefined,
    newPortAuto: row.newPortAuto ?? undefined,
    oldIpAddress: row.oldIpAddress ?? undefined,
    operatingSystem: row.operatingSystem ?? undefined,
    pinKey: row.pinKey ?? undefined,
    processor: row.processor ?? undefined,
    sap: row.sap ?? undefined,
    secondaryComment: row.secondaryComment ?? undefined,
    sector: row.sector ?? undefined,
    securityStatus: row.securityStatus ?? undefined,
    serialNumber: row.serialNumber ?? undefined,
    site: row.site ?? undefined,
    status: row.status ?? undefined,
    storage: row.storage ?? undefined,
    subnetMask: row.subnetMask ?? undefined,
    switchIpAddress: row.switchIpAddress ?? undefined,
    switchName: row.switchName ?? undefined,
    switchPort: row.switchPort ?? undefined,
    ticketBrassage: row.ticketBrassage ?? undefined,
    vlan: row.vlan ?? undefined,
    vlanNew: row.vlanNew ?? undefined,
    wifiOrWiredConnection: row.wifiOrWiredConnection ?? undefined,
    zoneCode: row.zoneCode ?? undefined,
  });
}
