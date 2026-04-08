import { ensureDatabaseReady } from "@/db/ensureDatabaseReady.ts";
import { closeSqliteDatabase, getSqliteDatabase } from "@/db/sqlite.ts";

try {
  await ensureDatabaseReady();
  const row = getSqliteDatabase().prepare("SELECT 1 AS value").get() as
    | { value: number | string }
    | undefined;
  const resultValue = row?.value;
  const isHealthy = resultValue === 1 || resultValue === "1";

  if (!isHealthy) {
    throw new Error("SQLite health check returned an unexpected response.");
  }

  console.log("Database connection is healthy.");
} finally {
  closeSqliteDatabase();
}
