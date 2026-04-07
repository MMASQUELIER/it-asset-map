import { runPrismaCommand } from "@/db/prismaCli.ts";

export async function ensureDatabaseReady(): Promise<void> {
  if (await shouldBaselineExistingSchema()) {
    await assertOnlyInitialPrismaMigrationExists();
    console.log(
      "Existing schema detected, skipping the initial Prisma migration because the schema is already present.",
    );
    return;
  }

  await runPrismaCommand(["migrate", "deploy"]);
  console.log("Prisma migrations are up to date.");
}

async function shouldBaselineExistingSchema(): Promise<boolean> {
  const { getPrismaClient } = await import("@/db/prisma.ts");
  const rows = await getPrismaClient().$queryRawUnsafe<Array<{ tableName: string }>>(
    `
      SELECT table_name AS tableName
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name IN ('_prisma_migrations', 'sectors', 'zones', 'equipment_data', 'equipment')
    `,
  );
  const tableNames = new Set(rows.map((row) => row.tableName));
  const hasPrismaMigrationsTable = tableNames.has("_prisma_migrations");
  const hasLegacySchema = ["sectors", "zones", "equipment_data", "equipment"].some(
    (tableName) => tableNames.has(tableName),
  );

  return hasLegacySchema && !hasPrismaMigrationsTable;
}

async function assertOnlyInitialPrismaMigrationExists(): Promise<void> {
  const migrationVersions: string[] = [];

  for await (const entry of Deno.readDir(new URL("../../prisma/migrations/", import.meta.url))) {
    if (!entry.isDirectory) {
      continue;
    }

    migrationVersions.push(entry.name);
  }

  if (migrationVersions.length > 1) {
    throw new Error(
      "The database already contains the legacy schema, but Prisma now has additional migrations pending. Baseline the existing database before applying newer Prisma migrations.",
    );
  }
}
