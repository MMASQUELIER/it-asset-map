import {
  getSqliteDatabase,
  readSqliteRow,
  readSqliteRows,
} from "@/db/sqlite.ts";
import type {
  CreateZoneInput,
  UpdateZoneInput,
  ZoneDto,
} from "@/features/infrastructure-map/zones/types.ts";

interface ZoneRecord {
  code: string;
  id: number;
  name: string | null;
  sectorId: number;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}

const ZONE_SELECT_SQL = `
  SELECT
    id,
    sector_id AS sectorId,
    code,
    name,
    x_min AS xMin,
    y_min AS yMin,
    x_max AS xMax,
    y_max AS yMax
  FROM zones
`;

export async function listZoneRecords(): Promise<ZoneDto[]> {
  const rows = readSqliteRows<ZoneRecord>(
    `${ZONE_SELECT_SQL} ORDER BY code ASC, id ASC`,
  );

  return rows.map(mapZoneRecord);
}

export async function findZoneRecordById(id: number): Promise<ZoneDto | null> {
  const row = readSqliteRow<ZoneRecord>(`${ZONE_SELECT_SQL} WHERE id = ?`, id);

  return row === undefined ? null : mapZoneRecord(row);
}

export async function createZoneRecord(
  input: CreateZoneInput,
): Promise<ZoneDto> {
  const result = getSqliteDatabase().prepare(`
    INSERT INTO zones (
      sector_id,
      code,
      name,
      x_min,
      y_min,
      x_max,
      y_max
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.sectorId,
    input.code,
    input.name ?? null,
    input.xMin,
    input.yMin,
    input.xMax,
    input.yMax,
  );

  return await findCreatedZoneRecord(Number(result.lastInsertRowid));
}

export async function updateZoneRecord(
  id: number,
  patch: UpdateZoneInput,
): Promise<boolean> {
  const assignments: string[] = [];
  const values: Array<number | string | null> = [];

  if (patch.sectorId !== undefined) {
    assignments.push("sector_id = ?");
    values.push(patch.sectorId);
  }

  if (patch.code !== undefined) {
    assignments.push("code = ?");
    values.push(patch.code);
  }

  if (patch.name !== undefined) {
    assignments.push("name = ?");
    values.push(patch.name ?? null);
  }

  if (patch.xMin !== undefined) {
    assignments.push("x_min = ?");
    values.push(patch.xMin);
  }

  if (patch.yMin !== undefined) {
    assignments.push("y_min = ?");
    values.push(patch.yMin);
  }

  if (patch.xMax !== undefined) {
    assignments.push("x_max = ?");
    values.push(patch.xMax);
  }

  if (patch.yMax !== undefined) {
    assignments.push("y_max = ?");
    values.push(patch.yMax);
  }

  const result = getSqliteDatabase().prepare(
    `UPDATE zones SET ${assignments.join(", ")} WHERE id = ?`,
  ).run(...values, id);

  return result.changes > 0;
}

export async function deleteZoneRecord(id: number): Promise<boolean> {
  const result = getSqliteDatabase().prepare(
    "DELETE FROM zones WHERE id = ?",
  ).run(id);

  return result.changes > 0;
}

function mapZoneRecord(row: ZoneRecord): ZoneDto {
  return {
    code: row.code,
    id: row.id,
    name: row.name ?? undefined,
    sectorId: row.sectorId,
    xMax: row.xMax,
    xMin: row.xMin,
    yMax: row.yMax,
    yMin: row.yMin,
  };
}

async function findCreatedZoneRecord(id: number): Promise<ZoneDto> {
  const zone = await findZoneRecordById(id);

  if (zone === null) {
    throw new Error("Failed to load the zone that was just created.");
  }

  return zone;
}
