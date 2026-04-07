import * as xlsx from "npm:xlsx";
import { resolve } from "@std/path";
import { fileURLToPath } from "node:url";
import { getPrismaClient, Prisma } from "@/db/prisma.ts";

const PROJECT_ROOT_PATH = fileURLToPath(new URL("../../", import.meta.url));
const DEFAULT_WORKBOOK_PATH = resolve(
  PROJECT_ROOT_PATH,
  "CMDB Espagnac test.xlsm",
);

type ImportedEquipmentDataField =
  | "assetType"
  | "connectedToSwitchName"
  | "connectedToSwitchPort"
  | "contact"
  | "directoryAccount"
  | "floorLocation"
  | "hostname"
  | "idPort"
  | "ipAddress"
  | "ipFilter"
  | "lastInventoryDate"
  | "macAddress"
  | "manufacturer"
  | "manufacturingStationNames"
  | "model"
  | "networkScope"
  | "newIpAddress"
  | "newPortAuto"
  | "oldIpAddress"
  | "operatingSystem"
  | "pinKey"
  | "secondaryComment"
  | "sector"
  | "serialNumber"
  | "status"
  | "storage"
  | "subnetMask"
  | "switchIpAddress"
  | "switchName"
  | "ticketBrassage"
  | "vlan"
  | "vlanNew"
  | "wifiOrWiredConnection"
  | "zoneCode";

interface ParsedSheetRow {
  rowNumber: number;
  valuesByHeader: Map<string, string>;
}

interface ImportedEquipmentRecord {
  equipmentIdSeed: string;
  fields: Partial<Record<ImportedEquipmentDataField, string>>;
  rowNumber: number;
  sheetName: string;
}

interface PersistedEquipmentRecord {
  equipmentId: string;
  fields: Partial<Record<ImportedEquipmentDataField, string>>;
}

const IMPORTED_EQUIPMENT_DATA_FIELDS: ImportedEquipmentDataField[] = [
  "assetType",
  "connectedToSwitchName",
  "connectedToSwitchPort",
  "contact",
  "directoryAccount",
  "floorLocation",
  "hostname",
  "idPort",
  "ipAddress",
  "ipFilter",
  "lastInventoryDate",
  "macAddress",
  "manufacturer",
  "manufacturingStationNames",
  "model",
  "networkScope",
  "newIpAddress",
  "newPortAuto",
  "oldIpAddress",
  "operatingSystem",
  "pinKey",
  "secondaryComment",
  "sector",
  "serialNumber",
  "status",
  "storage",
  "subnetMask",
  "switchIpAddress",
  "switchName",
  "ticketBrassage",
  "vlan",
  "vlanNew",
  "wifiOrWiredConnection",
  "zoneCode",
];

const IMPORT_FIELDS_RESET_TO_NULL = {
  comment: null,
  connectionType: null,
  gateway: null,
  memory: null,
  processor: null,
  securityStatus: null,
  site: null,
  switchPort: null,
} satisfies Partial<Record<string, null>>;

try {
  const workbookPath = resolveWorkbookPath();
  const importedCount = await importEspagnacCmdb(workbookPath);
  console.log(`Imported ${importedCount} CMDB rows from ${workbookPath}.`);
  Deno.exit(0);
} catch (error) {
  console.error(error);
  Deno.exit(1);
}

