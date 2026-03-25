import type { InteractiveMarker } from "../../shared/types";

/** Fallback label displayed when a detail value is missing. */
const EMPTY_FIELD_VALUE = "N/A";

/** One field definition used to derive a visible card from a marker. */
interface DetailFieldDefinition {
  id: string;
  label: string;
  getValue: (marker: InteractiveMarker) => string | undefined;
}

/** One section definition displayed in the detail card. */
interface DetailSectionDefinition {
  fields: DetailFieldDefinition[];
  title: string;
}

/** Field with a guaranteed display value ready for rendering. */
export interface VisiblePcDetailField {
  id: string;
  label: string;
  value: string;
}

/** One rendered section displayed in the detail card. */
export interface VisiblePcDetailSection {
  items: VisiblePcDetailField[];
  title: string;
}

/** Summary fields displayed in the top grid of the detail card. */
const SUMMARY_FIELD_DEFINITIONS: DetailFieldDefinition[] = [
  {
    id: "hostname",
    label: "Hostname",
    getValue: (marker) => marker.technicalDetails.hostname,
  },
  {
    id: "prodsched",
    label: "Prodsched",
    getValue: (marker) => marker.technicalDetails.prodsched,
  },
  {
    id: "manufacturing-station-names",
    label: "Manufacturing Station names",
    getValue: (marker) => marker.technicalDetails.manufacturingStationNames,
  },
  {
    id: "model",
    label: "Model",
    getValue: (marker) => marker.technicalDetails.model,
  },
  {
    id: "sesi",
    label: "SESI",
    getValue: (marker) => formatSesiValue(marker.technicalDetails.directoryAccount),
  },
];

/** Secondary detail sections displayed below the summary grid. */
const DETAIL_SECTION_DEFINITIONS: DetailSectionDefinition[] = [
  {
    title: "Identification",
    fields: [
      {
        id: "collaborateur",
        label: "Collaborateur",
        getValue: (marker) => marker.technicalDetails.contact,
      },
      {
        id: "pin",
        label: "Clé (PIN)",
        getValue: (marker) => marker.technicalDetails.pinKey,
      },
      {
        id: "floor-location",
        label: "Location physical location on floor",
        getValue: (marker) =>
          marker.technicalDetails.floorLocation ??
          marker.technicalDetails.sector ??
          marker.technicalDetails.location,
      },
      {
        id: "date",
        label: "Date",
        getValue: (marker) => marker.technicalDetails.lastInventoryDate,
      },
    ],
  },
  {
    title: "Equipment",
    fields: [
      {
        id: "equipment-type",
        label: "Type of equipment (PLC, Sensor, ComXbox)",
        getValue: (marker) => marker.technicalDetails.assetType,
      },
      {
        id: "brand",
        label: "Brand",
        getValue: (marker) => marker.technicalDetails.manufacturer,
      },
      {
        id: "sap",
        label: "SAP",
        getValue: (marker) => marker.technicalDetails.sap,
      },
      {
        id: "serial-number",
        label: "Serial Number",
        getValue: (marker) => marker.technicalDetails.serialNumber,
      },
      {
        id: "hdd",
        label: "HDD",
        getValue: (marker) => marker.technicalDetails.storage,
      },
      {
        id: "os-type",
        label: "OS Type",
        getValue: (marker) => marker.technicalDetails.operatingSystem,
      },
    ],
  },
  {
    title: "Network",
    fields: [
      {
        id: "mac-address",
        label: "MAC Address 1",
        getValue: (marker) => marker.technicalDetails.macAddress,
      },
      {
        id: "ip-address",
        label: "IP address 1",
        getValue: (marker) => marker.technicalDetails.ipAddress,
      },
      {
        id: "subnet",
        label: "Subnet 1",
        getValue: (marker) => marker.technicalDetails.subnetMask,
      },
      {
        id: "vlan-id-name",
        label: "VLAN id/name",
        getValue: (marker) => marker.technicalDetails.vlan,
      },
      {
        id: "vlan-name",
        label: "VLAN Name",
        getValue: (marker) => marker.technicalDetails.networkScope,
      },
      {
        id: "old-ip-address",
        label: "Old IP address",
        getValue: (marker) =>
          marker.technicalDetails.oldIpAddress ?? marker.technicalDetails.gateway,
      },
      {
        id: "new-ip-address",
        label: "New IP address",
        getValue: (marker) =>
          marker.technicalDetails.newIpAddress ?? marker.technicalDetails.ipAddress,
      },
      {
        id: "vlan-new",
        label: "VLAN New",
        getValue: (marker) =>
          marker.technicalDetails.vlanNew ?? marker.technicalDetails.vlan,
      },
    ],
  },
  {
    title: "Switch / Access",
    fields: [
      {
        id: "id-port",
        label: "ID PORT",
        getValue: (marker) =>
          marker.technicalDetails.idPort ?? marker.technicalDetails.switchPort,
      },
      {
        id: "new-port-auto",
        label: "New PORT AUTO",
        getValue: (marker) =>
          marker.technicalDetails.newPortAuto ?? marker.technicalDetails.switchPort,
      },
      {
        id: "switch-name",
        label: "NOM SWITCH",
        getValue: (marker) => marker.technicalDetails.switchName,
      },
      {
        id: "switch-ip",
        label: "IP SWITCH",
        getValue: (marker) => marker.technicalDetails.switchIpAddress,
      },
      {
        id: "ticket-brassage",
        label: "Ticket Brassage",
        getValue: (marker) => marker.technicalDetails.ticketBrassage,
      },
      {
        id: "ip-filter",
        label: "Filtre IP",
        getValue: (marker) => marker.technicalDetails.ipFilter,
      },
      {
        id: "etat",
        label: "Etat",
        getValue: (marker) =>
          marker.technicalDetails.etat ?? marker.technicalDetails.securityStatus,
      },
      {
        id: "connected-switch-name",
        label: "Connected to SWITCH Name",
        getValue: (marker) =>
          marker.technicalDetails.connectedToSwitchName ??
          marker.technicalDetails.switchName,
      },
      {
        id: "connected-switch-port",
        label: "Connected to SWITCH Port",
        getValue: (marker) =>
          marker.technicalDetails.connectedToSwitchPort ??
          marker.technicalDetails.switchPort,
      },
      {
        id: "wifi-wired-connection",
        label: "Wifi or Wired Connection",
        getValue: (marker) =>
          marker.technicalDetails.wifiOrWiredConnection ??
          marker.technicalDetails.connectionType,
      },
      {
        id: "login",
        label: "Login",
        getValue: (marker) => marker.technicalDetails.directoryAccount,
      },
      {
        id: "commentaire2",
        label: "Commentaire2",
        getValue: (marker) =>
          marker.technicalDetails.commentaire2 ?? marker.technicalDetails.comment,
      },
    ],
  },
];

