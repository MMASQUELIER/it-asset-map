import { formatDirectoryAccountValue } from "@/features/infrastructure-map/model/pcValueResolvers";

const HIDDEN_PLACEHOLDER_VALUES = new Set([
  "-",
  "--",
  "n/a",
  "na",
  "none",
  "null",
  "undefined",
  "unknown",
  "non renseigne",
]);

export function isVisibleText(value: string | undefined): value is string {
  return sanitizeRawValue(value) !== undefined;
}

export function formatPcDetailValue(
  fieldId: string,
  rawValue: string | undefined,
): string | undefined {
  const sanitizedValue = sanitizeRawValue(rawValue);

  if (sanitizedValue === undefined) {
    return undefined;
  }

  if (fieldId === "directory-account" || fieldId === "login") {
    return sanitizeRawValue(formatDirectoryAccountValue(sanitizedValue));
  }

  if (fieldId === "date") {
    return formatInventoryDateValue(sanitizedValue);
  }

  if (fieldId === "mac-address") {
    return formatMacAddressValue(sanitizedValue);
  }

  if (fieldId === "wifi-wired-connection") {
    return formatConnectionTypeValue(sanitizedValue);
  }

  if (fieldId === "status" || fieldId === "security-status") {
    return formatSecurityValue(sanitizedValue);
  }

  return sanitizedValue;
}

function sanitizeRawValue(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return undefined;
  }

  return HIDDEN_PLACEHOLDER_VALUES.has(trimmedValue.toLowerCase())
    ? undefined
    : trimmedValue;
}

function formatInventoryDateValue(value: string): string {
  if (/^\d{5}$/.test(value)) {
    const spreadsheetSerialDate = new Date(
      Date.UTC(1899, 11, 30) + Number(value) * 86400000,
    );

    return formatDateParts(
      spreadsheetSerialDate.getUTCDate(),
      spreadsheetSerialDate.getUTCMonth() + 1,
      spreadsheetSerialDate.getUTCFullYear(),
    );
  }

  const frenchDateMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (frenchDateMatch !== null) {
    const [, day, month, year] = frenchDateMatch;

    return formatDateParts(Number(day), Number(month), Number(year));
  }

  const parsedDate = new Date(value);

  if (!Number.isNaN(parsedDate.getTime())) {
    return formatDateParts(
      parsedDate.getUTCDate(),
      parsedDate.getUTCMonth() + 1,
      parsedDate.getUTCFullYear(),
    );
  }

  return value;
}

function formatDateParts(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

function formatMacAddressValue(value: string): string {
  const hexadecimalCharacters = value.replace(/[^a-fA-F0-9]/g, "").toUpperCase();

  if (hexadecimalCharacters.length !== 12) {
    return value.toUpperCase();
  }

  return hexadecimalCharacters.match(/.{1,2}/g)?.join(":") ?? value.toUpperCase();
}

function formatConnectionTypeValue(value: string): string {
  if (/^wired$/i.test(value)) {
    return "Filaire";
  }

  if (/^(wifi|wi-fi|wireless)$/i.test(value)) {
    return "Wi-Fi";
  }

  return value;
}

function formatSecurityValue(value: string): string {
  if (/^(yes|oui)$/i.test(value)) {
    return "Oui";
  }

  if (/^(no|non)$/i.test(value)) {
    return "Non";
  }

  if (/^installed$/i.test(value)) {
    return "Installe";
  }

  return value;
}
