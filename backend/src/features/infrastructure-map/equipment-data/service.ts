import {
  createEquipmentDataRecord,
  deleteEquipmentDataRecord,
  findEquipmentDataRecordById,
  listEquipmentDataRecords,
  updateEquipmentDataRecord,
} from "@/db/repositories/equipmentDataRepository.ts";
import { isDuplicateEntryError } from "@/db/errors.ts";
import {
  ConflictError,
  NotFoundError,
} from "@/features/infrastructure-map/shared/errors.ts";
import {
  normalizeCreateEquipmentDataInput,
  normalizeEquipmentDataPatch,
} from "@/features/infrastructure-map/equipment-data/validation.ts";
import type {
  EquipmentDataDto,
} from "@/features/infrastructure-map/equipment-data/types.ts";

export async function listEquipmentData(): Promise<EquipmentDataDto[]> {
  return await listEquipmentDataRecords();
}

export async function createEquipmentData(
  payload: unknown,
): Promise<EquipmentDataDto> {
  const input = normalizeCreateEquipmentDataInput(payload);

  try {
    return await createEquipmentDataRecord(input);
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      throw new ConflictError(
        "An equipment data record with this equipmentId already exists.",
      );
    }

    throw error;
  }
}

export async function updateEquipmentData(
  id: number,
  payload: unknown,
): Promise<EquipmentDataDto> {
  const patch = normalizeEquipmentDataPatch(payload);

  try {
    const updated = await updateEquipmentDataRecord(id, patch);

    if (!updated) {
      throw new NotFoundError("Equipment data not found.");
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    if (isDuplicateEntryError(error)) {
      throw new ConflictError(
        "An equipment data record with this equipmentId already exists.",
      );
    }

    throw error;
  }

  const equipmentData = await findEquipmentDataRecordById(id);

  if (equipmentData === null) {
    throw new NotFoundError("Equipment data not found.");
  }

  return equipmentData;
}

export async function deleteEquipmentData(id: number): Promise<void> {
  const deleted = await deleteEquipmentDataRecord(id);

  if (!deleted) {
    throw new NotFoundError("Equipment data not found.");
  }
}
