import type { PcTechnicalDetails } from "../../shared/types";
import {
  DEVICE_PROFILES,
  TEMP_ZONE_PROFILE,
  ZONE_PROFILES,
  type DeviceProfile,
  type ZoneProfile,
} from "../data/pcTechnicalProfiles";
import { CMDB_PC_DETAILS_BY_ID } from "../data/pcTechnicalOverrides";

/** Input used to generate default PC details. */
interface DefaultPcDetailsOptions {
  normalizedId: string;
  sequence: number;
  zoneId: number | null;
}

/**
 * Generates the technical details associated with a PC identifier and zone.
 *
 * The function first builds a coherent default record from zone and hardware
 * profiles, then applies any manual overrides that exist for that identifier.
 *
 * @param pcId PC identifier.
 * @param zoneId Zone currently containing the marker.
 * @returns Complete technical details for the marker.
 */
export function createPcTechnicalDetails(
  pcId: string,
  zoneId: number | null,
): PcTechnicalDetails {
  const sequence = extractSequence(pcId);
  const normalizedId = normalizePcId(pcId);

  return {
    ...buildDefaultPcDetails({
      normalizedId,
      sequence,
      zoneId,
    }),
    ...CMDB_PC_DETAILS_BY_ID[normalizedId],
  };
}

/**
 * Builds a fully generated default record before CMDB overrides are applied.
 *
 * @param options Normalized PC information used for generation.
 * @returns Generated default technical details.
 */
function buildDefaultPcDetails({
  normalizedId,
  sequence,
  zoneId,
}: DefaultPcDetailsOptions): PcTechnicalDetails {
  const zoneProfile = getZoneProfile(zoneId);
  const deviceProfile = DEVICE_PROFILES[zoneProfile.deviceProfileId];
  const hostname = createHostname(zoneProfile, deviceProfile, sequence);
  const ipAddress = createIpAddress(
    zoneProfile.newIpNetwork,
    zoneProfile.newIpHostBase,
    sequence,
  );
  const oldIpAddress = createIpAddress(
    zoneProfile.oldIpNetwork,
    zoneProfile.oldIpHostBase,
    sequence,
  );
  const idPort = createPort(
    zoneProfile.oldPortPrefix,
    zoneProfile.oldPortStart,
    sequence,
  );
  const switchPort = createPort(
    zoneProfile.newPortPrefix,
    zoneProfile.newPortStart,
    sequence,
  );

  return {
    site: zoneProfile.site,
    contact: zoneProfile.contact,
    pinKey: zoneProfile.pinKey,
    sector: zoneProfile.floorLocation,
    floorLocation: zoneProfile.floorLocation,
    location: `${zoneProfile.locationPrefix}${String(sequence).padStart(2, "0")}`,
    prodsched: zoneProfile.prodsched,
    manufacturingStationNames: zoneProfile.manufacturingStationNames,
    lastInventoryDate: zoneProfile.lastInventoryDate,
    assetType: zoneProfile.assetType,
    manufacturer: deviceProfile.manufacturer,
    model: deviceProfile.model,
    sap: zoneProfile.sap,
    hostname,
    operatingSystem: deviceProfile.operatingSystem,
    processor: deviceProfile.processor,
    memory: deviceProfile.memory,
    storage: deviceProfile.storage,
    ipAddress,
    oldIpAddress,
    newIpAddress: ipAddress,
    subnetMask: zoneProfile.subnetMask,
    macAddress: createMacAddress(zoneId, sequence),
    vlan: zoneProfile.vlan,
    vlanNew: zoneProfile.vlan,
    networkScope: zoneProfile.vlanName,
    gateway: createGateway(zoneProfile.newIpNetwork),
    idPort,
    switchPort,
    newPortAuto: switchPort,
    switchName: zoneProfile.switchName,
    connectedToSwitchName: zoneProfile.connectedToSwitchName,
    switchIpAddress: zoneProfile.switchIpAddress,
    connectedToSwitchPort: switchPort,
    connectionType: zoneProfile.wifiOrWiredConnection,
    wifiOrWiredConnection: zoneProfile.wifiOrWiredConnection,
    ticketBrassage: String(zoneProfile.ticketBrassageBase + sequence),
    ipFilter: zoneProfile.ipFilter,
    directoryAccount: createSesiAccount(zoneProfile.prodsched, sequence),
    comment: `Inventaire coherent genere pour ${normalizedId}`,
    commentaire2: "N/A",
    serialNumber: createSerialNumber(
      deviceProfile,
      zoneProfile.prodsched,
      sequence,
    ),
    etat: zoneProfile.etat,
    securityStatus: "Conforme",
  };
}

/**
 * Resolves the zone profile matching a zone identifier.
 *
 * @param zoneId Candidate zone identifier.
 * @returns Matching zone profile or the temporary fallback profile.
 */
