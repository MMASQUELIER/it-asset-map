import { Prisma } from "@/db/prisma.ts";

interface DatabaseKnownRequestError {
  code?: string;
}

export function isDatabaseKnownRequestError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError | DatabaseKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError ||
    (typeof error === "object" && error !== null && "code" in error);
}

export function isDuplicateEntryError(error: unknown): boolean {
  return isDatabaseKnownRequestError(error) && error.code === "P2002";
}

export function isForeignKeyConstraintError(error: unknown): boolean {
  return isDatabaseKnownRequestError(error) && error.code === "P2003";
}

export function isCheckConstraintError(error: unknown): boolean {
  return isDatabaseKnownRequestError(error) && error.code === "P2004";
}

export function isRecordNotFoundError(error: unknown): boolean {
  return isDatabaseKnownRequestError(error) && error.code === "P2025";
}