async function importEspagnacCmdb(workbookPath: string): Promise<number> {
  const workbookBuffer = await Deno.readFile(workbookPath);
  const workbook = xlsx.read(workbookBuffer, {
    bookVBA: true,
    type: "buffer",
  });

  const mergedRecords = mergeRecords([
    ...mapAssetRows(readSheetRows(workbook, "Asset", { headerRowNumber: 1 })),
    ...mapW11Rows(readSheetRows(workbook, "W11", { headerRowNumber: 2 })),
    ...mapRicohRows(readSheetRows(workbook, "Ricoh", { headerRowNumber: 1 })),
    ...mapInfraRows(readSheetRows(workbook, "Infra", { headerRowNumber: 2 })),
    ...mapVmRows(readSheetRows(workbook, "VM", { headerRowNumber: 2 })),
    ...mapFeuil1Rows(
      readSheetRows(workbook, "Feuil1", {
        customHeaders: [
          "Equipment name",
          "Manufacturer",
          "Connection label",
          "MAC address",
          "Network range",
          "Address code",
          "IP address",
        ],
        firstDataRowNumber: 3,
      }),
    ),
    ...mapPrinterRows(
      readSheetRows(workbook, "Histo PRT", { headerRowNumber: 3 }),
    ),
  ]);
  const prisma = getPrismaClient();
  const existingIds = new Map<string, bigint>(
    (
      await prisma.equipmentData.findMany({
        select: { equipmentId: true, id: true },
      })
    ).map((row) => [row.equipmentId, row.id]),
  );

  for (const record of mergedRecords) {
    const data = buildEquipmentDataPayload(record);
    const existingId = existingIds.get(record.equipmentId);

    if (existingId === undefined) {
      const createdRecord = await prisma.equipmentData.create({
        data: data as unknown as Prisma.EquipmentDataCreateInput,
      });
      existingIds.set(record.equipmentId, createdRecord.id);
      continue;
    }

    await prisma.equipmentData.update({
      data: data as unknown as Prisma.EquipmentDataUpdateInput,
      where: { id: existingId },
    });
  }

  return mergedRecords.length;
}

function mapAssetRows(rows: ParsedSheetRow[]): ImportedEquipmentRecord[] {
  return rows.flatMap((row) => {
    const sector = readValue(row, "Location physical location on floor");
    const record = createImportedRecord(
      row,
      "Asset",
      {
        assetType: readValue(row, "Type of equipment (PLC, Sensor, ComXboX)"),
        connectedToSwitchName: readValue(row, "Connected to SWITCH Name"),
        connectedToSwitchPort: readValue(row, "Connected to SWITCH Port"),
        contact: readValue(row, "Collaborateur"),
        directoryAccount: readValue(row, "Login"),
        floorLocation: sector,
        hostname: readValue(row, "Hostname"),
        idPort: readValue(row, "ID PORT"),
        ipAddress: readValue(row, "IP address 1"),
        ipFilter: readValue(row, "Filtre IP"),
        lastInventoryDate: readDateValue(row, "Date"),
        macAddress: readValue(row, "MAC Address 1"),
        manufacturer: readValue(row, "Brand"),
        manufacturingStationNames: readValue(row, "Manufacturing Station names"),
        model: readValue(row, "Model"),
        networkScope: readValue(row, "VLAN Name"),
        newIpAddress: readValue(row, "New IP address"),
        newPortAuto: readValue(row, "New PORT AUTO"),
        oldIpAddress: readValue(row, "Old IP address"),
        operatingSystem: readValue(row, "OS Type"),
        pinKey: readValue(row, "Clé (PIN)"),
        secondaryComment: readValue(row, "Commentaire2"),
        sector,
        serialNumber: readValue(row, "Serial Number"),
        status: readValue(row, "Etat"),
        storage: readValue(row, "HDD"),
        subnetMask: readValue(row, "Subnet 1"),
        switchIpAddress: readValue(row, "IP SWITCH"),
        switchName: readValue(row, "NOM SWITCH"),
        ticketBrassage: readValue(row, "Ticket Brassage"),
        vlan: readValue(row, "VLAN id/name"),
        vlanNew: readValue(row, "VLAN New"),
        wifiOrWiredConnection: readValue(row, "WiFi or Wired Connection"),
        zoneCode: readValue(row, "Prodsched"),
      },
    );

    return record === null ? [] : [record];
  });
}

