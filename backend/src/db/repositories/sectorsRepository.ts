import { getPrismaClient } from "@/db/prisma.ts";
import { isRecordNotFoundError } from "@/db/errors.ts";
import type { SectorDto } from "@/features/infrastructure-map/sectors/types.ts";

interface SectorRecord {
  id: bigint;
  name: string;
}

export async function listSectorRecords(): Promise<SectorDto[]> {
  const rows = await getPrismaClient().sector.findMany({
    orderBy: { name: "asc" },
  });

  return rows.map(mapSectorRecord);
}

export async function findSectorRecordById(
  id: number,
): Promise<SectorDto | null> {
  const row = await getPrismaClient().sector.findUnique({
    where: { id: BigInt(id) },
  });

  return row === null ? null : mapSectorRecord(row);
}

export async function findSectorRecordByName(
  name: string,
): Promise<SectorDto | null> {
  const row = await getPrismaClient().sector.findUnique({
    where: { name },
  });

  return row === null ? null : mapSectorRecord(row);
}

export async function createSectorRecord(
  name: string,
): Promise<SectorDto> {
  const row = await getPrismaClient().sector.create({
    data: { name },
  });

  return mapSectorRecord(row);
}

export async function updateSectorRecord(
  id: number,
  name: string,
): Promise<boolean> {
  try {
    await getPrismaClient().sector.update({
      data: { name },
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

export async function deleteSectorRecord(id: number): Promise<boolean> {
  try {
    await getPrismaClient().sector.delete({
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

function mapSectorRecord(row: SectorRecord): SectorDto {
  return {
    id: Number(row.id),
    name: row.name,
  };
}
