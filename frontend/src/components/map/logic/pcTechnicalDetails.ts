import type { PcTechnicalDetails } from "../../../types/layout";

const MANUFACTURERS = [
  "Lenovo",
  "Dell",
  "HP",
  "Schneider Electric",
];

const MODELS = [
  "M80Q",
  "OptiPlex 7000 Micro",
  "Elite Mini 600 G9",
  "Industrial Edge Station",
];

const OPERATING_SYSTEMS = [
  "Windows 11 Pro 23H2",
  "Windows 10 Enterprise LTSC",
  "Ubuntu 24.04 LTS",
  "Windows 11 IoT Enterprise",
];

const PROCESSORS = [
  "Intel Core i5-12400",
  "Intel Core i7-12700",
  "AMD Ryzen 5 PRO 5650G",
  "Intel Core i5-13500T",
];

const MEMORY_OPTIONS = [
  "16 Go DDR4",
  "32 Go DDR4",
  "16 Go DDR5",
  "32 Go DDR5",
];

const STORAGE_OPTIONS = [
  "SSD NVMe 512 Go",
  "SSD NVMe 1 To",
  "SSD SATA 512 Go",
  "SSD NVMe 2 To",
];

const SECURITY_STATUSES = [
  "Conforme",
  "Mise a jour requise",
  "Controle renforce",
];

const CMDB_PC_DETAILS_BY_ID: Record<string, Partial<PcTechnicalDetails>> = {
  "PC-200-01": {
    site: "CLA",
    contact: "Matthieu",
    sector: "SECTEUR TETE",
    location: "EMB9",
    lastInventoryDate: "2025-04-16",
    assetType: "PC",
    manufacturer: "Lenovo",
    model: "M80Q",
    hostname: "PC27BELK",
    storage: "HDD",
    serialNumber: "WTFRLVSE221154D",
    comment: "N/A",
    operatingSystem: "Windows 11",
    macAddress: "84:A9:38:7F:7D:97",
    ipAddress: "10.196.19.251",
    subnetMask: "255.255.255.0",
    vlan: "265",
    networkScope: "OT_Tetes",
    gateway: "10.196.40.173",
    switchPort: "GI1/0/10",
    switchName: "FR-IDE-22098-ASW-200-01.net.schneider-electric.com",
    switchIpAddress: "10.196.56.15",
    connectionType: "Wired",
    directoryAccount: "GAD\\SESI006010",
    securityStatus: "Source CMDB",
  },
};

export function createPcTechnicalDetails(
  pcId: string,
  zoneId: number | null,
): PcTechnicalDetails {
  const seed = computeSeed(pcId, zoneId);
  const sequence = extractSequence(pcId);
  const normalizedId = normalizePcId(pcId);
  const defaultDetails = buildDefaultPcDetails({
    normalizedId,
    seed,
    sequence,
    zoneId,
  });

  return {
    ...defaultDetails,
    ...CMDB_PC_DETAILS_BY_ID[normalizedId],
  };
}

interface DefaultPcDetailsOptions {
  normalizedId: string;
  seed: number;
  sequence: number;
  zoneId: number | null;
}

function buildDefaultPcDetails({
  normalizedId,
  seed,
  sequence,
  zoneId,
}: DefaultPcDetailsOptions): PcTechnicalDetails {
  const zoneLabel = zoneId === null ? "TEMP" : String(zoneId);
  const secondOctet = zoneId === null ? 250 : Math.floor(zoneId / 10) % 256;
  const thirdOctet = zoneId === null ? seed % 256 : zoneId % 10;
  const fourthOctet = 20 + (sequence % 200);

  return {
    site: "CLA",
    contact: `Equipe zone ${zoneLabel}`,
    sector: zoneId === null ? "Hors zone" : `Secteur ${zoneId}`,
    location: zoneId === null ? "Non assigne" : `Poste ${sequence}`,
    lastInventoryDate: "2026-03-20",
    assetType: "PC",
    manufacturer: pickBySeed(MANUFACTURERS, seed),
    model: pickBySeed(MODELS, seed + 1),
    hostname: `WS-${normalizedId}`,
    operatingSystem: pickBySeed(OPERATING_SYSTEMS, seed),
    processor: pickBySeed(PROCESSORS, seed + 1),
    memory: pickBySeed(MEMORY_OPTIONS, seed + 2),
    storage: pickBySeed(STORAGE_OPTIONS, seed + 3),
    ipAddress: `10.${secondOctet}.${thirdOctet}.${fourthOctet}`,
    subnetMask: "255.255.255.0",
    macAddress: createMacAddress(zoneId, seed, sequence),
    vlan: zoneId === null ? "N/A" : String(200 + (zoneId % 100)),
    networkScope: zoneId === null ? "Bureautique" : `OT_Zone_${zoneId}`,
    gateway: `10.${secondOctet}.${thirdOctet}.254`,
    switchPort: `GI1/0/${10 + (sequence % 24)}`,
    switchName: `FR-IDE-${zoneLabel.padStart(5, "0")}-ASW-01`,
    switchIpAddress: `10.${secondOctet}.${thirdOctet}.15`,
    connectionType: "Wired",
    directoryAccount: `GAD\\${normalizedId.replace(/-/g, "").slice(0, 10)}`,
    comment: "Inventaire genere localement",
    serialNumber: `SN-${zoneLabel}-${String(seed).padStart(4, "0")}-${String(sequence).padStart(2, "0")}`,
    securityStatus: pickBySeed(SECURITY_STATUSES, seed + 4),
  };
}

function computeSeed(pcId: string, zoneId: number | null): number {
  return pcId.split("").reduce((seed, character) => seed + character.charCodeAt(0), zoneId ?? 0);
}

function normalizePcId(pcId: string): string {
  return pcId.replace(/[^A-Z0-9]+/gi, "-").toUpperCase();
}

function extractSequence(pcId: string): number {
  const match = pcId.match(/(\d+)$/);

  return match === null ? 1 : Number.parseInt(match[1], 10);
}

function createMacAddress(
  zoneId: number | null,
  seed: number,
  sequence: number,
): string {
  const bytes = [
    0x02,
    zoneId === null ? 0xfa : Math.floor(zoneId / 10) % 256,
    zoneId === null ? 0x00 : zoneId % 10,
    seed % 256,
    (seed + sequence * 17) % 256,
    (sequence * 29) % 256,
  ];

  return bytes.map(formatMacByte).join(":");
}

function formatMacByte(value: number): string {
  return value.toString(16).toUpperCase().padStart(2, "0");
}

function pickBySeed(values: string[], seed: number): string {
  return values[((seed % values.length) + values.length) % values.length];
}