function mapW11Rows(rows: ParsedSheetRow[]): ImportedEquipmentRecord[] {
  return rows.flatMap((row) => {
    const sector = readValue(row, "Location");
    const record = createImportedRecord(
      row,
      "W11",
      {
        assetType: "PC",
        contact: readValue(row, "Colaborateur"),
        directoryAccount: readValue(row, "Login"),
        floorLocation: sector,
        hostname: readValue(row, "Hostname New"),
        ipAddress: readValue(row, "IP address 1"),
        lastInventoryDate: readDateValue(row, "Date"),
        macAddress: readValue(row, "MAC Address 1"),
        manufacturingStationNames: readValue(row, "Manufacturing Station names"),
        operatingSystem: readValue(row, "OS Type"),
        sector,
        serialNumber: readValue(row, "Serial Number"),
        storage: readValue(row, "HDD"),
        zoneCode: readValue(row, "Prodsched"),
      },
    );

    return record === null ? [] : [record];
  });
}

function mapRicohRows(rows: ParsedSheetRow[]): ImportedEquipmentRecord[] {
  return rows.flatMap((row) => {
    const sector = readValue(row, "Location physical location on floor");
    const record = createImportedRecord(
      row,
      "Ricoh",
      {
        assetType: "PRINTER",
        floorLocation: sector,
        hostname: readValue(row, "Hostname"),
        ipAddress: readValue(row, "IP address 1"),
        manufacturer: "RICOH",
        manufacturingStationNames: readValue(row, "Manufacturing Station name"),
        model: readValue(row, "Asset Number"),
        secondaryComment: readValue(row, "Commentaire"),
        sector,
        serialNumber: readValue(row, "Serial Number"),
        zoneCode: readValue(row, "Production Line Name"),
      },
    );

    return record === null ? [] : [record];
  });
}

function mapInfraRows(rows: ParsedSheetRow[]): ImportedEquipmentRecord[] {
  return rows.flatMap((row) => {
    const machineName = readValue(row, "Virtual Machine name (VM) or Machine name");
    const [serverName, serverIpAddress] = splitServerCell(
      readValue(row, "Server name"),
    );
    const location = readValue(row, "Management");
    const record = createImportedRecord(
      row,
      "Infra",
      {
        assetType: machineName === undefined ? "SERVER" : "VIRTUAL_MACHINE",
        floorLocation: location,
        hostname: machineName ?? serverName,
        ipAddress: readValue(row, "Machine IP address") ?? serverIpAddress,
        networkScope: readValue(row, "On site / Cloud"),
        operatingSystem: readValue(row, "Operating System (OS)"),
        secondaryComment: readValue(
          row,
          "Work in progress (Forecast) / Comments",
        ),
        sector: location,
        vlan: readValue(row, "VLAN"),
      },
    );

    return record === null ? [] : [record];
  });
}

function mapVmRows(rows: ParsedSheetRow[]): ImportedEquipmentRecord[] {
  return rows.flatMap((row) => {
    const record = createImportedRecord(
      row,
      "VM",
      {
        assetType: "VIRTUAL_MACHINE",
        hostname: readValue(row, "Serveur Name"),
        manufacturingStationNames: readValue(row, "Name"),
        secondaryComment: readValue(row, "Commentaire"),
      },
    );

    return record === null ? [] : [record];
  });
}

function mapFeuil1Rows(rows: ParsedSheetRow[]): ImportedEquipmentRecord[] {
  return rows.flatMap((row) => {
    const record = createImportedRecord(
      row,
      "Feuil1",
      {
        assetType: "PLC",
        ipAddress: readValue(row, "IP address"),
        macAddress: readValue(row, "MAC address"),
        manufacturer: readValue(row, "Manufacturer"),
        manufacturingStationNames: readValue(row, "Equipment name"),
        networkScope: readValue(row, "Network range"),
        zoneCode: readValue(row, "Address code"),
      },
    );

    return record === null ? [] : [record];
  });
}

