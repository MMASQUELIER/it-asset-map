import type { DetailSectionDefinition } from "@/features/infrastructure-map/pc-details/ui/content/types";
import { formatSesiValue } from "@/features/infrastructure-map/pc-details/ui/content/valueFormatting";

/**
 * Configuration des panneaux repliables de la vue detail d'un PC.
 */
export const DETAIL_SECTION_DEFINITIONS: DetailSectionDefinition[] = [
  {
    title: "Identification",
    fields: [
      {
        id: "hostname",
        label: "Nom machine",
        editableFieldId: "hostname",
        getValue: (marker) => marker.technicalDetails.hostname,
      },
      {
        id: "sesi",
        label: "SESI",
        editableFieldId: "directoryAccount",
        getEditValue: (marker) => marker.technicalDetails.directoryAccount,
        getValue: (marker) =>
          formatSesiValue(marker.technicalDetails.directoryAccount),
      },
      {
        id: "collaborateur",
        label: "Collaborateur",
        editableFieldId: "contact",
        getValue: (marker) => marker.technicalDetails.contact,
      },
      {
        id: "sector",
        label: "Secteur",
        editableFieldId: "sector",
        getEditValue: (marker) =>
          marker.technicalDetails.floorLocation ??
          marker.technicalDetails.sector,
        getValue: (marker) =>
          marker.technicalDetails.floorLocation ??
          marker.technicalDetails.sector,
      },
      {
        id: "manufacturing-station-name",
        label: "Poste de fabrication",
        editableFieldId: "manufacturingStationNames",
        getValue: (marker) => marker.technicalDetails.manufacturingStationNames,
      },
    ],
  },
  {
    title: "Equipement",
    fields: [
      {
        id: "equipment-type",
        label: "Type d'equipement",
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
        label: "Stockage",
        editableFieldId: "storage",
        getValue: (marker) => marker.technicalDetails.storage,
      },
      {
        id: "os-type",
        label: "Systeme d'exploitation",
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
        label: "Perimetre reseau",
        editableFieldId: "networkScope",
        getValue: (marker) => marker.technicalDetails.networkScope,
      },
      {
        id: "old-ip-address",
        label: "Ancienne adresse IP",
        editableFieldId: "oldIpAddress",
        getValue: (marker) => marker.technicalDetails.oldIpAddress,
      },
      {
        id: "new-ip-address",
        label: "Nouvelle adresse IP",
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
        label: "ID port",
        editableFieldId: "idPort",
        getValue: (marker) => marker.technicalDetails.idPort,
      },
      {
        id: "new-port-auto",
        label: "Nouveau port auto",
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
        id: "gateway",
        label: "Passerelle",
        editableFieldId: "gateway",
        getValue: (marker) => marker.technicalDetails.gateway,
      },
      {
        id: "ticket-brassage",
        label: "Ticket de brassage",
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
        id: "etat",
        label: "Etat",
        editableFieldId: "etat",
        getValue: (marker) => marker.technicalDetails.etat,
      },
      {
        id: "connected-switch-name",
        label: "Switch connecte",
        editableFieldId: "connectedToSwitchName",
        getValue: (marker) => marker.technicalDetails.connectedToSwitchName,
      },
      {
        id: "connected-switch-port",
        label: "Port du switch connecte",
        editableFieldId: "connectedToSwitchPort",
        getValue: (marker) => marker.technicalDetails.connectedToSwitchPort,
      },
      {
        id: "wifi-wired-connection",
        label: "Type de connexion",
        editableFieldId: "wifiOrWiredConnection",
        getEditValue: (marker) =>
          marker.technicalDetails.wifiOrWiredConnection ??
          marker.technicalDetails.connectionType,
        getValue: (marker) =>
          marker.technicalDetails.wifiOrWiredConnection ??
          marker.technicalDetails.connectionType,
      },
      {
        id: "login",
        label: "Compte",
        editableFieldId: "directoryAccount",
        getEditValue: (marker) => marker.technicalDetails.directoryAccount,
        getValue: (marker) => marker.technicalDetails.directoryAccount,
      },
    ],
  },
  {
    title: "Autre",
    fields: [
      {
        id: "pin",
        label: "Clé (PIN)",
        editableFieldId: "pinKey",
        getValue: (marker) => marker.technicalDetails.pinKey,
      },
      {
        id: "date",
        label: "Date",
        editableFieldId: "lastInventoryDate",
        getEditValue: (marker) =>
          marker.technicalDetails.lastInventoryDate === undefined
            ? undefined
            : marker.technicalDetails.lastInventoryDate,
        getValue: (marker) => marker.technicalDetails.lastInventoryDate,
      },
      {
        id: "sap",
        label: "SAP",
        editableFieldId: "sap",
        getValue: (marker) => marker.technicalDetails.sap,
      },
      {
        id: "security-status",
        label: "Status securite",
        editableFieldId: "securityStatus",
        getValue: (marker) => marker.technicalDetails.securityStatus,
      },
      {
        id: "commentaire2",
        label: "Commentaire",
        editableFieldId: "commentaire2",
        getEditValue: (marker) =>
          marker.technicalDetails.commentaire2 ?? marker.technicalDetails.comment,
        getValue: (marker) =>
          marker.technicalDetails.commentaire2 ?? marker.technicalDetails.comment,
      },
    ],
  },
];
