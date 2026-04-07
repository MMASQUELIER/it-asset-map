import {
  createZoneRecord,
  deleteZoneRecord,
  findZoneRecordById,
  listZoneRecords,
  updateZoneRecord,
} from "@/db/repositories/zonesRepository.ts";
import { findSectorRecordById } from "@/db/repositories/sectorsRepository.ts";
import {
  isCheckConstraintError,
  isDuplicateEntryError,
  isForeignKeyConstraintError,
} from "@/db/errors.ts";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/features/infrastructure-map/shared/errors.ts";
import {
  normalizeCreateZoneInput,
  normalizeUpdateZoneInput,
} from "@/features/infrastructure-map/zones/validation.ts";
import type {
  CreateZoneInput,
  UpdateZoneInput,
  ZoneDto,
} from "@/features/infrastructure-map/zones/types.ts";

export async function listZones(): Promise<ZoneDto[]> {
  return await listZoneRecords();
}

export async function createZone(input: CreateZoneInput): Promise<ZoneDto> {
  const normalizedInput = normalizeCreateZoneInput(input);
  await assertSectorExists(normalizedInput.sectorId);

  try {
    return await createZoneRecord(normalizedInput);
  } catch (error) {
    throw translateZoneDatabaseError(error);
  }
}

export async function updateZone(
  id: number,
  input: UpdateZoneInput,
): Promise<ZoneDto> {
  const normalizedInput = normalizeUpdateZoneInput(input);

  if (normalizedInput.sectorId !== undefined) {
    await assertSectorExists(normalizedInput.sectorId);
  }

  try {
    const updated = await updateZoneRecord(id, normalizedInput);

    if (!updated) {
      throw new NotFoundError("Zone not found.");
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    throw translateZoneDatabaseError(error);
  }

  const zone = await findZoneRecordById(id);

  if (zone === null) {
    throw new NotFoundError("Zone not found.");
  }

  return zone;
}

export async function deleteZone(id: number): Promise<void> {
  const deleted = await deleteZoneRecord(id);

  if (!deleted) {
    throw new NotFoundError("Zone not found.");
  }
}

async function assertSectorExists(sectorId: number): Promise<void> {
  const sector = await findSectorRecordById(sectorId);

  if (sector === null) {
    throw new NotFoundError("Sector not found.");
  }
}

function translateZoneDatabaseError(error: unknown): Error {
  if (isDuplicateEntryError(error)) {
    return new ConflictError("A zone with this code already exists.");
  }

  if (isForeignKeyConstraintError(error)) {
    return new ValidationError("The provided sector does not exist.");
  }

  if (isCheckConstraintError(error)) {
    return new ValidationError("The provided zone payload is invalid.");
  }

  return error as Error;
}
