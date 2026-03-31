import * as xlsx from "jsr:@mirror/xlsx";
import type { BackendAssetRecord } from "@/features/infrastructure-map/catalog/types.ts";

export class ExcelSheetNotFoundError extends Error {
  constructor(sheetName: string) {
    super(`Onglet '${sheetName}' introuvable`);
    this.name = "ExcelSheetNotFoundError";
  }
}

export async function readAssetsFromExcelFile(
  excelFilePath: string,
  sheetName: string,
): Promise<BackendAssetRecord[]> {
  const excelFileBuffer = await Deno.readFile(excelFilePath);
  const workbook = xlsx.read(excelFileBuffer, { type: "buffer" });
  const assetSheet = workbook.Sheets[sheetName];

  if (!assetSheet) {
    throw new ExcelSheetNotFoundError(sheetName);
  }

  return xlsx.utils.sheet_to_json<BackendAssetRecord>(assetSheet, {
    defval: "",
  });
}