function getZoneProfile(zoneId: number | null): ZoneProfile {
  if (zoneId === null) {
    return TEMP_ZONE_PROFILE;
  }

  return ZONE_PROFILES[zoneId] ?? TEMP_ZONE_PROFILE;
}

/**
 * Normalises a PC identifier so it can be used as a lookup key.
 *
 * @param pcId Raw PC identifier.
 * @returns Uppercased identifier with non-alphanumeric separators normalised.
 */
function normalizePcId(pcId: string): string {
  return pcId.replace(/[^A-Z0-9]+/gi, "-").toUpperCase();
}

/**
 * Extracts the trailing numeric sequence from a PC identifier.
 *
 * @param pcId Raw PC identifier.
 * @returns Parsed numeric suffix or `1` when none exists.
 */
function extractSequence(pcId: string): number {
  const match = pcId.match(/(\d+)$/);

  return match === null ? 1 : Number.parseInt(match[1], 10);
}

/**
 * Generates a hostname from the zone and hardware profiles.
 *
 * @param zoneProfile Zone profile.
 * @param deviceProfile Hardware profile.
 * @param sequence PC sequence inside the zone.
 * @returns Generated hostname.
 */
function createHostname(
  zoneProfile: ZoneProfile,
  deviceProfile: DeviceProfile,
  sequence: number,
): string {
  const zoneLabel = normalizeNumericZoneLabel(zoneProfile.prodsched);

  return `CLA${zoneLabel}${deviceProfile.hostnamePrefix}${String(sequence).padStart(2, "0")}`;
}

/**
 * Generates a serial number from the hardware profile and PC sequence.
 *
 * @param deviceProfile Hardware profile.
 * @param prodsched Zone production schedule label.
 * @param sequence PC sequence inside the zone.
 * @returns Generated serial number.
 */
function createSerialNumber(
  deviceProfile: DeviceProfile,
  prodsched: string,
  sequence: number,
): string {
  const zoneLabel = normalizeNumericZoneLabel(prodsched);

  return `${deviceProfile.serialPrefix}${zoneLabel}${String(sequence).padStart(3, "0")}`;
}

/**
 * Generates an IP address inside the given network.
 *
 * @param networkPrefix First three bytes of the network.
 * @param hostBase Base host index.
 * @param sequence PC sequence inside the zone.
 * @returns Generated IP address.
 */
function createIpAddress(
  networkPrefix: string,
  hostBase: number,
  sequence: number,
): string {
  return `${networkPrefix}.${hostBase + sequence}`;
}

/**
 * Returns the standard gateway address for a generated network.
 *
 * @param networkPrefix First three bytes of the network.
 * @returns Gateway address.
 */
function createGateway(networkPrefix: string): string {
  return `${networkPrefix}.254`;
}

/**
 * Generates a switch port label from a prefix and sequence offset.
 *
 * @param portPrefix Switch port prefix.
 * @param portStart Starting port number.
 * @param sequence PC sequence inside the zone.
 * @returns Generated port label.
 */
function createPort(
  portPrefix: string,
  portStart: number,
  sequence: number,
): string {
  return `${portPrefix}${portStart + sequence}`;
}

/**
 * Generates a SESI account from the zone label and PC sequence.
 *
 * @param prodsched Zone production schedule label.
 * @param sequence PC sequence inside the zone.
 * @returns Generated directory account.
 */
function createSesiAccount(prodsched: string, sequence: number): string {
  const zoneLabel = normalizeNumericZoneLabel(prodsched);

  return `GAD\\SESI${zoneLabel}${String(sequence).padStart(3, "0")}`;
}

/**
 * Extracts and normalises the numeric portion of a zone label.
 *
 * @param prodsched Raw zone label.
 * @returns Zero-padded numeric zone label.
 */
function normalizeNumericZoneLabel(prodsched: string): string {
  const digits = prodsched.replace(/\D+/g, "");

  return digits.length > 0 ? digits.padStart(3, "0").slice(-3) : "999";
}

/**
 * Generates a deterministic MAC address from the zone and PC sequence.
 *
 * @param zoneId Zone identifier or `null`.
 * @param sequence PC sequence inside the zone.
 * @returns Generated MAC address.
 */
function createMacAddress(zoneId: number | null, sequence: number): string {
  const safeZoneId = zoneId ?? 999;
  const bytes = [
    0x8c,
    0x3b,
    Math.floor(safeZoneId / 100),
    safeZoneId % 100,
    sequence % 256,
    (safeZoneId + sequence * 13) % 256,
  ];

  return bytes.map(formatMacByte).join(":");
}

/**
 * Formats one MAC address byte in uppercase hexadecimal.
 *
 * @param value Byte value.
 * @returns Two-character hexadecimal byte.
 */
function formatMacByte(value: number): string {
  return value.toString(16).toUpperCase().padStart(2, "0");
}
