import {
  createEquipmentRecord,
  deleteEquipmentRecord,
  findEquipmentRecordById,
  listEquipmentRecords,
  updateEquipmentRecord,
} from "@/db/repositories/equipmentRepository.ts";
import { findEquipmentDataRecordById } from "@/db/repositories/equipmentDataRepository.ts";
import { findZoneRecordById } from "@/db/repositories/zonesRepository.ts";
import { findSectorRecordById } from "@/db/repositories/sectorsRepository.ts";
import {
  isDuplicateEntryError,
  isForeignKeyConstraintError,
} from "@/db/errors.ts";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/features/infrastructure-map/shared/errors.ts";
import { getResolvedEquipmentLocation } from "@/features/infrastructure-map/equipment-data/aliases.ts";
import type {
  CreateEquipmentInput,
  EquipmentDto,
  UpdateEquipmentInput,
} from "@/features/infrastructure-map/equipment/types.ts";
import type { EquipmentDataDto } from "@/features/infrastructure-map/equipment-data/types.ts";

interface CreateEquipmentPayload {
  equipmentDataId: number;
  x: number;
  y: number;
  zoneId?: number | null;
}

export async function listEquipment(): Promise<EquipmentDto[]> {
  return await listEquipmentRecords();
}

export async function createEquipment(payload: unknown): Promise<EquipmentDto> {
  const normalizedPayload = normalizeCreateEquipmentPayload(payload);
  const equipmentData = await findExistingEquipmentData(
    normalizedPayload.equipmentDataId,
  );

  await assertZoneCompatibility(equipmentData, normalizedPayload.zoneId ?? null);

  const input: CreateEquipmentInput = {
    equipmentDataId: normalizedPayload.equipmentDataId,
    id: equipmentData.equipmentId,
    x: normalizedPayload.x,
    y: normalizedPayload.y,
    zoneId: normalizedPayload.zoneId ?? null,
  };

  try {
    return await createEquipmentRecord(input);
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      throw new ConflictError(
        "This equipment data record is already placed on the map.",
      );
    }

    if (isForeignKeyConstraintError(error)) {
      throw new ValidationError("The provided zone does not exist.");
    }

    throw error;
  }
}

export async function updateEquipment(
  equipmentId: string,
  payload: unknown,
): Promise<EquipmentDto> {
  const existingEquipment = await findEquipmentRecordById(equipmentId);

  if (existingEquipment === null) {
    throw new NotFoundError("Equipment not found.");
  }

  const patch = normalizeEquipmentPatch(payload);
  const equipmentData = await findExistingEquipmentData(existingEquipment.equipmentDataId);
  const nextZoneId = patch.zoneId === undefined
    ? existingEquipment.zoneId
    : patch.zoneId;

  await assertZoneCompatibility(equipmentData, nextZoneId);

  try {
    const updated = await updateEquipmentRecord(equipmentId, patch);

    if (!updated) {
      throw new NotFoundError("Equipment not found.");
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    if (isForeignKeyConstraintError(error)) {
      throw new ValidationError("The provided zone does not exist.");
    }

    throw error;
  }

  const equipment = await findEquipmentRecordById(equipmentId);

  if (equipment === null) {
    throw new NotFoundError("Equipment not found.");
  }

  return equipment;
}

export async function deleteEquipment(equipmentId: string): Promise<void> {
  const deleted = await deleteEquipmentRecord(equipmentId);

  if (!deleted) {
    throw new NotFoundError("Equipment not found.");
  }
}

function normalizeCreateEquipmentPayload(payload: unknown): CreateEquipmentPayload {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new ValidationError("Equipment payload must be an object.");
  }

  const data = payload as Record<string, unknown>;

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

function normalizeEquipmentPatch(payload: unknown): UpdateEquipmentInput {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new ValidationError("Equipment payload must be an object.");
  }

  const data = payload as Record<string, unknown>;
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

async function assertZoneCompatibility(
  equipmentData: EquipmentDataDto,
  zoneId: number | null,
): Promise<void> {
  if (zoneId === null) {
    return;
  }

  const zone = await findZoneRecordById(zoneId);

  if (zone === null) {
    throw new NotFoundError("Zone not found.");
  }

  const sector = await findSectorRecordById(zone.sectorId);

  if (sector === null) {
    throw new NotFoundError("Sector not found.");
  }

  const equipmentSector = normalizeTextForComparison(
    getResolvedEquipmentLocation(equipmentData),
  );
  const zoneSector = normalizeTextForComparison(sector.name);

  if (equipmentSector.length === 0 || zoneSector.length === 0) {
    return;
  }

  if (equipmentSector !== zoneSector) {
    throw new ConflictError(
      "This equipment cannot be assigned to a zone from a different sector.",
    );
  }
}

async function findExistingEquipmentData(
  equipmentDataId: number,
): Promise<EquipmentDataDto> {
  const equipmentData = await findEquipmentDataRecordById(equipmentDataId);

  if (equipmentData === null) {
    throw new NotFoundError("Equipment data not found.");
  }

  return equipmentData;
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
  if (value === undefined) {
    return "";
  }

  return value.trim().toUpperCase();
}
