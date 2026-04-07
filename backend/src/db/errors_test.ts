import { assertEquals } from "@std/assert";
import {
  isCheckConstraintError,
  isDatabaseKnownRequestError,
  isDuplicateEntryError,
  isForeignKeyConstraintError,
  isRecordNotFoundError,
} from "@/db/errors.ts";

Deno.test("database error helpers classify Prisma error codes", () => {
  assertEquals(isDatabaseKnownRequestError({ code: "P2002" }), true);
  assertEquals(isDuplicateEntryError({ code: "P2002" }), true);
  assertEquals(
    isForeignKeyConstraintError({ code: "P2003" }),
    true,
  );
  assertEquals(
    isCheckConstraintError({ code: "P2004" }),
    true,
  );
  assertEquals(isRecordNotFoundError({ code: "P2025" }), true);
  assertEquals(isDuplicateEntryError({ code: "P2003" }), false);
  assertEquals(isDatabaseKnownRequestError("P2002"), false);
});
