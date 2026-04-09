import {
  getSqliteDatabase,
  hasSqliteTable,
} from "@/db/sqlite.ts";

export async function ensureDatabaseReady(): Promise<void> {
  const database = getSqliteDatabase();

  if (!hasRequiredTables()) {
    const schemaSql = await Deno.readTextFile(
      new URL("../../db/schema.sql", import.meta.url),
    );

    database.exec(schemaSql);
    console.log("SQLite schema initialized.");
  }

  console.log("SQLite schema is ready.");
}

function hasRequiredTables(): boolean {
  return ["sectors", "zones", "equipment_data", "equipment"].every(
    hasSqliteTable,
  );
}
