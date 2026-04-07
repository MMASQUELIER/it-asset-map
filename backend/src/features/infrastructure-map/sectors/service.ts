import { isDuplicateEntryError, isForeignKeyConstraintError } from "@/db/errors.ts";
import {
  createSectorRecord,
  deleteSectorRecord,
  listSectorRecords,
  findSectorRecordById,
  findSectorRecordByName,
  updateSectorRecord,
} from "@/db/repositories/sectorsRepository.ts";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/features/infrastructure-map/shared/errors.ts";
import type {
  SectorDto,
  SectorMutationInput,
} from "@/features/infrastructure-map/sectors/types.ts";

export async function listSectors(): Promise<SectorDto[]> {
  return await listSectorRecords();
}

export async function createSector(
  input: SectorMutationInput,
): Promise<SectorDto> {
  const normalizedName = normalizeSectorName(input.name);

  try {
    return await createSectorRecord(normalizedName);
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      throw new ConflictError("A sector with this name already exists.");
    }

    throw error;
  }
}

export async function updateSector(
  id: number,
  input: SectorMutationInput,
): Promise<SectorDto> {
  const normalizedName = normalizeSectorName(input.name);

  try {
    const updated = await updateSectorRecord(id, normalizedName);

    if (!updated) {
      throw new NotFoundError("Sector not found.");
    }
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      throw new ConflictError("A sector with this name already exists.");
    }

    throw error;
  }

  const sector = await findSectorRecordById(id);

  if (sector === null) {
    throw new NotFoundError("Sector not found.");
  }

  return sector;
}

export async function deleteSector(id: number): Promise<void> {
  try {
    const deleted = await deleteSectorRecord(id);

    if (!deleted) {
      throw new NotFoundError("Sector not found.");
    }
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      throw new ConflictError(
        "Cannot delete a sector while zones are still assigned to it.",
      );
    }

    throw error;
  }
}

export async function ensureSectorExists(name: string): Promise<SectorDto> {
  const normalizedName = normalizeSectorName(name);
  const existingSector = await findSectorRecordByName(normalizedName);

  if (existingSector !== null) {
    return existingSector;
  }

  return await createSectorRecord(normalizedName);
}

function normalizeSectorName(name: string): string {
  const normalizedName = name.trim();

  if (normalizedName.length === 0) {
    throw new ValidationError("Sector name is required.");
  }

  return normalizedName;
}
