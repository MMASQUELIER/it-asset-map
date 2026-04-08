import {
  formatDirectoryAccountValue,
  getResolvedPcComment,
  getResolvedPcConnectionType,
  getResolvedPcLocation,
} from "@/features/infrastructure-map/model/pcValueResolvers";
import type { DetailSectionDefinition } from "@/features/infrastructure-map/pc-details/ui/content/types";

export const DETAIL_SECTION_DEFINITIONS: DetailSectionDefinition[] = [
  {
    title: "Identification",
    fields: [
      {
        id: "collaborateur",
        label: "Collaborateur",
        editableFieldId: "contact",
        getValue: (marker) => marker.technicalDetails.contact,
      },
      {
        id: "pin",
        label: "Cle PIN",
        editableFieldId: "pinKey",
        getValue: (marker) => marker.technicalDetails.pinKey,
      },
      {
        id: "location",
        label: "Emplacement",
        editableFieldId: "sector",
        getEditValue: (marker) => getResolvedPcLocation(marker.technicalDetails),
        getValue: (marker) => getResolvedPcLocation(marker.technicalDetails),
      },
      {
        id: "prodsched",
        label: "Code zone",
        editableFieldId: "zoneCode",
        getValue: (marker) => marker.technicalDetails.zoneCode,
      },
      {
        id: "manufacturing-station",
        label: "Poste fabrication",
        editableFieldId: "manufacturingStationNames",
        getValue: (marker) => marker.technicalDetails.manufacturingStationNames,
      },
      {
        id: "date",
        label: "Date inventaire",
        editableFieldId: "lastInventoryDate",
        getValue: (marker) => marker.technicalDetails.lastInventoryDate,
      },
    ],
  },
  {
    title: "Equipement",
    fields: [
      {
        id: "equipment-type",
        label: "Type equipement",
        editableFieldId: "assetType",
        getValue: (marker) => marker.technicalDetails.assetType,
      },
      {
        id: "brand",
        label: "Marque",
        editableFieldId: "manufacturer",
        getValue: (marker) => marker.technicalDetails.manufacturer,
      },
      {
        id: "model",
        label: "Modele",
        editableFieldId: "model",
        getValue: (marker) => marker.technicalDetails.model,
      },
      {
        id: "serial-number",
        label: "Numero de serie",
        editableFieldId: "serialNumber",
        getValue: (marker) => marker.technicalDetails.serialNumber,
      },
      {
        id: "hdd",
        label: "HDD",
        editableFieldId: "storage",
        getValue: (marker) => marker.technicalDetails.storage,
      },
      {
        id: "hostname",
        label: "Nom machine",
        editableFieldId: "hostname",
        getValue: (marker) => marker.technicalDetails.hostname,
      },
      {
        id: "sap",
        label: "SAP",
        editableFieldId: "sap",
        getValue: (marker) => marker.technicalDetails.sap,
      },
      {
        id: "os-type",
        label: "Systeme",
        editableFieldId: "operatingSystem",
        getValue: (marker) => marker.technicalDetails.operatingSystem,
      },
    ],
  },
  {
    title: "Reseau",
    fields: [
      {
        id: "mac-address",
        label: "Adresse MAC",
        editableFieldId: "macAddress",
        getValue: (marker) => marker.technicalDetails.macAddress,
      },
      {
        id: "ip-address",
        label: "Adresse IP",
        editableFieldId: "ipAddress",
        getValue: (marker) => marker.technicalDetails.ipAddress,
      },
      {
        id: "subnet",
        label: "Sous-reseau",
        editableFieldId: "subnetMask",
        getValue: (marker) => marker.technicalDetails.subnetMask,
      },
      {
        id: "vlan-id-name",
        label: "VLAN",
        editableFieldId: "vlan",
        getValue: (marker) => marker.technicalDetails.vlan,
      },
      {
        id: "vlan-name",
        label: "Nom VLAN",
        editableFieldId: "networkScope",
        getValue: (marker) => marker.technicalDetails.networkScope,
      },
      {
        id: "old-ip-address",
        label: "Ancienne IP",
        editableFieldId: "oldIpAddress",
        getValue: (marker) => marker.technicalDetails.oldIpAddress,
      },
      {
        id: "new-ip-address",
        label: "Nouvelle IP",
        editableFieldId: "newIpAddress",
        getValue: (marker) => marker.technicalDetails.newIpAddress,
      },
      {
        id: "vlan-new",
        label: "Nouveau VLAN",
        editableFieldId: "vlanNew",
        getValue: (marker) => marker.technicalDetails.vlanNew,
      },
      {
        id: "id-port",
        label: "Port ID",
        editableFieldId: "idPort",
        getValue: (marker) => marker.technicalDetails.idPort,
      },
      {
        id: "new-port-auto",
        label: "Nouveau port",
        editableFieldId: "newPortAuto",
        getValue: (marker) => marker.technicalDetails.newPortAuto,
      },
      {
        id: "switch-name",
        label: "Nom du switch",
        editableFieldId: "switchName",
        getValue: (marker) => marker.technicalDetails.switchName,
      },
      {
        id: "switch-ip",
        label: "IP du switch",
        editableFieldId: "switchIpAddress",
        getValue: (marker) => marker.technicalDetails.switchIpAddress,
      },
      {
        id: "ticket-brassage",
        label: "Ticket Brassage",
        editableFieldId: "ticketBrassage",
        getValue: (marker) => marker.technicalDetails.ticketBrassage,
      },
      {
        id: "ip-filter",
        label: "Filtre IP",
        editableFieldId: "ipFilter",
        getValue: (marker) => marker.technicalDetails.ipFilter,
      },
      {
        id: "status",
        label: "Etat",
        editableFieldId: "status",
        getValue: (marker) => marker.technicalDetails.status,
      },
      {
        id: "connected-switch-name",
        label: "Switch connecte",
        editableFieldId: "connectedToSwitchName",
        getValue: (marker) => marker.technicalDetails.connectedToSwitchName,
      },
      {
        id: "connected-switch-port",
        label: "Port switch connecte",
        editableFieldId: "connectedToSwitchPort",
        getValue: (marker) => marker.technicalDetails.connectedToSwitchPort,
      },
      {
        id: "wifi-wired-connection",
        label: "Connexion",
        editableFieldId: "wifiOrWiredConnection",
        getEditValue: (marker) => getResolvedPcConnectionType(marker.technicalDetails),
        getValue: (marker) => getResolvedPcConnectionType(marker.technicalDetails),
      },
      {
        id: "directory-account",
        label: "Compte",
        editableFieldId: "directoryAccount",
        getEditValue: (marker) => marker.technicalDetails.directoryAccount,
        getValue: (marker) =>
          formatDirectoryAccountValue(marker.technicalDetails.directoryAccount),
      },
    ],
  },
  {
    title: "Notes",
    fields: [
      {
        id: "secondary-comment",
        label: "Commentaire",
        editableFieldId: "secondaryComment",
        getEditValue: (marker) => getResolvedPcComment(marker.technicalDetails),
        getValue: (marker) => getResolvedPcComment(marker.technicalDetails),
      },
    ],
  },
];
