import {
  ValidationError,
} from "@/features/infrastructure-map/shared/errors.ts";
import type {
  EquipmentDataCreateInput,
  EquipmentDataPatch,
} from "@/features/infrastructure-map/equipment-data/types.ts";
import { EQUIPMENT_DATA_FIELDS } from "@/features/infrastructure-map/equipment-data/types.ts";

export function normalizeCreateEquipmentDataInput(
  payload: unknown,
): EquipmentDataCreateInput {
  const input = ensureEquipmentDataPayloadRecord(payload);
  const normalizedInput: EquipmentDataCreateInput = {};

  for (const field of EQUIPMENT_DATA_FIELDS) {
    if (!Object.hasOwn(input, field)) {
      continue;
    }

    const normalizedValue = normalizeOptionalFieldValue(input[field], field);

    if (normalizedValue !== null) {
      normalizedInput[field] = normalizedValue;
    }
  }

  if (Object.keys(normalizedInput).length === 0) {
    throw new ValidationError(
      "At least one equipment data field must be provided.",
    );
  }

  return normalizedInput;
}

export function normalizeEquipmentDataPatch(payload: unknown): EquipmentDataPatch {
  const input = ensureEquipmentDataPayloadRecord(payload);
  const patch: EquipmentDataPatch = {};

  for (const field of EQUIPMENT_DATA_FIELDS) {
    if (!Object.hasOwn(input, field)) {
      continue;
    }

    patch[field] = normalizeOptionalFieldValue(input[field], field);
  }

  if (Object.keys(patch).length === 0) {
    throw new ValidationError(
      "At least one equipment data field must be provided.",
    );
  }

  return patch;
}

function ensureEquipmentDataPayloadRecord(
  payload: unknown,
): Record<string, unknown> {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new ValidationError("Equipment data payload must be an object.");
  }

  return payload as Record<string, unknown>;
}

function normalizeOptionalFieldValue(
  value: unknown,
  fieldName: string,
): string | null {
  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new ValidationError(`Field "${fieldName}" must be a string or null.`);
  }

  const normalizedValue = value.trim();
  return normalizedValue.length === 0 ? null : normalizedValue;
}
