interface SqliteDriverError {
  code?: string;
  message: string;
}

export function isDuplicateEntryError(error: unknown): boolean {
  return hasSqliteConstraintMessage(error, /^UNIQUE constraint failed:/i);
}

export function isForeignKeyConstraintError(error: unknown): boolean {
  return hasSqliteConstraintMessage(error, /^FOREIGN KEY constraint failed$/i);
}

export function isCheckConstraintError(error: unknown): boolean {
  return hasSqliteConstraintMessage(error, /^CHECK constraint failed:/i);
}

function hasSqliteConstraintMessage(error: unknown, pattern: RegExp): boolean {
  return isSqliteDriverError(error) &&
    error.code === "ERR_SQLITE_ERROR" &&
    pattern.test(error.message);
}

function isSqliteDriverError(error: unknown): error is SqliteDriverError {
  return typeof error === "object" &&
    error !== null &&
    typeof (error as { message?: unknown }).message === "string";
}
