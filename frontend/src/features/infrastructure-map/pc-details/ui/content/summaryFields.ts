import { formatDirectoryAccountValue } from "@/features/infrastructure-map/model/pcValueResolvers";
import type { DetailFieldDefinition } from "@/features/infrastructure-map/pc-details/ui/content/types";

export const SUMMARY_FIELD_DEFINITIONS: DetailFieldDefinition[] = [
  {
    id: "directory-account",
    label: "Compte",
    getValue: (marker) =>
      formatDirectoryAccountValue(marker.technicalDetails.directoryAccount),
  },
  {
    id: "manufacturing-station",
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
