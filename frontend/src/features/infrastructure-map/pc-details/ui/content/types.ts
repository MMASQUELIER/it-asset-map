import type {
  EditablePcFieldId,
  InteractiveMarker,
} from "@/features/infrastructure-map/model/types";

export interface DetailFieldDefinition {
  editableFieldId?: EditablePcFieldId;
  getEditValue?: (marker: InteractiveMarker) => string | undefined;
  id: string;
  label: string;
  getValue: (marker: InteractiveMarker) => string | undefined;
}

export interface DetailSectionDefinition {
  fields: DetailFieldDefinition[];
  title: string;
}

export interface VisiblePcDetailField {
  editableFieldId?: EditablePcFieldId;
  editValue?: string;
  id: string;
  isMissingValue?: boolean;
  label: string;
  value: string;
}

export interface VisiblePcDetailSection {
  items: VisiblePcDetailField[];
  title: string;
}
