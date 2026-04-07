import { isRecordNotFoundError } from "@/db/errors.ts";
import { getPrismaClient, Prisma } from "@/db/prisma.ts";
import type {
  CreateZoneInput,
  UpdateZoneInput,
  ZoneDto,
} from "@/features/infrastructure-map/zones/types.ts";

interface ZoneRecord {
  code: string;
  id: bigint;
  name: string | null;
  sectorId: bigint;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}

export async function listZoneRecords(): Promise<ZoneDto[]> {
  const rows = await getPrismaClient().zone.findMany({
    orderBy: [{ code: "asc" }, { id: "asc" }],
  });

  return rows.map(mapZoneRecord);
}

export async function findZoneRecordById(id: number): Promise<ZoneDto | null> {
  const row = await getPrismaClient().zone.findUnique({
    where: { id: BigInt(id) },
  });

  return row === null ? null : mapZoneRecord(row);
}

export async function createZoneRecord(
  input: CreateZoneInput,
): Promise<ZoneDto> {
  const row = await getPrismaClient().zone.create({
    data: {
      code: input.code,
      name: input.name ?? null,
      sectorId: BigInt(input.sectorId),
      xMax: input.xMax,
      xMin: input.xMin,
      yMax: input.yMax,
      yMin: input.yMin,
    } satisfies Prisma.ZoneUncheckedCreateInput,
  });

  return mapZoneRecord(row);
}

export async function updateZoneRecord(
  id: number,
  patch: UpdateZoneInput,
): Promise<boolean> {
  const data: Prisma.ZoneUncheckedUpdateInput = {};

  if (patch.sectorId !== undefined) {
    data.sectorId = BigInt(patch.sectorId);
  }

  if (patch.code !== undefined) {
    data.code = patch.code;
  }

  if (patch.name !== undefined) {
    data.name = patch.name ?? null;
  }

  if (patch.xMin !== undefined) {
    data.xMin = patch.xMin;
  }

  if (patch.yMin !== undefined) {
    data.yMin = patch.yMin;
  }

  if (patch.xMax !== undefined) {
    data.xMax = patch.xMax;
  }

  if (patch.yMax !== undefined) {
    data.yMax = patch.yMax;
  }

  try {
    await getPrismaClient().zone.update({
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

export async function deleteZoneRecord(id: number): Promise<boolean> {
  try {
    await getPrismaClient().zone.delete({
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

function mapZoneRecord(row: ZoneRecord): ZoneDto {
  return {
    code: row.code,
    id: Number(row.id),
    name: row.name ?? undefined,
    sectorId: Number(row.sectorId),
    xMax: row.xMax,
    xMin: row.xMin,
    yMax: row.yMax,
    yMin: row.yMin,
  };
}
