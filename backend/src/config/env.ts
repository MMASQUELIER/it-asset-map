import { loadSync } from "@std/dotenv";
import { isAbsolute, resolve } from "@std/path";
import { fileURLToPath } from "node:url";

const BACKEND_ROOT_URL = new URL("../../", import.meta.url);
const BACKEND_ROOT_PATH = fileURLToPath(BACKEND_ROOT_URL);
const DEFAULT_API_PORT = 8000;
const DEFAULT_MYSQL_PORT = 3306;
const DEFAULT_MYSQL_CONNECTION_LIMIT = 10;

loadLocalEnvironmentFile();

const mysqlConfig = {
  connectionLimit: readNumberEnv(
    "MYSQL_CONNECTION_LIMIT",
    DEFAULT_MYSQL_CONNECTION_LIMIT,
  ),
  database: readRequiredStringEnv("MYSQL_DATABASE"),
  host: readRequiredStringEnv("MYSQL_HOST"),
  password: readRequiredStringEnv("MYSQL_PASSWORD"),
  port: readNumberEnv("MYSQL_PORT", DEFAULT_MYSQL_PORT),
  user: readRequiredStringEnv("MYSQL_USER"),
};
const databaseUrl = readDatabaseUrl(mysqlConfig);

if (Deno.env.get("DATABASE_URL") === undefined) {
  Deno.env.set("DATABASE_URL", databaseUrl);
}

export const backendConfig = {
  apiPort: readNumberEnv("API_PORT", DEFAULT_API_PORT),
  databaseUrl,
  mapFilePath: resolveBackendFilePath(readRequiredStringEnv("MAP_FILE_PATH")),
  mysql: mysqlConfig,
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

function readDatabaseUrl(mysqlConfig: {
  database: string;
  host: string;
  password: string;
  port: number;
  user: string;
}): string {
  const explicitDatabaseUrl = Deno.env.get("DATABASE_URL")?.trim();

  if (explicitDatabaseUrl && explicitDatabaseUrl.length > 0) {
    return explicitDatabaseUrl;
  }

  const databaseUrl = new URL("mysql://localhost");
  databaseUrl.username = mysqlConfig.user;
  databaseUrl.password = mysqlConfig.password;
  databaseUrl.hostname = mysqlConfig.host;
  databaseUrl.port = String(mysqlConfig.port);
  databaseUrl.pathname = `/${mysqlConfig.database}`;

  return databaseUrl.toString();
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
