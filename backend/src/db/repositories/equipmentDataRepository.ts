import {
  getSqliteDatabase,
  readSqliteRow,
  readSqliteRows,
} from "@/db/sqlite.ts";
import { normalizeEquipmentDataAliases } from "@/features/infrastructure-map/equipment-data/aliases.ts";
import {
  EQUIPMENT_DATA_COLUMN_BY_FIELD,
  EQUIPMENT_DATA_FIELDS,
} from "@/features/infrastructure-map/equipment-data/types.ts";
import type {
  EquipmentDataCreateInput,
  EquipmentDataField,
  EquipmentDataDto,
  EquipmentDataPatch,
} from "@/features/infrastructure-map/equipment-data/types.ts";

type EquipmentDataRow = {
  id: number;
} & {
  [Field in EquipmentDataField]: string | null;
};

const EQUIPMENT_DATA_SELECT_LIST = [
  "id",
  ...EQUIPMENT_DATA_FIELDS.map((field) =>
    `${EQUIPMENT_DATA_COLUMN_BY_FIELD[field]} AS ${field}`
  ),
].join(", ");
const EQUIPMENT_DATA_SELECT_SQL = `
  SELECT ${EQUIPMENT_DATA_SELECT_LIST}
  FROM equipment_data
`;

export async function listEquipmentDataRecords(): Promise<EquipmentDataDto[]> {
  const rows = readSqliteRows<EquipmentDataRow>(
    `${EQUIPMENT_DATA_SELECT_SQL} ORDER BY equipment_id ASC`,
  );

  return rows.map(mapEquipmentDataRowToDto);
}

export async function findEquipmentDataRecordById(
  id: number,
): Promise<EquipmentDataDto | null> {
  const row = readSqliteRow<EquipmentDataRow>(
    `${EQUIPMENT_DATA_SELECT_SQL} WHERE id = ?`,
    id,
  );

  return row === undefined ? null : mapEquipmentDataRowToDto(row);
}

export async function createEquipmentDataRecord(
  input: EquipmentDataCreateInput,
): Promise<EquipmentDataDto> {
  const { columns, values } = buildInsertDefinition(input);
  const placeholders = columns.map(() => "?").join(", ");
  const result = getSqliteDatabase().prepare(
    `INSERT INTO equipment_data (${columns.join(", ")}) VALUES (${placeholders})`,
  ).run(...values);

  return await findCreatedEquipmentDataRecord(Number(result.lastInsertRowid));
}

export async function updateEquipmentDataRecord(
  id: number,
  patch: EquipmentDataPatch,
): Promise<boolean> {
  const { assignments, values } = buildUpdateDefinition(patch);
  const result = getSqliteDatabase().prepare(
    `UPDATE equipment_data SET ${assignments.join(", ")} WHERE id = ?`,
  ).run(...values, id);

  return result.changes > 0;
}

export async function deleteEquipmentDataRecord(id: number): Promise<boolean> {
  const result = getSqliteDatabase().prepare(
    "DELETE FROM equipment_data WHERE id = ?",
  ).run(id);

  return result.changes > 0;
}

function buildInsertDefinition(
  input: EquipmentDataCreateInput,
): { columns: string[]; values: string[] } {
  const columns: string[] = [];
  const values: string[] = [];

  for (const field of EQUIPMENT_DATA_FIELDS) {
    const value = input[field];

    if (value === undefined) {
      continue;
    }

    columns.push(EQUIPMENT_DATA_COLUMN_BY_FIELD[field]);
    values.push(value);
  }

  return { columns, values };
}

function buildUpdateDefinition(
  patch: EquipmentDataPatch,
): {
  assignments: string[];
  values: Array<string | null>;
} {
  const assignments: string[] = [];
  const values: Array<string | null> = [];

  for (const field of EQUIPMENT_DATA_FIELDS) {
    if (!Object.hasOwn(patch, field)) {
      continue;
    }

    assignments.push(`${EQUIPMENT_DATA_COLUMN_BY_FIELD[field]} = ?`);
    values.push(patch[field] ?? null);
  }

  return { assignments, values };
}

function mapEquipmentDataRowToDto(row: EquipmentDataRow): EquipmentDataDto {
  const equipmentData: EquipmentDataDto = {
    equipmentId: row.equipmentId ?? "",
    id: row.id,
  };

  for (const field of EQUIPMENT_DATA_FIELDS) {
    if (field === "equipmentId") {
      continue;
    }

    const value = row[field];

    if (value !== null) {
      equipmentData[field] = value;
    }
  }

  return normalizeEquipmentDataAliases(equipmentData);
}

async function findCreatedEquipmentDataRecord(
  id: number,
): Promise<EquipmentDataDto> {
  const equipmentData = await findEquipmentDataRecordById(id);

  if (equipmentData === null) {
    throw new Error(
      "Failed to load the equipment data record that was just created.",
    );
  }

  return equipmentData;
}
