import {
  formatDirectoryAccountValue,
  getResolvedPcComment,
  getResolvedPcConnectionType,
  getResolvedPcLocation,
} from "@/features/infrastructure-map/model/pcValueResolvers";
import {
  createEditableDetailField,
  getTechnicalDetailValue,
} from "@/features/infrastructure-map/pc-details/ui/content/fieldFactories";
import type { DetailSectionDefinition } from "@/features/infrastructure-map/pc-details/ui/content/types";

export const DETAIL_SECTION_DEFINITIONS: DetailSectionDefinition[] = [
  {
    title: "Identification",
    fields: [
      createEditableDetailField(
        "collaborateur",
        "Collaborateur",
        "contact",
        getTechnicalDetailValue("contact"),
      ),
      createEditableDetailField(
        "pin",
        "Cle PIN",
        "pinKey",
        getTechnicalDetailValue("pinKey"),
      ),
      createEditableDetailField(
        "location",
        "Emplacement",
        "sector",
        (marker) => getResolvedPcLocation(marker.technicalDetails),
        (marker) => getResolvedPcLocation(marker.technicalDetails),
      ),
      createEditableDetailField(
        "prodsheet",
        "Prodsheet",
        "prodsheet",
        getTechnicalDetailValue("prodsheet"),
      ),
      createEditableDetailField(
        "manufacturing-station",
        "Poste fabrication",
        "manufacturingStationNames",
        getTechnicalDetailValue("manufacturingStationNames"),
      ),
      createEditableDetailField(
        "date",
        "Date inventaire",
        "lastInventoryDate",
        getTechnicalDetailValue("lastInventoryDate"),
      ),
    ],
  },
  {
    title: "Equipement",
    fields: [
      createEditableDetailField(
        "equipment-type",
        "Type equipement",
        "assetType",
        getTechnicalDetailValue("assetType"),
      ),
      createEditableDetailField(
        "brand",
        "Marque",
        "manufacturer",
        getTechnicalDetailValue("manufacturer"),
      ),
      createEditableDetailField(
        "model",
        "Modele",
        "model",
        getTechnicalDetailValue("model"),
      ),
      createEditableDetailField(
        "serial-number",
        "Numero de serie",
        "serialNumber",
        getTechnicalDetailValue("serialNumber"),
      ),
      createEditableDetailField(
        "hdd",
        "HDD",
        "storage",
        getTechnicalDetailValue("storage"),
      ),
      createEditableDetailField(
        "hostname",
        "Nom machine",
        "hostname",
        getTechnicalDetailValue("hostname"),
      ),
      createEditableDetailField("sap", "SAP", "sap", getTechnicalDetailValue("sap")),
      createEditableDetailField(
        "os-type",
        "Systeme",
        "operatingSystem",
        getTechnicalDetailValue("operatingSystem"),
      ),
    ],
  },
  {
    title: "Reseau",
    fields: [
      createEditableDetailField(
        "mac-address",
        "Adresse MAC",
        "macAddress",
        getTechnicalDetailValue("macAddress"),
      ),
      createEditableDetailField(
        "ip-address",
        "Adresse IP",
        "ipAddress",
        getTechnicalDetailValue("ipAddress"),
      ),
      createEditableDetailField(
        "subnet",
        "Sous-reseau",
        "subnetMask",
        getTechnicalDetailValue("subnetMask"),
      ),
      createEditableDetailField(
        "vlan-id-name",
        "VLAN",
        "vlan",
        getTechnicalDetailValue("vlan"),
      ),
      createEditableDetailField(
        "vlan-name",
        "Nom VLAN",
        "networkScope",
        getTechnicalDetailValue("networkScope"),
      ),
      createEditableDetailField(
        "old-ip-address",
        "Ancienne IP",
        "oldIpAddress",
        getTechnicalDetailValue("oldIpAddress"),
      ),
      createEditableDetailField(
        "new-ip-address",
        "Nouvelle IP",
        "newIpAddress",
        getTechnicalDetailValue("newIpAddress"),
      ),
      createEditableDetailField(
        "vlan-new",
        "Nouveau VLAN",
        "vlanNew",
        getTechnicalDetailValue("vlanNew"),
      ),
      createEditableDetailField(
        "id-port",
        "Port ID",
        "idPort",
        getTechnicalDetailValue("idPort"),
      ),
      createEditableDetailField(
        "new-port-auto",
        "Nouveau port",
        "newPortAuto",
        getTechnicalDetailValue("newPortAuto"),
      ),
      createEditableDetailField(
        "switch-name",
        "Nom du switch",
        "switchName",
        getTechnicalDetailValue("switchName"),
      ),
      createEditableDetailField(
        "switch-ip",
        "IP du switch",
        "switchIpAddress",
        getTechnicalDetailValue("switchIpAddress"),
      ),
      createEditableDetailField(
        "ticket-brassage",
        "Ticket Brassage",
        "ticketBrassage",
        getTechnicalDetailValue("ticketBrassage"),
      ),
      createEditableDetailField(
        "ip-filter",
        "Filtre IP",
        "ipFilter",
        getTechnicalDetailValue("ipFilter"),
      ),
      createEditableDetailField(
        "status",
        "Etat",
        "status",
        getTechnicalDetailValue("status"),
      ),
      createEditableDetailField(
        "connected-switch-name",
        "Switch connecte",
        "connectedToSwitchName",
        getTechnicalDetailValue("connectedToSwitchName"),
      ),
      createEditableDetailField(
        "connected-switch-port",
        "Port switch connecte",
        "connectedToSwitchPort",
        getTechnicalDetailValue("connectedToSwitchPort"),
      ),
      createEditableDetailField(
        "wifi-wired-connection",
        "Connexion",
        "wifiOrWiredConnection",
        (marker) => getResolvedPcConnectionType(marker.technicalDetails),
        (marker) => getResolvedPcConnectionType(marker.technicalDetails),
      ),
      createEditableDetailField(
        "directory-account",
        "Compte",
        "directoryAccount",
        (marker) =>
          formatDirectoryAccountValue(marker.technicalDetails.directoryAccount),
        getTechnicalDetailValue("directoryAccount"),
      ),
    ],
  },
  {
    title: "Notes",
    fields: [
      createEditableDetailField(
        "secondary-comment",
        "Commentaire",
        "secondaryComment",
        (marker) => getResolvedPcComment(marker.technicalDetails),
        (marker) => getResolvedPcComment(marker.technicalDetails),
      ),
    ],
  },
];