function mapPrinterRows(rows: ParsedSheetRow[]): ImportedEquipmentRecord[] {
  return rows.flatMap((row) => {
    const record = createImportedRecord(
      row,
      "Histo PRT",
      {
        assetType: "PRINTER",
        floorLocation: readValue(
          row,
          "Location(office building, floor, office number)",
        ),
        hostname: readValue(
          row,
          "Output Device nameOMS or SAP Printer NAME according to the printer naming convention for the GCS",
        ),
        ipAddress: readValue(
          row,
          "Printer IP address(not mandatory for dev environment)",
        ),
        manufacturer: readValue(row, "Manufacturer"),
        model: readValue(row, "Model(Lexmark Optro W810, HP640C,...)"),
        secondaryComment: readValue(
          row,
          "Description of the usage of the printer within SAP.(organisation units that are using the printer, document name of the output printed on this printer - This may be linked to the printer options)",
        ),
      },
    );

    return record === null ? [] : [record];
  });
}

function createImportedRecord(
  row: ParsedSheetRow,
  sheetName: string,
  fields: Partial<Record<ImportedEquipmentDataField, string | undefined>>,
): ImportedEquipmentRecord | null {
  const normalizedFields = Object.fromEntries(
    Object.entries(fields).filter((entry): entry is [ImportedEquipmentDataField, string] =>
      typeof entry[1] === "string" && entry[1].trim().length > 0
    ),
  ) as Partial<Record<ImportedEquipmentDataField, string>>;

  if (
    normalizedFields.hostname === undefined &&
    normalizedFields.serialNumber === undefined &&
    normalizedFields.macAddress === undefined &&
    normalizedFields.ipAddress === undefined
  ) {
    return null;
  }

  return {
    equipmentIdSeed:
      normalizedFields.hostname ??
      normalizedFields.serialNumber ??
      normalizedFields.macAddress ??
      normalizedFields.ipAddress ??
      `${sheetName}-${row.rowNumber}`,
    fields: normalizedFields,
    rowNumber: row.rowNumber,
    sheetName,
  };
}

function mergeRecords(
  importedRecords: ImportedEquipmentRecord[],
): PersistedEquipmentRecord[] {
  const mergedRecords = new Map<string, PersistedEquipmentRecord>();
  const equipmentIdUsage = new Map<string, number>();

  for (const record of importedRecords) {
    const mergeKey = buildMergeKey(record);
    const existingRecord = mergedRecords.get(mergeKey);

    if (existingRecord === undefined) {
      mergedRecords.set(mergeKey, {
        equipmentId: buildUniqueEquipmentId(record.equipmentIdSeed, equipmentIdUsage),
        fields: { ...record.fields },
      });
      continue;
    }

    for (const field of IMPORTED_EQUIPMENT_DATA_FIELDS) {
      if (
        existingRecord.fields[field] === undefined &&
        record.fields[field] !== undefined
      ) {
        existingRecord.fields[field] = record.fields[field];
      }
    }
  }

  return [...mergedRecords.values()].sort((firstRecord, secondRecord) =>
    firstRecord.equipmentId.localeCompare(secondRecord.equipmentId)
  );
}

function buildMergeKey(record: ImportedEquipmentRecord): string {
  if (record.fields.hostname !== undefined) {
    return `hostname:${normalizeIdentifier(record.fields.hostname)}`;
  }

  if (record.fields.serialNumber !== undefined) {
    return `serial:${normalizeIdentifier(record.fields.serialNumber)}`;
  }

  if (record.fields.macAddress !== undefined) {
    return `mac:${normalizeIdentifier(record.fields.macAddress)}`;
  }

  if (record.fields.ipAddress !== undefined) {
    return `ip:${normalizeIdentifier(record.fields.ipAddress)}`;
  }

  return `row:${record.sheetName}:${record.rowNumber}`;
}

function buildEquipmentDataPayload(
  record: PersistedEquipmentRecord,
): Record<string, string | null> {
  return {
    ...Object.fromEntries(
      IMPORTED_EQUIPMENT_DATA_FIELDS.map((field) => [field, record.fields[field] ?? null]),
    ),
    ...IMPORT_FIELDS_RESET_TO_NULL,
    equipmentId: record.equipmentId,
  };
}

