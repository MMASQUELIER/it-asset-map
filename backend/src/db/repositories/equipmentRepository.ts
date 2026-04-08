import {
  getSqliteDatabase,
  readSqliteRow,
  readSqliteRows,
} from "@/db/sqlite.ts";
import type {
  CreateEquipmentInput,
  EquipmentDto,
  UpdateEquipmentInput,
} from "@/features/infrastructure-map/equipment/types.ts";

interface EquipmentRecord {
  equipmentDataId: number;
  id: string;
  x: number;
  y: number;
  zoneId: number | null;
}

const EQUIPMENT_SELECT_SQL = `
  SELECT
    id,
    equipment_data_id AS equipmentDataId,
    x,
    y,
    zone_id AS zoneId
  FROM equipment
`;

export async function listEquipmentRecords(): Promise<EquipmentDto[]> {
  const rows = readSqliteRows<EquipmentRecord>(
    `${EQUIPMENT_SELECT_SQL} ORDER BY id ASC`,
  );

  return rows.map(mapEquipmentRecord);
}

export async function findEquipmentRecordById(
  id: string,
): Promise<EquipmentDto | null> {
  const row = readSqliteRow<EquipmentRecord>(
    `${EQUIPMENT_SELECT_SQL} WHERE id = ?`,
    id,
  );

  return row === undefined ? null : mapEquipmentRecord(row);
}

export async function createEquipmentRecord(
  input: CreateEquipmentInput,
): Promise<EquipmentDto> {
  getSqliteDatabase().prepare(`
    INSERT INTO equipment (
      id,
      equipment_data_id,
      x,
      y,
      zone_id
    ) VALUES (?, ?, ?, ?, ?)
  `).run(
    input.id,
    input.equipmentDataId,
    input.x,
    input.y,
    input.zoneId,
  );

  return await findCreatedEquipmentRecord(input.id);
}

export async function updateEquipmentRecord(
  id: string,
  patch: UpdateEquipmentInput,
): Promise<boolean> {
  const assignments: string[] = [];
  const values: Array<number | null> = [];

  if (patch.x !== undefined) {
    assignments.push("x = ?");
    values.push(patch.x);
  }

  if (patch.y !== undefined) {
    assignments.push("y = ?");
    values.push(patch.y);
  }

  if (patch.zoneId !== undefined) {
    assignments.push("zone_id = ?");
    values.push(patch.zoneId);
  }

  const result = getSqliteDatabase().prepare(
    `UPDATE equipment SET ${assignments.join(", ")} WHERE id = ?`,
  ).run(...values, id);

  return result.changes > 0;
}

export async function deleteEquipmentRecord(id: string): Promise<boolean> {
  const result = getSqliteDatabase().prepare(
    "DELETE FROM equipment WHERE id = ?",
  ).run(id);

  return result.changes > 0;
}

function mapEquipmentRecord(row: EquipmentRecord): EquipmentDto {
  return {
    equipmentDataId: row.equipmentDataId,
    id: row.id,
    x: row.x,
    y: row.y,
    zoneId: row.zoneId,
  };
}

async function findCreatedEquipmentRecord(id: string): Promise<EquipmentDto> {
  const equipment = await findEquipmentRecordById(id);

  if (equipment === null) {
    throw new Error("Failed to load the equipment that was just created.");
  }

  return equipment;
}