/**
 * Builds the short subtitle displayed under the marker identifier.
 *
 * @param marker Selected marker.
 * @returns Subtitle string.
 */
export function buildPcSubtitle(marker: InteractiveMarker): string {
  return [
    marker.technicalDetails.prodsched,
    marker.technicalDetails.manufacturingStationNames,
    marker.technicalDetails.model,
  ]
    .filter(isVisibleText)
    .join(" • ");
}

/**
 * Builds the summary cards displayed at the top of the detail panel.
 *
 * @param marker Selected marker.
 * @returns Summary cards ready for rendering.
 */
export function buildPcSummaryFields(
  marker: InteractiveMarker,
): VisiblePcDetailField[] {
  return buildVisibleFields(marker, SUMMARY_FIELD_DEFINITIONS);
}

/**
 * Builds every detail section displayed below the summary cards.
 *
 * @param marker Selected marker.
 * @returns Detail sections ready for rendering.
 */
export function buildPcDetailSections(
  marker: InteractiveMarker,
): VisiblePcDetailSection[] {
  return DETAIL_SECTION_DEFINITIONS.map((section) => ({
    title: section.title,
    items: buildVisibleFields(marker, section.fields),
  }));
}

/**
 * Converts optional raw values into always-renderable field definitions.
 *
 * @param marker Selected marker.
 * @param fields Raw field definitions.
 * @returns Fields with fallback display values.
 */
function buildVisibleFields(
  marker: InteractiveMarker,
  fields: DetailFieldDefinition[],
): VisiblePcDetailField[] {
  return fields.map((field) => ({
    id: field.id,
    label: field.label,
    value: getDisplayValue(field.getValue(marker)),
  }));
}

/**
 * Returns a fallback display string for empty values.
 *
 * @param value Raw value.
 * @returns Original value or the shared empty-field placeholder.
 */
function getDisplayValue(value: string | undefined): string {
  return isVisibleText(value) ? value : EMPTY_FIELD_VALUE;
}

/**
 * Checks whether a value contains non-empty text.
 *
 * @param value Candidate text value.
 * @returns `true` when the text should be displayed.
 */
function isVisibleText(value: string | undefined): value is string {
  return value !== undefined && value.trim().length > 0;
}

/**
 * Extracts the account name from a domain-qualified SESI value.
 *
 * @param directoryAccount Raw directory account.
 * @returns Displayable account name.
 */
function formatSesiValue(directoryAccount: string | undefined): string | undefined {
  if (directoryAccount === undefined) {
    return undefined;
  }

  const [, account = directoryAccount] = directoryAccount.split("\\");

  return account.trim().length > 0 ? account : directoryAccount;
}
