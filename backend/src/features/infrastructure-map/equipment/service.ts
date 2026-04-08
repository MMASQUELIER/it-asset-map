import {
  createEquipmentRecord,
  deleteEquipmentRecord,
  findEquipmentRecordById,
  listEquipmentRecords,
  updateEquipmentRecord,
} from "@/db/repositories/equipmentRepository.ts";
import {
  isDuplicateEntryError,
  isForeignKeyConstraintError,
} from "@/db/errors.ts";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/features/infrastructure-map/shared/errors.ts";
import type {
  EquipmentDto,
} from "@/features/infrastructure-map/equipment/types.ts";
import {
  assertZoneCompatibility,
  buildCreateEquipmentInput,
  findExistingEquipmentData,
  normalizeCreateEquipmentPayload,
  normalizeEquipmentPatch,
  syncEquipmentZoneContext,
} from "@/features/infrastructure-map/equipment/helpers.ts";

export async function listEquipment(): Promise<EquipmentDto[]> {
  return await listEquipmentRecords();
}

export async function createEquipment(payload: unknown): Promise<EquipmentDto> {
  const normalizedPayload = normalizeCreateEquipmentPayload(payload);
  const equipmentData = await findExistingEquipmentData(
    normalizedPayload.equipmentDataId,
  );

  await assertZoneCompatibility(equipmentData, normalizedPayload.zoneId ?? null);
  const input = buildCreateEquipmentInput(equipmentData, normalizedPayload);

  try {
    const equipment = await createEquipmentRecord(input);
    await syncEquipmentZoneContext(input.equipmentDataId, input.zoneId);
    return equipment;
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
  equipmentRecordId: string,
  payload: unknown,
): Promise<EquipmentDto> {
  const existingEquipment = await findEquipmentRecordById(equipmentRecordId);

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
    const updated = await updateEquipmentRecord(equipmentRecordId, patch);

    if (!updated) {
      throw new NotFoundError("Equipment not found.");
    }

    if (patch.zoneId !== undefined) {
      await syncEquipmentZoneContext(existingEquipment.equipmentDataId, nextZoneId);
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

  const equipment = await findEquipmentRecordById(equipmentRecordId);

  if (equipment === null) {
    throw new NotFoundError("Equipment not found.");
  }

  return equipment;
}

export async function deleteEquipment(equipmentRecordId: string): Promise<void> {
  const deleted = await deleteEquipmentRecord(equipmentRecordId);

  if (!deleted) {
    throw new NotFoundError("Equipment not found.");
  }
}
