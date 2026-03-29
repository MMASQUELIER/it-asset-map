import type {
  PcTechnicalDetails,
  PlacementPcCandidate,
} from "../../shared/types";

type BackendAssetRecord = Record<string, unknown>;

const COLUMN_KEYS = {
  collaborator: "Collaborateur",
  pinKey: "Clé (PIN)",
  sector: "Location\nphysical location on floor",
  prodsched: "Prodsched",
  stationName: "Manufacturing Station names",
  lastInventoryDate: "Date",
  assetType: "Type of equipment\n(PLC, Sensor, ComXboX)",
  manufacturer: "Brand",
  model: "Model",
  serialNumber: "Serial Number",
  storage: "HDD",
  hostname: "Hostname",
  sap: "SAP",
  operatingSystem: "OS Type",
  macAddress: "MAC Address 1",
  ipAddress: "IP address 1",
  subnetMask: "Subnet 1",
  vlan: "VLAN id/name",
  networkScope: "VLAN Name",
  oldIpAddress: "Old IP address",
  newIpAddress: "New IP address ",
  vlanNew: "VLAN New",
  idPort: "ID PORT",
  newPortAuto: "New PORT AUTO",
  switchName: "NOM SWITCH",
  switchIpAddress: "IP SWITCH",
  ticketBrassage: "Ticket Brassage",
  ipFilter: "Filtre IP",
  etat: "Etat",
  connectedToSwitchName: "Connected to SWITCH Name ",
  connectedToSwitchPort: "Connected to SWITCH Port",
  wifiOrWiredConnection: "WiFi or Wired Connection",
  directoryAccount: "Login",
  gateway: "Passerelle",
  comment: "Commentaire",
  commentaire2: "Commentaire2",
  securityStatus: "McAfee Client Installed",
} as const;

const PC_ASSET_TYPE = "PC";

/**
 * Converts raw backend asset rows into searchable PC candidates.
 *
 * @param assets Raw rows returned by the backend Excel endpoint.
 * @returns Searchable and uniquely identifiable PC placement candidates.
 */
export function buildPlacementPcCandidates(
  assets: BackendAssetRecord[],
): PlacementPcCandidate[] {
  const markerIdUsage = new Map<string, number>();

  return assets
    .filter(isPcAsset)
    .map((asset, index) => createPlacementPcCandidate(asset, index, markerIdUsage));
}

/**
 * Filters and ranks placement candidates against a free-text query.
 *
 * @param candidates Available placement candidates.
 * @param query User-entered search query.
 * @param limit Maximum number of results to return.
 * @returns Filtered candidates sorted by relevance.
 */
