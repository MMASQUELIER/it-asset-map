import { closePrismaClient, getPrismaClient } from "@/db/prisma.ts";

try {
  const rows = await getPrismaClient().$queryRawUnsafe<
    Array<{ value: bigint | number | string }>
  >(
    "SELECT 1 AS value",
  );
  const resultValue = rows[0]?.value;
  const isHealthy = resultValue === 1 ||
    resultValue === 1n ||
    resultValue === "1";

  if (!isHealthy) {
    throw new Error("MySQL health check returned an unexpected response.");
  }

  console.log("Database connection is healthy.");
} finally {
  await closePrismaClient();
}
