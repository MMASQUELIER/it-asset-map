/**
 * @file assets.service.ts
 * @brief Lecture des assets depuis le fichier Excel.
 */

import * as xlsx from "jsr:@mirror/xlsx";

/**
 * @brief Erreur levee quand l'onglet Excel attendu est absent.
 */
export class ExcelSheetNotFoundError extends Error {
  constructor(sheetName: string) {
    super(`Onglet '${sheetName}' introuvable`);
    this.name = "ExcelSheetNotFoundError";
  }
}

/**
 * @brief Lit et transforme les assets du fichier Excel.
 * @param excelFilePath Chemin absolu du fichier Excel.
 * @param sheetName Nom de l'onglet contenant les assets.
 * @returns Tableau d'assets converti en JSON.
 * @throws ExcelSheetNotFoundError Si l'onglet n'existe pas.
 */
export async function readAssetsFromExcelFile(
  excelFilePath: string,
  sheetName: string,
): Promise<Record<string, unknown>[]> {
  const excelFileBuffer = await Deno.readFile(excelFilePath);
  const workbook = xlsx.read(excelFileBuffer, { type: "buffer" });
  const assetSheet = workbook.Sheets[sheetName];

  if (!assetSheet) {
    throw new ExcelSheetNotFoundError(sheetName);
  }

  return xlsx.utils.sheet_to_json<Record<string, unknown>>(assetSheet, {
    defval: "",
  });
}

/**
 * @brief Filtre les assets selon une liste de secteurs autorises.
 * @param assets Liste complete des assets.
 * @param sectorNames Liste des secteurs a conserver.
 * @returns Liste des assets appartenant aux secteurs demandes.
 */
export function filterAssetsBySector(
  assets: Record<string, unknown>[],
  sectorColumnName: string,
  sectorNames: string[],
) {
  if (sectorNames.length === 0) {
    return assets;
  }

  return assets.filter((asset) =>
    sectorNames.includes(String(asset[sectorColumnName]).trim())
  );
}
