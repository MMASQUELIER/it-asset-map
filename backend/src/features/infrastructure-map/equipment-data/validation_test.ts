import { assertEquals, assertThrows } from "@std/assert";
import { ValidationError } from "@/features/infrastructure-map/shared/errors.ts";
import {
  normalizeCreateEquipmentDataInput,
  normalizeEquipmentDataPatch,
} from "@/features/infrastructure-map/equipment-data/validation.ts";

Deno.test("normalizeCreateEquipmentDataInput keeps required id and trims fields", () => {
  const result = normalizeCreateEquipmentDataInput({
    comment: "  Needs replacement  ",
    equipmentId: "  PC-001  ",
    sector: "  Assembly  ",
  });

  assertEquals(result, {
    comment: "Needs replacement",
    equipmentId: "PC-001",
    sector: "Assembly",
  });
});

Deno.test("normalizeCreateEquipmentDataInput rejects missing equipmentId", () => {
  assertThrows(
    () => normalizeCreateEquipmentDataInput({ equipmentId: "   " }),
    ValidationError,
    'Field "equipmentId" is required.',
  );
});

Deno.test("normalizeEquipmentDataPatch converts blank optional fields to null", () => {
  const result = normalizeEquipmentDataPatch({
    comment: "   ",
    equipmentId: "  PC-002  ",
  });

  assertEquals(result, {
    comment: null,
    equipmentId: "PC-002",
  });
});

Deno.test("normalizeEquipmentDataPatch rejects empty payloads", () => {
  assertThrows(
    () => normalizeEquipmentDataPatch({}),
    ValidationError,
    "At least one equipment data field must be provided.",
  );
});
