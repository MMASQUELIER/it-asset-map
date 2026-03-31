import type { InteractiveMarker } from "@/features/infrastructure-map/model/types";
import { DETAIL_SECTION_DEFINITIONS } from "@/features/infrastructure-map/pc-details/ui/content/detailSections";
import { SUMMARY_FIELD_DEFINITIONS } from "@/features/infrastructure-map/pc-details/ui/content/summaryFields";
import type {
  DetailFieldDefinition,
  VisiblePcDetailField,
  VisiblePcDetailSection,
} from "@/features/infrastructure-map/pc-details/ui/content/types";
import {
  formatPcDetailValue,
  isVisibleText,
} from "@/features/infrastructure-map/pc-details/ui/content/valueFormatting";

export type {
  VisiblePcDetailField,
  VisiblePcDetailSection,
} from "@/features/infrastructure-map/pc-details/ui/content/types";

export function buildPcSubtitle(marker: InteractiveMarker): string {
  return [
    formatPcDetailValue("prodsched", marker.technicalDetails.prodsched),
    formatPcDetailValue(
      "manufacturing-station-name",
      marker.technicalDetails.manufacturingStationNames,
    ),
    formatPcDetailValue("model", marker.technicalDetails.model),
  ].filter(isVisibleText).join(" • ");
}

export function buildPcSummaryFields(
  marker: InteractiveMarker,
): VisiblePcDetailField[] {
  return buildVisibleFields(marker, SUMMARY_FIELD_DEFINITIONS);
}

export function buildPcDetailSections(
  marker: InteractiveMarker,
): VisiblePcDetailSection[] {
  return DETAIL_SECTION_DEFINITIONS.map(function buildPcDetailSection(section) {
    return {
      title: section.title,
      items: buildVisibleFields(marker, section.fields),
    };
  });
}

function buildVisibleFields(
  marker: InteractiveMarker,
  fields: DetailFieldDefinition[],
): VisiblePcDetailField[] {
  const visibleFields: VisiblePcDetailField[] = [];

  for (const field of fields) {
    const fieldValue = formatPcDetailValue(field.id, field.getValue(marker));

    if (!isVisibleText(fieldValue)) {
      continue;
    }

    visibleFields.push({
      id: field.id,
      label: field.label,
      value: fieldValue,
    });
  }

  return visibleFields;
}
