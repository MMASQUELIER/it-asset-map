import { assertEquals, assertThrows } from "@std/assert";
import { ValidationError } from "@/features/infrastructure-map/shared/errors.ts";
import {
  normalizeCreateZoneInput,
  normalizeUpdateZoneInput,
} from "@/features/infrastructure-map/zones/validation.ts";

Deno.test("normalizeCreateZoneInput trims optional values", () => {
  const result = normalizeCreateZoneInput({
    code: " 123 ",
    name: "  Assembly  ",
    sectorId: 7,
    xMax: 40,
    xMin: 10,
    yMax: 80,
    yMin: 20,
  });

  assertEquals(result, {
    code: "123",
    name: "Assembly",
    sectorId: 7,
    xMax: 40,
    xMin: 10,
    yMax: 80,
    yMin: 20,
  });
});

Deno.test("normalizeCreateZoneInput rejects invalid codes and bounds", () => {
  assertThrows(
    () =>
      normalizeCreateZoneInput({
        code: "12",
        sectorId: 1,
        xMax: 40,
        xMin: 10,
        yMax: 80,
        yMin: 20,
      }),
    ValidationError,
    "Zone code must contain exactly 3 digits.",
  );

  assertThrows(
    () =>
      normalizeCreateZoneInput({
        code: "123",
        sectorId: 1,
        xMax: 10,
        xMin: 10,
        yMax: 80,
        yMin: 20,
      }),
    ValidationError,
    "Zone bounds are invalid.",
  );
});

Deno.test("normalizeUpdateZoneInput requires at least one field", () => {
  assertThrows(
    () => normalizeUpdateZoneInput({}),
    ValidationError,
    "At least one zone field must be provided.",
  );
});

Deno.test("normalizeUpdateZoneInput converts blank names to null", () => {
  const result = normalizeUpdateZoneInput({
    code: " 456 ",
    name: "   ",
    sectorId: 3,
  });

  assertEquals(result, {
    code: "456",
    name: null,
    sectorId: 3,
  });
});
