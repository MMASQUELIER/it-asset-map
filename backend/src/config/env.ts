import { loadSync } from "@std/dotenv";
import { isAbsolute, resolve } from "@std/path";
import { fileURLToPath } from "node:url";

const BACKEND_ROOT_URL = new URL("../../", import.meta.url);
const BACKEND_ROOT_PATH = fileURLToPath(BACKEND_ROOT_URL);
const DEFAULT_API_PORT = 8000;
const DEFAULT_SQLITE_PATH = "data/app.sqlite";

loadLocalEnvironmentFile();

export const backendConfig = {
  apiPort: readNumberEnv("API_PORT", DEFAULT_API_PORT),
  mapFilePath: resolveBackendFilePath(readRequiredStringEnv("MAP_FILE_PATH")),
  sqlitePath: resolveBackendFilePath(
    readStringEnv("SQLITE_PATH", DEFAULT_SQLITE_PATH),
  ),
};

function loadLocalEnvironmentFile(): void {
  const localEnvPath = resolve(BACKEND_ROOT_PATH, ".env");

  if (!pathExists(localEnvPath)) {
    return;
  }

  const localEnv = loadSync({ envPath: localEnvPath });

  for (const [variableName, value] of Object.entries(localEnv)) {
    if (Deno.env.get(variableName) === undefined) {
      Deno.env.set(variableName, value);
    }
  }
}

function readRequiredStringEnv(variableName: string): string {
  const value = Deno.env.get(variableName)?.trim();

  if (!value) {
    throw new Error(
      `Environment variable ${variableName} is required.`,
    );
  }

  return value;
}

function readStringEnv(variableName: string, fallbackValue: string): string {
  const value = Deno.env.get(variableName)?.trim();

  if (value === undefined || value.length === 0) {
    return fallbackValue;
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

function pathExists(path: string): boolean {
  try {
    Deno.statSync(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }

    throw error;
  }
}
