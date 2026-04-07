import { PrismaMariaDb } from "npm:@prisma/adapter-mariadb";
import {
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client.ts";
import { backendConfig } from "@/config/env.ts";

let prismaClient: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (prismaClient !== null) {
    return prismaClient;
  }

  const adapter = new PrismaMariaDb({
    allowPublicKeyRetrieval: true,
    connectionLimit: backendConfig.mysql.connectionLimit,
    database: backendConfig.mysql.database,
    host: backendConfig.mysql.host,
    password: backendConfig.mysql.password,
    port: backendConfig.mysql.port,
    user: backendConfig.mysql.user,
  });

  prismaClient = new PrismaClient({ adapter });
  return prismaClient;
}

export async function closePrismaClient(): Promise<void> {
  if (prismaClient === null) {
    return;
  }

  await prismaClient.$disconnect();
  prismaClient = null;
}

export { Prisma };
