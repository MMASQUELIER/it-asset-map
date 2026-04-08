import {
  getSqliteDatabase,
  readSqliteRow,
  readSqliteRows,
} from "@/db/sqlite.ts";
import type { SectorDto } from "@/features/infrastructure-map/sectors/types.ts";

interface SectorRecord {
  id: number;
  name: string;
}

const SECTOR_SELECT_SQL = "SELECT id, name FROM sectors";

export async function listSectorRecords(): Promise<SectorDto[]> {
  const rows = readSqliteRows<SectorRecord>(
    `${SECTOR_SELECT_SQL} ORDER BY name ASC`,
  );

  return rows.map(mapSectorRecord);
}

export async function findSectorRecordById(
  id: number,
): Promise<SectorDto | null> {
  const row = readSqliteRow<SectorRecord>(
    `${SECTOR_SELECT_SQL} WHERE id = ?`,
    id,
  );

  return row === undefined ? null : mapSectorRecord(row);
}

export async function findSectorRecordByName(
  name: string,
): Promise<SectorDto | null> {
  const row = readSqliteRow<SectorRecord>(
    `${SECTOR_SELECT_SQL} WHERE name = ?`,
    name,
  );

  return row === undefined ? null : mapSectorRecord(row);
}

export async function createSectorRecord(
  name: string,
): Promise<SectorDto> {
  const result = getSqliteDatabase().prepare(
    "INSERT INTO sectors (name) VALUES (?)",
  ).run(name);

  return await findCreatedSectorRecord(Number(result.lastInsertRowid));
}

export async function updateSectorRecord(
  id: number,
  name: string,
): Promise<boolean> {
  const result = getSqliteDatabase().prepare(
    "UPDATE sectors SET name = ? WHERE id = ?",
  ).run(name, id);

  return result.changes > 0;
}

export async function deleteSectorRecord(id: number): Promise<boolean> {
  const result = getSqliteDatabase().prepare(
    "DELETE FROM sectors WHERE id = ?",
  ).run(id);

  return result.changes > 0;
}

function mapSectorRecord(row: SectorRecord): SectorDto {
  return {
    id: row.id,
    name: row.name,
  };
}

async function findCreatedSectorRecord(id: number): Promise<SectorDto> {
  const sector = await findSectorRecordById(id);

  if (sector === null) {
    throw new Error("Failed to load the sector that was just created.");
  }

  return sector;
}
