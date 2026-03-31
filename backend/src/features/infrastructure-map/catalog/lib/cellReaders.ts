export function readMeaningfulCell(value: unknown): string | null {
  const text = readCellText(value);
  const normalizedText = text.toUpperCase();

  if (
    text.length === 0 ||
    normalizedText === "N/A" ||
    normalizedText === "NOT FOUND" ||
    normalizedText === "RESERVE"
  ) {
    return null;
  }

  return text;
}

export function readCellText(value: unknown, fallbackValue = ""): string {
  if (value === null || value === undefined) {
    return fallbackValue;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : fallbackValue;
}
