import { isAbsolute, resolve } from "@std/path";
import { fileURLToPath } from "node:url";

const BACKEND_ROOT_URL = new URL("../../", import.meta.url);
const BACKEND_ROOT_PATH = fileURLToPath(BACKEND_ROOT_URL);
const DEFAULT_API_PORT = 8000;

export const backendConfig = {
  apiPort: readNumberEnv("API_PORT", DEFAULT_API_PORT),
  excelAssetSheetName: readRequiredStringEnv(
    "EXCEL_ASSET_SHEET_NAME",
  ),
  excelFilePath: resolveBackendFilePath(
    readRequiredStringEnv("EXCEL_FILE_PATH"),
  ),
  mapFilePath: resolveBackendFilePath(
    readRequiredStringEnv("MAP_FILE_PATH"),
  ),
  layoutFilePath: resolveBackendFilePath(
    readRequiredStringEnv("LAYOUT_FILE_PATH"),
  ),
  assetSectorColumnName: readMultilineEnv(
    "ASSET_SECTOR_COLUMN_NAME",
    readRequiredStringEnv("ASSET_SECTOR_COLUMN_NAME"),
  ),
};

function readRequiredStringEnv(variableName: string): string {
  const value = Deno.env.get(variableName)?.trim();

  if (!value) {
    throw new Error(
      `La variable d'environnement ${variableName} est obligatoire.`,
    );
  }

  return value;
}

function readNumberEnv(variableName: string, fallbackValue: number): number {
  const rawValue = Deno.env.get(variableName);
  const parsedValue = Number(rawValue ?? fallbackValue);

  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

function resolveBackendFilePath(relativeFilePath: string): string {
  return isAbsolute(relativeFilePath)
    ? relativeFilePath
    : resolve(BACKEND_ROOT_PATH, relativeFilePath);
}

function readMultilineEnv(variableName: string, rawValue: string): string {
  return (Deno.env.get(variableName) ?? rawValue).replaceAll("\\n", "\n");
}
