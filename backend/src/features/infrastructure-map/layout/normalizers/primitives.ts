import { InvalidMapLayoutError } from "@/features/infrastructure-map/layout/errors.ts";

export function readRequiredString(value: unknown, fieldPath: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new InvalidMapLayoutError(`${fieldPath} doit etre un texte non vide.`);
  }

  return value.trim();
}

export function readFiniteNumber(value: unknown, fieldPath: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new InvalidMapLayoutError(`${fieldPath} doit etre un nombre fini.`);
  }

  return value;
}

export function readPositiveNumber(value: unknown, fieldPath: string): number {
  const parsedValue = readFiniteNumber(value, fieldPath);

  if (parsedValue <= 0) {
    throw new InvalidMapLayoutError(`${fieldPath} doit etre strictement positif.`);
  }

  return parsedValue;
}

export function readPositiveInteger(value: unknown, fieldPath: string): number {
  const parsedValue = readPositiveNumber(value, fieldPath);

  if (!Number.isInteger(parsedValue)) {
    throw new InvalidMapLayoutError(`${fieldPath} doit etre un entier positif.`);
  }

  return parsedValue;
}

export function readNullablePositiveInteger(
  value: unknown,
  fieldPath: string,
): number | null {
  if (value === null) {
    return null;
  }

  return readPositiveInteger(value, fieldPath);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
