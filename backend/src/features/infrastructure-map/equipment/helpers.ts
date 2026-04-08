import {
  findEquipmentDataRecordById,
  syncEquipmentDataLocationById,
  syncEquipmentDataProdsheetById,
} from "@/db/repositories/equipmentDataRepository.ts";
import { findSectorRecordById } from "@/db/repositories/sectorsRepository.ts";
import { findZoneRecordById } from "@/db/repositories/zonesRepository.ts";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/features/infrastructure-map/shared/errors.ts";
import { getResolvedEquipmentLocation } from "@/features/infrastructure-map/equipment-data/aliases.ts";
import type { EquipmentDataDto } from "@/features/infrastructure-map/equipment-data/types.ts";
import type {
  CreateEquipmentInput,
  UpdateEquipmentInput,
} from "@/features/infrastructure-map/equipment/types.ts";

export interface CreateEquipmentPayload {
  equipmentDataId: number;
  x: number;
  y: number;
  zoneId?: number | null;
}

export function normalizeCreateEquipmentPayload(
  payload: unknown,
): CreateEquipmentPayload {
  const data = ensureEquipmentPayloadRecord(payload);

  return {
    equipmentDataId: normalizePositiveInteger(
      data.equipmentDataId,
      "equipmentDataId",
    ),
    x: normalizeInteger(data.x, "x"),
    y: normalizeInteger(data.y, "y"),
    zoneId: normalizeNullablePositiveInteger(data.zoneId, "zoneId"),
  };
}

export function normalizeEquipmentPatch(payload: unknown): UpdateEquipmentInput {
  const data = ensureEquipmentPayloadRecord(payload);
  const patch: UpdateEquipmentInput = {};

  if (Object.hasOwn(data, "x")) {
    patch.x = normalizeInteger(data.x, "x");
  }

  if (Object.hasOwn(data, "y")) {
    patch.y = normalizeInteger(data.y, "y");
  }

  if (Object.hasOwn(data, "zoneId")) {
    patch.zoneId = normalizeNullablePositiveInteger(data.zoneId, "zoneId");
  }

  if (Object.keys(patch).length === 0) {
    throw new ValidationError("At least one equipment field must be provided.");
  }

  return patch;
}

export async function assertZoneCompatibility(
  equipmentData: EquipmentDataDto,
  zoneId: number | null,
): Promise<void> {
  if (zoneId === null) {
    return;
  }

  const { sectorName } = await getZoneContext(zoneId);
  const equipmentSector = normalizeTextForComparison(
    getResolvedEquipmentLocation(equipmentData),
  );
  const zoneSector = normalizeTextForComparison(sectorName);

  if (equipmentSector.length === 0 || zoneSector.length === 0) {
    return;
  }

  if (equipmentSector !== zoneSector) {
    throw new ConflictError(
      "This equipment cannot be assigned to a zone from a different sector.",
    );
  }
}

export async function findExistingEquipmentData(
  equipmentDataId: number,
): Promise<EquipmentDataDto> {
  const equipmentData = await findEquipmentDataRecordById(equipmentDataId);

  if (equipmentData === null) {
    throw new NotFoundError("Equipment data not found.");
  }

  return equipmentData;
}

export async function syncEquipmentZoneContext(
  equipmentDataId: number,
  zoneId: number | null,
): Promise<void> {
  if (zoneId === null) {
    return;
  }

  const { zoneCode, sectorName } = await getZoneContext(zoneId);
  await syncEquipmentDataProdsheetById(equipmentDataId, zoneCode);
  await syncEquipmentDataLocationById(equipmentDataId, sectorName);
}

export function buildCreateEquipmentInput(
  equipmentData: EquipmentDataDto,
  payload: CreateEquipmentPayload,
): CreateEquipmentInput {
  return {
    equipmentDataId: payload.equipmentDataId,
    id: String(equipmentData.id),
    x: payload.x,
    y: payload.y,
    zoneId: payload.zoneId ?? null,
  };
}

function ensureEquipmentPayloadRecord(
  payload: unknown,
): Record<string, unknown> {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new ValidationError("Equipment payload must be an object.");
  }

  return payload as Record<string, unknown>;
}

async function getZoneContext(
  zoneId: number,
): Promise<{ sectorName: string; zoneCode: string }> {
  const zone = await findZoneRecordById(zoneId);

  if (zone === null) {
    throw new NotFoundError("Zone not found.");
  }

  const sector = await findSectorRecordById(zone.sectorId);

  if (sector === null) {
    throw new NotFoundError("Sector not found.");
  }

  return {
    sectorName: sector.name,
    zoneCode: zone.code,
  };
}

function normalizeInteger(value: unknown, fieldName: string): number {
  if (!Number.isInteger(value)) {
    throw new ValidationError(`Field "${fieldName}" must be an integer.`);
  }

  return value as number;
}

function normalizePositiveInteger(value: unknown, fieldName: string): number {
  const normalizedValue = normalizeInteger(value, fieldName);

  if (normalizedValue <= 0) {
    throw new ValidationError(
      `Field "${fieldName}" must be a positive integer.`,
    );
  }

  return normalizedValue;
}

function normalizeNullablePositiveInteger(
  value: unknown,
  fieldName: string,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return normalizePositiveInteger(value, fieldName);
}

function normalizeTextForComparison(value: string | undefined): string {
  return value?.trim().toUpperCase() ?? "";
}