function buildUniqueEquipmentId(
  seed: string,
  usage: Map<string, number>,
): string {
  const normalizedSeed = normalizeIdentifier(seed);
  const nextIndex = (usage.get(normalizedSeed) ?? 0) + 1;

  usage.set(normalizedSeed, nextIndex);

  return nextIndex === 1
    ? normalizedSeed
    : `${normalizedSeed}-${String(nextIndex).padStart(2, "0")}`;
}

function normalizeIdentifier(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}

function splitServerCell(value: string | undefined): [string | undefined, string | undefined] {
  if (value === undefined) {
    return [undefined, undefined];
  }

  const parts = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  return [
    parts.find((part) => !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(part)),
    parts.find((part) => /^(?:\d{1,3}\.){3}\d{1,3}$/.test(part)),
  ];
}

function readSheetRows(
  workbook: xlsx.WorkBook,
  sheetName: string,
  options: {
    customHeaders?: string[];
    firstDataRowNumber?: number;
    headerRowNumber?: number;
  },
): ParsedSheetRow[] {
  const sheet = workbook.Sheets[sheetName];

  if (sheet === undefined) {
    throw new Error(`Sheet "${sheetName}" not found.`);
  }

  const rows = xlsx.utils.sheet_to_json<unknown[]>(sheet, {
    blankrows: false,
    defval: "",
    header: 1,
    raw: false,
  });
  const headers = options.customHeaders ??
    toStringArray(rows[(options.headerRowNumber ?? 1) - 1] ?? []);
  const firstDataRowIndex = (options.firstDataRowNumber ??
    ((options.headerRowNumber ?? 1) + 1)) - 1;

  return rows.slice(firstDataRowIndex).flatMap((row, index) => {
    const stringRow = toStringArray(row);

    if (stringRow.every((value) => value.trim().length === 0)) {
      return [];
    }

    const valuesByHeader = new Map<string, string>();

    for (let columnIndex = 0; columnIndex < headers.length; columnIndex += 1) {
      const header = normalizeHeader(headers[columnIndex] ?? "");

      if (header.length === 0) {
        continue;
      }

      valuesByHeader.set(header, stringRow[columnIndex] ?? "");
    }

    return [{
      rowNumber: firstDataRowIndex + index + 1,
      valuesByHeader,
    }];
  });
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => String(entry ?? ""));
}

function readValue(row: ParsedSheetRow, header: string): string | undefined {
  const value = row.valuesByHeader.get(normalizeHeader(header)) ?? "";
  const normalizedValue = value
    .replace(/\u00a0/g, " ")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const upperValue = normalizedValue.toUpperCase();

  if (
    normalizedValue.length === 0 ||
    upperValue === "N/A" ||
    upperValue === "NA" ||
    upperValue === "RESERVE" ||
    upperValue === "NOT FOUND" ||
    upperValue === "?" ||
    upperValue === "²"
  ) {
    return undefined;
  }

  return normalizedValue;
}

function readDateValue(row: ParsedSheetRow, header: string): string | undefined {
  const rawValue = readValue(row, header);

  if (rawValue === undefined) {
    return undefined;
  }

  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    return rawValue;
  }

  const parsedDate = xlsx.SSF.parse_date_code(numericValue);

  if (parsedDate === null) {
    return rawValue;
  }

  return [
    String(parsedDate.y).padStart(4, "0"),
    String(parsedDate.m).padStart(2, "0"),
    String(parsedDate.d).padStart(2, "0"),
  ].join("-");
}

function normalizeHeader(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function resolveWorkbookPath(): string {
  const configuredPath = Deno.env.get("CMDB_EXCEL_PATH")?.trim();

  return configuredPath && configuredPath.length > 0
    ? resolve(PROJECT_ROOT_PATH, configuredPath)
    : DEFAULT_WORKBOOK_PATH;
}
