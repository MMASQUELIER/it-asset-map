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

const EMPTY_EDITABLE_FIELD_LABEL = "Non renseigne";

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
    const rawFieldValue = field.getValue(marker);
    const fieldValue = formatPcDetailValue(field.id, rawFieldValue);
    const isEditableField = field.editableFieldId !== undefined;

    if (!isVisibleText(fieldValue) && !isEditableField) {
      continue;
    }

    visibleFields.push({
      editableFieldId: field.editableFieldId,
      editValue: field.editableFieldId === undefined
        ? undefined
        : field.getEditValue?.(marker) ?? rawFieldValue ?? "",
      id: field.id,
      isMissingValue: !isVisibleText(fieldValue),
      label: field.label,
      value: fieldValue ?? EMPTY_EDITABLE_FIELD_LABEL,
    });
  }

  return visibleFields;
}
