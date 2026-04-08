import type {
  EditablePcFieldId,
  InteractiveMarker,
} from "@/features/infrastructure-map/model/types";
import type { DetailFieldDefinition } from "@/features/infrastructure-map/pc-details/ui/content/types";

type DetailValueGetter = (marker: InteractiveMarker) => string | undefined;
type TechnicalDetailStringField = {
  [Field in keyof InteractiveMarker["technicalDetails"]]:
    InteractiveMarker["technicalDetails"][Field] extends string | undefined
      ? Field
      : never;
}[keyof InteractiveMarker["technicalDetails"]];

export function createDetailField(
  id: string,
  label: string,
  getValue: DetailValueGetter,
): DetailFieldDefinition {
  return { id, label, getValue };
}

export function createEditableDetailField(
  id: string,
  label: string,
  editableFieldId: EditablePcFieldId,
  getValue: DetailValueGetter,
  getEditValue?: DetailValueGetter,
): DetailFieldDefinition {
  return {
    editableFieldId,
    getEditValue,
    getValue,
    id,
    label,
  };
}

export function getTechnicalDetailValue(
  fieldId: TechnicalDetailStringField,
): DetailValueGetter {
  return (marker) => {
    const technicalDetails = marker.technicalDetails as Record<
      string,
      string | undefined
    >;
    const value = technicalDetails[fieldId as string];
    return typeof value === "string" ? value : undefined;
  };
}