export function searchPlacementPcCandidates(
  candidates: PlacementPcCandidate[],
  query: string,
  limit = 10,
): PlacementPcCandidate[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (normalizedQuery.length === 0) {
    return candidates.slice(0, limit);
  }

  return candidates
    .map((candidate) => ({
      candidate,
      score: getPlacementCandidateScore(candidate, normalizedQuery),
    }))
    .filter((entry) => entry.score !== null)
    .sort((firstEntry, secondEntry) => {
      if (firstEntry.score !== secondEntry.score) {
        return (secondEntry.score ?? 0) - (firstEntry.score ?? 0);
      }

      return firstEntry.candidate.markerId.localeCompare(
        secondEntry.candidate.markerId,
        "fr",
      );
    })
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

/**
 * Checks whether one candidate belongs to a given sector.
 *
 * @param candidate Placement candidate.
 * @param sectorName Sector to compare against.
 * @returns `true` when the candidate can be placed inside that sector.
 */
export function doesPlacementCandidateMatchSector(
  candidate: PlacementPcCandidate,
  sectorName: string,
): boolean {
  return normalizeSearchValue(candidate.sector) === normalizeSearchValue(sectorName);
}

function isPcAsset(asset: BackendAssetRecord): boolean {
  return readCellText(asset[COLUMN_KEYS.assetType]).toUpperCase() === PC_ASSET_TYPE;
}

function createPlacementPcCandidate(
  asset: BackendAssetRecord,
  index: number,
  markerIdUsage: Map<string, number>,
): PlacementPcCandidate {
  const hostname = readMeaningfulCell(asset[COLUMN_KEYS.hostname]);
  const serialNumber = readMeaningfulCell(asset[COLUMN_KEYS.serialNumber]);
  const stationName =
    readMeaningfulCell(asset[COLUMN_KEYS.stationName]) ?? `Poste ${index + 1}`;
  const prodsched = readCellText(asset[COLUMN_KEYS.prodsched]);
  const sector = readCellText(asset[COLUMN_KEYS.sector]);
  const preferredMarkerId = hostname ?? serialNumber ?? `${prodsched}-${stationName}`;
  const markerId = buildUniqueMarkerId(preferredMarkerId, markerIdUsage);

  return {
    id: `${markerId}-${index}`,
    markerId,
    hostname: hostname ?? markerId,
    label: `${stationName} • ${prodsched}`,
    prodsched,
    sector,
    stationName,
    technicalDetails: mapAssetToTechnicalDetails(asset, markerId),
  };
}

function buildUniqueMarkerId(
  baseMarkerId: string,
  markerIdUsage: Map<string, number>,
): string {
  const normalizedBaseMarkerId = normalizeMarkerId(baseMarkerId);
  const nextUsageCount = (markerIdUsage.get(normalizedBaseMarkerId) ?? 0) + 1;

  markerIdUsage.set(normalizedBaseMarkerId, nextUsageCount);

  return nextUsageCount === 1
    ? normalizedBaseMarkerId
    : `${normalizedBaseMarkerId}-${String(nextUsageCount).padStart(2, "0")}`;
}

function mapAssetToTechnicalDetails(
  asset: BackendAssetRecord,
  markerId: string,
): PcTechnicalDetails {
  const sector = readCellText(asset[COLUMN_KEYS.sector]);
  const prodsched = readCellText(asset[COLUMN_KEYS.prodsched]);
  const stationName = readCellText(asset[COLUMN_KEYS.stationName]);
  const hostname = readMeaningfulCell(asset[COLUMN_KEYS.hostname]) ?? markerId;

  return {
    contact: readCellText(asset[COLUMN_KEYS.collaborator]),
    pinKey: readCellText(asset[COLUMN_KEYS.pinKey]),
    sector,
    floorLocation: sector,
    location: stationName,
    prodsched,
    manufacturingStationNames: stationName,
    lastInventoryDate: readCellText(asset[COLUMN_KEYS.lastInventoryDate]),
    assetType: readCellText(asset[COLUMN_KEYS.assetType]),
    manufacturer: readCellText(asset[COLUMN_KEYS.manufacturer]),
    model: readCellText(asset[COLUMN_KEYS.model]),
    sap: readCellText(asset[COLUMN_KEYS.sap]),
    hostname,
    operatingSystem: readCellText(asset[COLUMN_KEYS.operatingSystem], "N/A"),
    processor: "N/A",
    memory: "N/A",
    storage: readCellText(asset[COLUMN_KEYS.storage], "N/A"),
    ipAddress: readCellText(asset[COLUMN_KEYS.ipAddress], "N/A"),
    oldIpAddress: readMeaningfulCell(asset[COLUMN_KEYS.oldIpAddress]) ?? undefined,
    newIpAddress: readMeaningfulCell(asset[COLUMN_KEYS.newIpAddress]) ?? undefined,
    subnetMask: readMeaningfulCell(asset[COLUMN_KEYS.subnetMask]) ?? undefined,
    macAddress: readCellText(asset[COLUMN_KEYS.macAddress], "N/A"),
    vlan: readMeaningfulCell(asset[COLUMN_KEYS.vlan]) ?? undefined,
    vlanNew: readMeaningfulCell(asset[COLUMN_KEYS.vlanNew]) ?? undefined,
    networkScope: readMeaningfulCell(asset[COLUMN_KEYS.networkScope]) ?? undefined,
    gateway: readMeaningfulCell(asset[COLUMN_KEYS.gateway]) ?? undefined,
    idPort: readMeaningfulCell(asset[COLUMN_KEYS.idPort]) ?? undefined,
    switchPort: readMeaningfulCell(asset[COLUMN_KEYS.newPortAuto]) ?? undefined,
    newPortAuto: readMeaningfulCell(asset[COLUMN_KEYS.newPortAuto]) ?? undefined,
    switchName: readMeaningfulCell(asset[COLUMN_KEYS.switchName]) ?? undefined,
    connectedToSwitchName:
      readMeaningfulCell(asset[COLUMN_KEYS.connectedToSwitchName]) ?? undefined,
    switchIpAddress:
      readMeaningfulCell(asset[COLUMN_KEYS.switchIpAddress]) ?? undefined,
    connectedToSwitchPort:
      readMeaningfulCell(asset[COLUMN_KEYS.connectedToSwitchPort]) ?? undefined,
    connectionType:
      readMeaningfulCell(asset[COLUMN_KEYS.wifiOrWiredConnection]) ?? undefined,
    wifiOrWiredConnection:
      readMeaningfulCell(asset[COLUMN_KEYS.wifiOrWiredConnection]) ?? undefined,
    ticketBrassage:
      readMeaningfulCell(asset[COLUMN_KEYS.ticketBrassage]) ?? undefined,
    ipFilter: readMeaningfulCell(asset[COLUMN_KEYS.ipFilter]) ?? undefined,
    directoryAccount:
      readMeaningfulCell(asset[COLUMN_KEYS.directoryAccount]) ?? undefined,
    comment: readMeaningfulCell(asset[COLUMN_KEYS.comment]) ?? undefined,
    commentaire2: readMeaningfulCell(asset[COLUMN_KEYS.commentaire2]) ?? undefined,
    serialNumber: readCellText(asset[COLUMN_KEYS.serialNumber], markerId),
    etat: readMeaningfulCell(asset[COLUMN_KEYS.etat]) ?? undefined,
    securityStatus: readCellText(asset[COLUMN_KEYS.securityStatus], "N/A"),
  };
}

function getPlacementCandidateScore(
  candidate: PlacementPcCandidate,
  normalizedQuery: string,
): number | null {
  const searchableValues = [
    candidate.markerId,
    candidate.hostname,
    candidate.label,
    candidate.prodsched,
    candidate.sector,
    candidate.stationName,
    candidate.technicalDetails.contact ?? "",
  ];

  let bestScore: number | null = null;

  for (const value of searchableValues) {
    const normalizedValue = normalizeSearchValue(value);

    if (normalizedValue.length === 0) {
      continue;
    }

    if (normalizedValue === normalizedQuery) {
      return 1000;
    }

    if (normalizedValue.startsWith(normalizedQuery)) {
      bestScore = Math.max(bestScore ?? 0, 700 - normalizedValue.length);
      continue;
    }

    const matchIndex = normalizedValue.indexOf(normalizedQuery);

    if (matchIndex !== -1) {
      bestScore = Math.max(bestScore ?? 0, 420 - matchIndex);
    }
  }

  return bestScore;
}

function readMeaningfulCell(value: unknown): string | null {
  const text = readCellText(value);
  const normalizedText = text.toUpperCase();

  if (
    text.length === 0 ||
    normalizedText === "N/A" ||
    normalizedText === "NOT FOUND" ||
    normalizedText === "RESERVE"
  ) {
    return null;
  }

  return text;
}

function readCellText(value: unknown, fallbackValue = ""): string {
  if (value === null || value === undefined) {
    return fallbackValue;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : fallbackValue;
}

function normalizeMarkerId(value: string): string {
  return value
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .trim()
    .toLowerCase();
}
