import type { DetailFieldDefinition } from "@/features/infrastructure-map/pc-details/ui/content/types";
import { formatSesiValue } from "@/features/infrastructure-map/pc-details/ui/content/valueFormatting";

/**
 * Champs affiches dans la carte "Vue rapide" du panneau detail PC.
 */
export const SUMMARY_FIELD_DEFINITIONS: DetailFieldDefinition[] = [
  {
    id: "sesi",
    label: "SESI",
    editableFieldId: "directoryAccount",
    getEditValue: (marker) => marker.technicalDetails.directoryAccount,
    getValue: (marker) => formatSesiValue(marker.technicalDetails.directoryAccount),
  },
  {
    id: "manufacturing-station-names",
    label: "Poste",
    editableFieldId: "manufacturingStationNames",
    getValue: (marker) => marker.technicalDetails.manufacturingStationNames,
  },
  {
    id: "hostname",
    label: "Nom machine",
    editableFieldId: "hostname",
    getValue: (marker) => marker.technicalDetails.hostname,
  },
  {
    id: "model",
    label: "Modele",
    editableFieldId: "model",
    getValue: (marker) => marker.technicalDetails.model,
  },
];
