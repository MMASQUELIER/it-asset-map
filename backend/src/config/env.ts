/**
 * @file env.ts
 * @brief Lecture et resolution de la configuration backend.
 */

import { isAbsolute, resolve } from "@std/path";
import { fileURLToPath } from "node:url";

const BACKEND_ROOT_URL = new URL("../../", import.meta.url);
const BACKEND_ROOT_PATH = fileURLToPath(BACKEND_ROOT_URL);
const DEFAULT_API_PORT = 8000;
const DEFAULT_EXCEL_ASSET_SHEET_NAME = "Asset";
const DEFAULT_EXCEL_FILE_PATH = "./data/data.xlsm";
const DEFAULT_MAP_FILE_PATH = "../assets/map.png";
const DEFAULT_LAYOUT_FILE_PATH = "./data/map-layout.json";
const DEFAULT_MAP_IMAGE_WIDTH = 884;
const DEFAULT_MAP_IMAGE_HEIGHT = 609;
const DEFAULT_ASSET_SECTOR_COLUMN_NAME = "Location\nphysical location on floor";
const DEFAULT_SECTORS = [
  "SECTEUR CORPS",
  "SECTEUR FABRICATION",
  "SECTEUR MANUEL",
  "SECTEUR TETE",
];

/**
 * @brief Configuration centralisee du backend.
 */
export const backendConfig = {
  apiPort: readNumberEnv("API_PORT", DEFAULT_API_PORT),
  excelAssetSheetName: readStringEnv(
    "EXCEL_ASSET_SHEET_NAME",
    DEFAULT_EXCEL_ASSET_SHEET_NAME,
  ),
  excelFilePath: resolveBackendFilePath(
    readStringEnv("EXCEL_FILE_PATH", DEFAULT_EXCEL_FILE_PATH),
  ),
  mapFilePath: resolveBackendFilePath(
    readStringEnv("MAP_FILE_PATH", DEFAULT_MAP_FILE_PATH),
  ),
  layoutFilePath: resolveBackendFilePath(
    readStringEnv("LAYOUT_FILE_PATH", DEFAULT_LAYOUT_FILE_PATH),
  ),
  mapImageWidth: readPositiveNumberEnv(
    "MAP_IMAGE_WIDTH",
    DEFAULT_MAP_IMAGE_WIDTH,
  ),
  mapImageHeight: readPositiveNumberEnv(
    "MAP_IMAGE_HEIGHT",
    DEFAULT_MAP_IMAGE_HEIGHT,
  ),
  assetSectorColumnName: readMultilineEnv(
    "ASSET_SECTOR_COLUMN_NAME",
    DEFAULT_ASSET_SECTOR_COLUMN_NAME,
  ),
  sectors: readArrayEnv("SECTORS", DEFAULT_SECTORS),
};

/**
 * @brief Lit une variable d'environnement de type texte.
 * @param variableName Nom de la variable d'environnement.
 * @param fallbackValue Valeur par defaut si la variable est absente.
 * @returns Valeur finale de configuration.
 */
function readStringEnv(variableName: string, fallbackValue: string): string {
  return Deno.env.get(variableName) ?? fallbackValue;
}

/**
 * @brief Lit une variable d'environnement de type numerique.
 * @param variableName Nom de la variable d'environnement.
 * @param fallbackValue Valeur par defaut si la variable est absente ou invalide.
 * @returns Valeur numerique finale de configuration.
 */
function readNumberEnv(variableName: string, fallbackValue: number): number {
  const rawValue = Deno.env.get(variableName);
  const parsedValue = Number(rawValue ?? fallbackValue);

  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

/**
 * @brief Resout un chemin de fichier relatif au backend.
 * @param relativeFilePath Chemin configure dans le fichier .env.
 * @returns Chemin absolu utilisable par Deno.readFile.
 */
function resolveBackendFilePath(relativeFilePath: string): string {
  return isAbsolute(relativeFilePath)
    ? relativeFilePath
    : resolve(BACKEND_ROOT_PATH, relativeFilePath);
}

/**
 * @brief Lit une variable d'environnement texte pouvant contenir des \n echappes.
 * @param variableName Nom de la variable d'environnement.
 * @param fallbackValue Valeur par defaut si la variable est absente.
 * @returns Valeur de configuration avec les retours a la ligne resolves.
 */
function readMultilineEnv(variableName: string, fallbackValue: string): string {
  return readStringEnv(variableName, fallbackValue).replaceAll("\\n", "\n");
}

/**
 * @brief Lit une variable d'environnement de type tableau JSON.
 * @param variableName Nom de la variable d'environnement.
 * @param fallbackValue Valeur par defaut si la variable est absente ou invalide.
 * @returns Tableau de configuration final.
 */
function readArrayEnv(variableName: string, fallbackValue: string[]): string[] {
  const rawValue = Deno.env.get(variableName);
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : fallbackValue;
  } catch {
    console.warn(
      `La variable d'environnement ${variableName} n'est pas un tableau JSON valide. Utilisation de la valeur par défaut.`,
    );
    return fallbackValue;
  }
}

/**
 * @brief Lit une variable d'environnement numerique strictement positive.
 * @param variableName Nom de la variable d'environnement.
 * @param fallbackValue Valeur par defaut si la variable est absente ou invalide.
 * @returns Valeur numerique positive finale.
 */
function readPositiveNumberEnv(
  variableName: string,
  fallbackValue: number,
): number {
  const parsedValue = readNumberEnv(variableName, fallbackValue);
  return parsedValue > 0 ? parsedValue : fallbackValue;
}
