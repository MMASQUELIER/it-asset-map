export function isNonEmptySearchValue(
  value: string | undefined,
): value is string {
  return value !== undefined && value.trim().length > 0;
}

export function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
