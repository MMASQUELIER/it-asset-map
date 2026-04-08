import { dirname } from "@std/path";
import { DatabaseSync } from "node:sqlite";
import { backendConfig } from "@/config/env.ts";

type SqliteParameter = bigint | number | string | Uint8Array | null;

let sqliteDatabase: DatabaseSync | null = null;

export function ensureSqliteDirectoryExists(): void {
  Deno.mkdirSync(dirname(backendConfig.sqlitePath), { recursive: true });
}

export function getSqliteDatabase(): DatabaseSync {
  if (sqliteDatabase !== null) {
    return sqliteDatabase;
  }

  ensureSqliteDirectoryExists();
  sqliteDatabase = new DatabaseSync(backendConfig.sqlitePath);
  sqliteDatabase.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = NORMAL;
  `);

  return sqliteDatabase;
}

export function closeSqliteDatabase(): void {
  if (sqliteDatabase === null) {
    return;
  }

  sqliteDatabase.close();
  sqliteDatabase = null;
}

export function runInSqliteTransaction<T>(callback: () => T): T {
  const database = getSqliteDatabase();
  database.exec("BEGIN IMMEDIATE");

  try {
    const result = callback();
    database.exec("COMMIT");
    return result;
  } catch (error) {
    try {
      database.exec("ROLLBACK");
    } catch {
      // Ignore rollback failures so the original error is preserved.
    }

    throw error;
  }
}

export function hasSqliteTable(tableName: string): boolean {
  const row = readSqliteRow<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    tableName,
  );

  return row?.name === tableName;
}

export function readSqliteRows<T>(
  sql: string,
  ...params: SqliteParameter[]
): T[] {
  return getSqliteDatabase().prepare(sql).all(...params) as T[];
}

export function readSqliteRow<T>(
  sql: string,
  ...params: SqliteParameter[]
): T | undefined {
  return getSqliteDatabase().prepare(sql).get(...params) as T | undefined;
}
