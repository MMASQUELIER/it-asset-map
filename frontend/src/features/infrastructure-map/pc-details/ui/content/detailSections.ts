import type { DetailSectionDefinition } from "@/features/infrastructure-map/pc-details/ui/content/types";
import { formatSesiValue } from "@/features/infrastructure-map/pc-details/ui/content/valueFormatting";

/**
 * Configuration des panneaux repliables de la vue detail d'un PC.
 */
export const DETAIL_SECTION_DEFINITIONS: DetailSectionDefinition[] = [
  {
    title: "Identification",
    fields: [
      { id: "hostname", label: "Nom machine", getValue: (marker) => marker.technicalDetails.hostname },
      {
        id: "sesi",
        label: "SESI",
        getValue: (marker) =>
          formatSesiValue(marker.technicalDetails.directoryAccount),
      },
      { id: "collaborateur", label: "Collaborateur", getValue: (marker) => marker.technicalDetails.contact },
      {
        id: "sector",
        label: "Secteur",
        getValue: (marker) =>
          marker.technicalDetails.floorLocation ??
          marker.technicalDetails.sector,
      },
      {
        id: "manufacturing-station-name",
        label: "Poste de fabrication",
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
        getValue: (marker) => marker.technicalDetails.assetType,
      },
      {
        id: "brand",
        label: "Marque",
        getValue: (marker) => marker.technicalDetails.manufacturer,
      },
      {
        id: "model",
        label: "Modele",
        getValue: (marker) => marker.technicalDetails.model,
      },
      {
        id: "serial-number",
        label: "Numero de serie",
        getValue: (marker) => marker.technicalDetails.serialNumber,
      },
      {
        id: "hdd",
        label: "Stockage",
        getValue: (marker) => marker.technicalDetails.storage,
      },
      {
        id: "os-type",
        label: "Systeme d'exploitation",
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
        getValue: (marker) => marker.technicalDetails.macAddress 
      },
      { 
        id: "ip-address", 
        label: "Adresse IP", 
        getValue: (marker) => marker.technicalDetails.ipAddress },
      { 
        id: "subnet", 
        label: "Sous-reseau", 
        getValue: (marker) => marker.technicalDetails.subnetMask },
      { 
        id: "vlan-id-name", 
        label: "VLAN", 
        getValue: (marker) => marker.technicalDetails.vlan },
      { 
        id: "vlan-name", 
        label: "Perimetre reseau", 
        getValue: (marker) => marker.technicalDetails.networkScope },
      {
        id: "old-ip-address",
        label: "Ancienne adresse IP",
        getValue: (marker) => marker.technicalDetails.oldIpAddress,
      },
      {
        id: "new-ip-address",
        label: "Nouvelle adresse IP",
        getValue: (marker) => marker.technicalDetails.newIpAddress,
      },
      {
        id: "vlan-new",
        label: "Nouveau VLAN",
        getValue: (marker) => marker.technicalDetails.vlanNew,
      },
      {
        id: "id-port",
        label: "ID port",
        getValue: (marker) => marker.technicalDetails.idPort,
      },
      {
        id: "new-port-auto",
        label: "Nouveau port auto",
        getValue: (marker) => marker.technicalDetails.newPortAuto,
      },
      { 
        id: "switch-name", 
        label: "Nom du switch", 
        getValue: (marker) => marker.technicalDetails.switchName 
      },
      { 
        id: "switch-ip", 
        label: "IP du switch", 
        getValue: (marker) => marker.technicalDetails.switchIpAddress 
      },
      { 
        id: "gateway", 
        label: "Passerelle", 
        getValue: (marker) => marker.technicalDetails.gateway 
      },
      { 
        id: "ticket-brassage", 
        label: "Ticket de brassage", 
        getValue: (marker) => marker.technicalDetails.ticketBrassage 
      },
      { 
        id: "ip-filter", 
        label: "Filtre IP", 
        getValue: (marker) => marker.technicalDetails.ipFilter 
      },
      { 
        id: "etat", 
        label: "Etat", 
        getValue: (marker) => marker.technicalDetails.etat 
      },
      {
        id: "connected-switch-name",
        label: "Switch connecte",
        getValue: (marker) => marker.technicalDetails.connectedToSwitchName,
      },
      {
        id: "connected-switch-port",
        label: "Port du switch connecte",
        getValue: (marker) => marker.technicalDetails.connectedToSwitchPort,
      },
      {
        id: "wifi-wired-connection",
        label: "Type de connexion",
        getValue: (marker) =>
          marker.technicalDetails.wifiOrWiredConnection ??
          marker.technicalDetails.connectionType,
      },
      {
        id: "login",
        label: "Compte",
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
        getValue: (marker) => marker.technicalDetails.pinKey 
      },
      { 
        id: "date", 
        label: "Date", 
        getValue: (marker) => marker.technicalDetails.lastInventoryDate 
      },
      { 
        id: "sap", 
        label: "SAP", 
        getValue: (marker) => marker.technicalDetails.sap 
      },
      {
        id: "security-status",
        label: "status securite",
        getValue: (marker) => marker.technicalDetails.securityStatus,
      },
      {
        id: "commentaire2",
        label: "Commentaire",
        getValue: (marker) =>
          marker.technicalDetails.commentaire2 ?? marker.technicalDetails.comment,
      },
    ],
  },
];
