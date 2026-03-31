import type { InteractiveMarker } from "@/features/infrastructure-map/model/types";

export interface DetailFieldDefinition {
  id: string;
  label: string;
  getValue: (marker: InteractiveMarker) => string | undefined;
}

export interface DetailSectionDefinition {
  fields: DetailFieldDefinition[];
  title: string;
}

export interface VisiblePcDetailField {
  id: string;
  label: string;
  value: string;
}

export interface VisiblePcDetailSection {
  items: VisiblePcDetailField[];
  title: string;
}
