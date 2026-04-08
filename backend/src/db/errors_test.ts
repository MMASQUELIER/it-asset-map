import { assertEquals } from "@std/assert";
import {
  isCheckConstraintError,
  isDuplicateEntryError,
  isForeignKeyConstraintError,
} from "@/db/errors.ts";

Deno.test("database error helpers classify SQLite constraint failures", () => {
  assertEquals(
    isDuplicateEntryError({
      code: "ERR_SQLITE_ERROR",
      message: "UNIQUE constraint failed: sectors.name",
    }),
    true,
  );
  assertEquals(
    isForeignKeyConstraintError({
      code: "ERR_SQLITE_ERROR",
      message: "FOREIGN KEY constraint failed",
    }),
    true,
  );
  assertEquals(
    isCheckConstraintError({
      code: "ERR_SQLITE_ERROR",
      message: "CHECK constraint failed: x_min < x_max",
    }),
    true,
  );
  assertEquals(
    isDuplicateEntryError({
      code: "ERR_SQLITE_ERROR",
      message: "FOREIGN KEY constraint failed",
    }),
    false,
  );
  assertEquals(isDuplicateEntryError("P2002"), false);
});
