import {
  ValidationError,
} from "@/features/infrastructure-map/shared/errors.ts";
import type {
  CreateZoneInput,
  UpdateZoneInput,
} from "@/features/infrastructure-map/zones/types.ts";

export function normalizeCreateZoneInput(
  input: CreateZoneInput,
): CreateZoneInput {
  const normalizedInput: CreateZoneInput = {
    code: normalizeZoneCode(input.code),
    name: normalizeOptionalText(input.name) ?? undefined,
    sectorId: normalizePositiveInteger(input.sectorId, "sectorId"),
    xMax: normalizeInteger(input.xMax, "xMax"),
    xMin: normalizeInteger(input.xMin, "xMin"),
    yMax: normalizeInteger(input.yMax, "yMax"),
    yMin: normalizeInteger(input.yMin, "yMin"),
  };

  validateBounds(
    normalizedInput.xMin,
    normalizedInput.yMin,
    normalizedInput.xMax,
    normalizedInput.yMax,
  );

  return normalizedInput;
}

export function normalizeUpdateZoneInput(
  input: UpdateZoneInput,
): UpdateZoneInput {
  const normalizedInput: UpdateZoneInput = {};

  if (input.sectorId !== undefined) {
    normalizedInput.sectorId = normalizePositiveInteger(
      input.sectorId,
      "sectorId",
    );
  }

  if (input.code !== undefined) {
    normalizedInput.code = normalizeZoneCode(input.code);
  }

  if (input.name !== undefined) {
    normalizedInput.name = normalizeOptionalText(input.name);
  }

  if (input.xMin !== undefined) {
    normalizedInput.xMin = normalizeInteger(input.xMin, "xMin");
  }

  if (input.yMin !== undefined) {
    normalizedInput.yMin = normalizeInteger(input.yMin, "yMin");
  }

  if (input.xMax !== undefined) {
    normalizedInput.xMax = normalizeInteger(input.xMax, "xMax");
  }

  if (input.yMax !== undefined) {
    normalizedInput.yMax = normalizeInteger(input.yMax, "yMax");
  }

  if (Object.keys(normalizedInput).length === 0) {
    throw new ValidationError("At least one zone field must be provided.");
  }

  validateBoundsPatch(normalizedInput);
  return normalizedInput;
}

function validateBoundsPatch(input: UpdateZoneInput): void {
  if (
    input.xMin === undefined ||
    input.yMin === undefined ||
    input.xMax === undefined ||
    input.yMax === undefined
  ) {
    return;
  }

  validateBounds(input.xMin, input.yMin, input.xMax, input.yMax);
}

function validateBounds(
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
): void {
  if (xMin >= xMax || yMin >= yMax) {
    throw new ValidationError(
      "Zone bounds are invalid. Expected xMin < xMax and yMin < yMax.",
    );
  }
}

function normalizeZoneCode(code: string): string {
  const normalizedCode = code.trim();

  if (!/^\d{3}$/.test(normalizedCode)) {
    throw new ValidationError("Zone code must contain exactly 3 digits.");
  }

  return normalizedCode;
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length === 0 ? null : normalizedValue;
}

function normalizeInteger(value: number, fieldName: string): number {
  if (!Number.isInteger(value)) {
    throw new ValidationError(`Field "${fieldName}" must be an integer.`);
  }

  return value;
}

function normalizePositiveInteger(value: number, fieldName: string): number {
  const normalizedValue = normalizeInteger(value, fieldName);

  if (normalizedValue <= 0) {
    throw new ValidationError(
      `Field "${fieldName}" must be a positive integer.`,
    );
  }

  return normalizedValue;
}
