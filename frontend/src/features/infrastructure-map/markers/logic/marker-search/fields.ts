import {
  formatDirectoryAccountValue,
  getResolvedPcLocation,
} from "@/features/infrastructure-map/model/pcValueResolvers";
import type { SearchField } from "@/features/infrastructure-map/markers/logic/marker-search/types";

export const markerSearchFields: SearchField[] = [
  {
    getValue: (marker) => marker.technicalDetails.hostname,
    label: "Nom machine",
    weight: 130,
  },
  { getValue: (marker) => marker.id, label: "Identifiant", weight: 96 },
  {
    getValue: (marker) => marker.technicalDetails.ipAddress,
    label: "Adresse IP",
    weight: 95,
  },
  {
    getValue: (marker) => marker.technicalDetails.macAddress,
    label: "Adresse MAC",
    weight: 90,
  },
  {
    getValue: (marker) => marker.technicalDetails.serialNumber,
    label: "Numero de serie",
    weight: 88,
  },
  {
    getValue: (marker) =>
      formatDirectoryAccountValue(marker.technicalDetails.directoryAccount),
    label: "Compte",
    weight: 82,
  },
  {
    getValue: (marker) => marker.technicalDetails.prodsheet,
    label: "Prodsheet",
    weight: 80,
  },
  {
    getValue: (marker) => getResolvedPcLocation(marker.technicalDetails),
    label: "Emplacement",
    weight: 78,
  },
  {
    getValue: (marker) => marker.technicalDetails.manufacturingStationNames,
    label: "Poste de fabrication",
    weight: 77,
  },
  {
    getValue: (marker) => marker.technicalDetails.switchName,
    label: "Switch",
    weight: 70,
  },
  {
    getValue: (marker) => marker.technicalDetails.connectedToSwitchPort,
    label: "Port switch connecte",
    weight: 66,
  },
  {
    getValue: (marker) => marker.technicalDetails.newPortAuto,
    label: "Port auto",
    weight: 64,
  },
];
