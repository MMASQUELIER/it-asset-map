import * as xlsx from "jsr:@mirror/xlsx";
import { fileURLToPath } from "node:url";
import type { BackendAssetRecord } from "@/features/infrastructure-map/catalog/types.ts";

export class ExcelSheetNotFoundError extends Error {
  constructor(sheetName: string) {
    super(`Onglet '${sheetName}' introuvable`);
    this.name = "ExcelSheetNotFoundError";
  }
}

export class ExcelColumnNotFoundError extends Error {
  constructor(columnName: string) {
    super(`Colonne Excel '${columnName}' introuvable.`);
    this.name = "ExcelColumnNotFoundError";
  }
}

export class ExcelRowNotFoundError extends Error {
  constructor(rowNumber: number) {
    super(`Ligne Excel ${rowNumber} introuvable.`);
    this.name = "ExcelRowNotFoundError";
  }
}

export async function readAssetsFromExcelFile(
  excelFilePath: string,
  sheetName: string,
): Promise<BackendAssetRecord[]> {
  const { assetSheet } = await readWorkbookSheet(excelFilePath, sheetName);

  return xlsx.utils.sheet_to_json<BackendAssetRecord>(assetSheet, {
    defval: "",
  });
}

export async function updateAssetFieldInExcelFile(
  excelFilePath: string,
  sheetName: string,
  rowNumber: number,
  columnName: string,
  value: string,
): Promise<void> {
  const { assetSheet } = await readWorkbookSheet(excelFilePath, sheetName);
  const columnIndex = findHeaderColumnIndex(assetSheet, columnName);

  assertExcelRowExists(assetSheet, rowNumber);

  const cellReference = xlsx.utils.encode_cell({
    c: columnIndex,
    r: rowNumber - 1,
  });

  await updateWorkbookCellValue(excelFilePath, sheetName, cellReference, value);
}

async function readWorkbookSheet(
  excelFilePath: string,
  sheetName: string,
): Promise<{ assetSheet: xlsx.WorkSheet }> {
  const excelFileBuffer = await Deno.readFile(excelFilePath);
  const workbook = xlsx.read(excelFileBuffer, {
    type: "buffer",
    bookVBA: true,
  });
  const assetSheet = workbook.Sheets[sheetName];

  if (!assetSheet) {
    throw new ExcelSheetNotFoundError(sheetName);
  }

  return {
    assetSheet,
  };
}

function assertExcelRowExists(
  assetSheet: xlsx.WorkSheet,
  rowNumber: number,
): void {
  const sheetRange = getSheetRange(assetSheet);
  const zeroBasedRowIndex = rowNumber - 1;

  if (
    !Number.isInteger(rowNumber) ||
    zeroBasedRowIndex <= sheetRange.s.r ||
    zeroBasedRowIndex > sheetRange.e.r
  ) {
    throw new ExcelRowNotFoundError(rowNumber);
  }
}

function findHeaderColumnIndex(
  assetSheet: xlsx.WorkSheet,
  columnName: string,
): number {
  const sheetRange = getSheetRange(assetSheet);

  for (let columnIndex = sheetRange.s.c; columnIndex <= sheetRange.e.c; columnIndex += 1) {
    const headerCell = assetSheet[xlsx.utils.encode_cell({
      c: columnIndex,
      r: sheetRange.s.r,
    })];
    const headerValue = String(headerCell?.v ?? "").trim();

    if (headerValue === columnName.trim()) {
      return columnIndex;
    }
  }

  throw new ExcelColumnNotFoundError(columnName);
}

function getSheetRange(assetSheet: xlsx.WorkSheet): xlsx.Range {
  const sheetReference = assetSheet["!ref"];

  if (typeof sheetReference !== "string") {
    throw new Error("La feuille Excel ne contient aucune plage lisible.");
  }

  return xlsx.utils.decode_range(sheetReference);
}

const UPDATE_EXCEL_CELL_SCRIPT_PATH = fileURLToPath(
  new URL("../../../../scripts/update_excel_cell.py", import.meta.url),
);

async function updateWorkbookCellValue(
  excelFilePath: string,
  sheetName: string,
  cellReference: string,
  value: string,
): Promise<void> {
  const output = await new Deno.Command("python3", {
    args: [
      UPDATE_EXCEL_CELL_SCRIPT_PATH,
      "--workbook",
      excelFilePath,
      "--sheet",
      sheetName,
      "--cell",
      cellReference,
      "--value",
      value,
    ],
  }).output();

  if (!output.success) {
    throw new Error(
      new TextDecoder().decode(output.stderr).trim() ||
        "Impossible de modifier la cellule Excel demandee.",
    );
  }
}
