import type { DetailFieldDefinition } from "@/features/infrastructure-map/pc-details/ui/content/types";
import { formatSesiValue } from "@/features/infrastructure-map/pc-details/ui/content/valueFormatting";

/**
 * Champs affiches dans la carte "Vue rapide" du panneau detail PC.
 */
export const SUMMARY_FIELD_DEFINITIONS: DetailFieldDefinition[] = [
  {
    id: "sesi",
    label: "SESI",
    getValue: (marker) => formatSesiValue(marker.technicalDetails.directoryAccount),
  },
  {
    id: "manufacturing-station-names",
    label: "Poste",
    getValue: (marker) => marker.technicalDetails.manufacturingStationNames,
  },
  {
    id: "hostname",
    label: "Nom machine",
    getValue: (marker) => marker.technicalDetails.hostname,
  },
  {
    id: "model",
    label: "Modele",
    getValue: (marker) => marker.technicalDetails.model,
  },
];
