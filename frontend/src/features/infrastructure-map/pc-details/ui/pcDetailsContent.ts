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
    buildSubtitleMeta(
      "Prodsheet",
      formatPcDetailValue("prodsheet", marker.technicalDetails.prodsheet),
    ),
    buildSubtitleMeta(
      "Secteur",
      formatPcDetailValue("location", marker.technicalDetails.sector),
    ),
    buildSubtitleMeta(
      "Nom",
      formatPcDetailValue(
        "manufacturing-station-name",
        marker.technicalDetails.manufacturingStationNames,
      ),
    ),
    buildSubtitleMeta(
      "S/N",
      formatPcDetailValue("serial-number", marker.technicalDetails.serialNumber),
    ),
  ].filter(isVisibleText).join(" / ");
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
    const editableFieldId = marker.zoneId !== null &&
        (field.editableFieldId === "prodsheet" ||
          field.editableFieldId === "sector")
      ? undefined
      : field.editableFieldId;
    const isEditableField = editableFieldId !== undefined;

    if (!isVisibleText(fieldValue) && !isEditableField) {
      continue;
    }

    visibleFields.push({
      editableFieldId,
      editValue: editableFieldId === undefined
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

function buildSubtitleMeta(
  label: string,
  value: string | undefined,
): string | undefined {
  return isVisibleText(value) ? `${label} ${value}` : undefined;
}
