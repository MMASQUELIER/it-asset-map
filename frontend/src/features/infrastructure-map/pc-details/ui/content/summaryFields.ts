import { formatDirectoryAccountValue } from "@/features/infrastructure-map/model/pcValueResolvers";
import {
  createDetailField,
  getTechnicalDetailValue,
} from "@/features/infrastructure-map/pc-details/ui/content/fieldFactories";
import type { DetailFieldDefinition } from "@/features/infrastructure-map/pc-details/ui/content/types";

export const SUMMARY_FIELD_DEFINITIONS: DetailFieldDefinition[] = [
  createDetailField(
    "directory-account",
    "Compte",
    (marker) =>
      formatDirectoryAccountValue(marker.technicalDetails.directoryAccount),
  ),
  createDetailField(
    "manufacturing-station",
    "Poste",
    getTechnicalDetailValue("manufacturingStationNames"),
  ),
  createDetailField("hostname", "Nom machine", getTechnicalDetailValue("hostname")),
  createDetailField("model", "Modele", getTechnicalDetailValue("model")),
];
