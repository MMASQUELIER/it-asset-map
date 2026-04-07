import { isRecordNotFoundError } from "@/db/errors.ts";
import { getPrismaClient, Prisma } from "@/db/prisma.ts";
import type {
  CreateEquipmentInput,
  EquipmentDto,
  UpdateEquipmentInput,
} from "@/features/infrastructure-map/equipment/types.ts";

interface EquipmentRecord {
  equipmentDataId: bigint;
  id: string;
  x: number;
  y: number;
  zoneId: bigint | null;
}

export async function listEquipmentRecords(): Promise<EquipmentDto[]> {
  const rows = await getPrismaClient().equipment.findMany({
    orderBy: { id: "asc" },
  });

  return rows.map(mapEquipmentRecord);
}

export async function findEquipmentRecordById(
  id: string,
): Promise<EquipmentDto | null> {
  const row = await getPrismaClient().equipment.findUnique({
    where: { id },
  });

  return row === null ? null : mapEquipmentRecord(row);
}

export async function createEquipmentRecord(
  input: CreateEquipmentInput,
): Promise<EquipmentDto> {
  const row = await getPrismaClient().equipment.create({
    data: {
      equipmentDataId: BigInt(input.equipmentDataId),
      id: input.id,
      x: input.x,
      y: input.y,
      zoneId: input.zoneId === null ? null : BigInt(input.zoneId),
    } satisfies Prisma.EquipmentUncheckedCreateInput,
  });

  return mapEquipmentRecord(row);
}

export async function updateEquipmentRecord(
  id: string,
  patch: UpdateEquipmentInput,
): Promise<boolean> {
  const data: Prisma.EquipmentUncheckedUpdateInput = {};

  if (patch.x !== undefined) {
    data.x = patch.x;
  }

  if (patch.y !== undefined) {
    data.y = patch.y;
  }

  if (patch.zoneId !== undefined) {
    data.zoneId = patch.zoneId === null ? null : BigInt(patch.zoneId);
  }

  try {
    await getPrismaClient().equipment.update({
      data,
      where: { id },
    });
    return true;
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return false;
    }

    throw error;
  }
}

export async function deleteEquipmentRecord(id: string): Promise<boolean> {
  try {
    await getPrismaClient().equipment.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return false;
    }

    throw error;
  }
}

function mapEquipmentRecord(row: EquipmentRecord): EquipmentDto {
  return {
    equipmentDataId: Number(row.equipmentDataId),
    id: row.id,
    x: row.x,
    y: row.y,
    zoneId: row.zoneId === null ? null : Number(row.zoneId),
  };
}
