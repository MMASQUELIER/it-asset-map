import type {
  VisiblePcDetailField,
  VisiblePcDetailSection,
} from "@/features/infrastructure-map/pc-details/ui/content/types";

export function filterVisiblePcDetailFields(
  fields: VisiblePcDetailField[],
  searchQuery: string,
): VisiblePcDetailField[] {
  const normalizedSearchQuery = normalizeFilterValue(searchQuery);

  if (normalizedSearchQuery.length === 0) {
    return fields;
  }

  return fields.filter((field) =>
    matchesFilterQuery(field.label, normalizedSearchQuery) ||
    matchesFilterQuery(field.value, normalizedSearchQuery)
  );
}

export function filterVisiblePcDetailSections(
  sections: VisiblePcDetailSection[],
  searchQuery: string,
): VisiblePcDetailSection[] {
  const visibleSections: VisiblePcDetailSection[] = [];

  for (const section of sections) {
    const visibleItems = filterVisiblePcDetailFields(section.items, searchQuery);

    if (visibleItems.length === 0) {
      continue;
    }

    visibleSections.push({
      ...section,
      items: visibleItems,
    });
  }

  return visibleSections;
}

function matchesFilterQuery(value: string, normalizedSearchQuery: string): boolean {
  return normalizeFilterValue(value).includes(normalizedSearchQuery);
}

function normalizeFilterValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}
