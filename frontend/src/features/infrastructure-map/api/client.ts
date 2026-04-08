import type {
  EditablePcFieldId,
  EquipmentDataRecord,
  EquipmentRecord,
  SectorRecord,
  ZoneRecord,
} from "@/features/infrastructure-map/model/types";
import { normalizeErrorText } from "@/features/infrastructure-map/shared/errorMessages";

const API_BASE_PATH = "/api";

export interface CreateZonePayload {
  code: string;
  name?: string;
  sectorId: number;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}

export interface UpdateZonePayload {
  code?: string;
  name?: string | null;
  sectorId?: number;
  xMax?: number;
  xMin?: number;
  yMax?: number;
  yMin?: number;
}

export interface CreateEquipmentPayload {
  equipmentDataId: number;
  x: number;
  y: number;
  zoneId: number | null;
}

export interface UpdateEquipmentPayload {
  x?: number;
  y?: number;
  zoneId?: number | null;
}

export async function listSectors(): Promise<SectorRecord[]> {
  return await requestJson<SectorRecord[]>("/sectors");
}

export async function createSector(name: string): Promise<SectorRecord> {
  return await requestJson<SectorRecord>("/sectors", {
    body: JSON.stringify({ name }),
    method: "POST",
  });
}

export async function listZones(): Promise<ZoneRecord[]> {
  return await requestJson<ZoneRecord[]>("/zones");
}

export async function createZone(
  payload: CreateZonePayload,
): Promise<ZoneRecord> {
  return await requestJson<ZoneRecord>("/zones", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export async function updateZone(
  zoneId: number,
  payload: UpdateZonePayload,
): Promise<ZoneRecord> {
  return await requestJson<ZoneRecord>(`/zones/${zoneId}`, {
    body: JSON.stringify(payload),
    method: "PATCH",
  });
}

export async function deleteZone(zoneId: number): Promise<void> {
  await requestJson<void>(`/zones/${zoneId}`, {
    method: "DELETE",
  });
}

export async function listEquipmentData(): Promise<EquipmentDataRecord[]> {
  return await requestJson<EquipmentDataRecord[]>("/equipment-data");
}

export async function updateEquipmentDataField(
  equipmentDataId: number,
  fieldId: EditablePcFieldId,
  value: string,
): Promise<EquipmentDataRecord> {
  return await requestJson<EquipmentDataRecord>(
    `/equipment-data/${equipmentDataId}`,
    {
      body: JSON.stringify({
        [fieldId]: value,
      }),
      method: "PATCH",
    },
  );
}

export async function listEquipment(): Promise<EquipmentRecord[]> {
  return await requestJson<EquipmentRecord[]>("/equipment");
}

export async function createEquipment(
  payload: CreateEquipmentPayload,
): Promise<EquipmentRecord> {
  return await requestJson<EquipmentRecord>("/equipment", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export async function updateEquipment(
  equipmentRecordId: string,
  payload: UpdateEquipmentPayload,
): Promise<EquipmentRecord> {
  return await requestJson<EquipmentRecord>(`/equipment/${equipmentRecordId}`, {
    body: JSON.stringify(payload),
    method: "PATCH",
  });
}

export async function deleteEquipment(equipmentRecordId: string): Promise<void> {
  await requestJson<void>(
    `/equipment/${encodeURIComponent(equipmentRecordId)}`,
    {
      method: "DELETE",
    },
  );
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_PATH}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json() as T;
}

async function readErrorMessage(response: Response): Promise<string> {
  const fallbackMessage = getRequestFallbackMessage(response.status);

  try {
    const payload = await response.json() as { error?: string };
    return normalizeErrorText(payload.error, fallbackMessage);
  } catch {
    return fallbackMessage;
  }
}

function getRequestFallbackMessage(status: number): string {
  if (status >= 500) {
    return "Le serveur a rencontre une erreur.";
  }

  return normalizeErrorText(`Request failed with status ${status}.`);
}
