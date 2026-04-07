import { assertEquals } from "@std/assert";
import {
  getResolvedEquipmentLocation,
  normalizeEquipmentDataAliases,
} from "@/features/infrastructure-map/equipment-data/aliases.ts";

Deno.test("getResolvedEquipmentLocation prefers floorLocation and falls back to sector", () => {
  assertEquals(
    getResolvedEquipmentLocation({
      floorLocation: "Ligne A",
      sector: "Assemblage",
    }),
    "Ligne A",
  );
  assertEquals(
    getResolvedEquipmentLocation({
      floorLocation: undefined,
      sector: "Assemblage",
    }),
    "Assemblage",
  );
});

Deno.test("normalizeEquipmentDataAliases fills missing legacy mirrors", () => {
  const normalizedEquipmentData = normalizeEquipmentDataAliases({
    equipmentId: "PC-001",
    floorLocation: "Atelier",
    id: 1,
    secondaryComment: "A verifier",
    status: "Oui",
    wifiOrWiredConnection: "wired",
  });

  assertEquals(normalizedEquipmentData.sector, "Atelier");
  assertEquals(normalizedEquipmentData.comment, "A verifier");
  assertEquals(normalizedEquipmentData.securityStatus, "Oui");
  assertEquals(normalizedEquipmentData.connectionType, "wired");
});
