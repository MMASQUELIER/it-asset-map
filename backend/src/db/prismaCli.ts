import { loadSync } from "@std/dotenv";
import { resolve } from "@std/path";
import { fileURLToPath } from "node:url";

const BACKEND_ROOT_URL = new URL("../../", import.meta.url);
const BACKEND_ROOT_PATH = fileURLToPath(BACKEND_ROOT_URL);

loadLocalEnvironmentFile();

export async function runPrismaCommand(args: string[]): Promise<void> {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "npm:prisma", ...args],
    env: {
      ...Deno.env.toObject(),
      DATABASE_URL: readPrismaDatabaseUrl(args),
    },
    stderr: "inherit",
    stdin: "inherit",
    stdout: "inherit",
  });
  const childProcess = command.spawn();
  const { code } = await childProcess.status;

  if (code !== 0) {
    throw new Error(`Prisma command failed with exit code ${code}.`);
  }
}

function readPrismaDatabaseUrl(args: string[]): string {
  const explicitDatabaseUrl = Deno.env.get("DATABASE_URL")?.trim();

  if (explicitDatabaseUrl && explicitDatabaseUrl.length > 0) {
    return explicitDatabaseUrl;
  }

  const database = Deno.env.get("MYSQL_DATABASE")?.trim();
  const host = Deno.env.get("MYSQL_HOST")?.trim();
  const password = Deno.env.get("MYSQL_PASSWORD")?.trim();
  const rawPort = Deno.env.get("MYSQL_PORT")?.trim() ?? "3306";
  const user = Deno.env.get("MYSQL_USER")?.trim();

  if (!database || !host || !password || !user) {
    if (isPrismaGenerateCommand(args)) {
      return "mysql://placeholder:placeholder@localhost:3306/placeholder";
    }

    throw new Error(
      "DATABASE_URL or MYSQL_* environment variables are required for Prisma commands.",
    );
  }

  const databaseUrl = new URL("mysql://localhost");
  databaseUrl.username = user;
  databaseUrl.password = password;
  databaseUrl.hostname = host;
  databaseUrl.port = rawPort;
  databaseUrl.pathname = `/${database}`;

  return databaseUrl.toString();
}

function isPrismaGenerateCommand(args: string[]): boolean {
  return args[0] === "generate";
}

function loadLocalEnvironmentFile(): void {
  const localEnvPath = resolve(BACKEND_ROOT_PATH, ".env");

  try {
    Deno.statSync(localEnvPath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return;
    }

    throw error;
  }

  const localEnv = loadSync({ envPath: localEnvPath });

  for (const [variableName, value] of Object.entries(localEnv)) {
    if (Deno.env.get(variableName) === undefined) {
      Deno.env.set(variableName, value);
    }
  }
}
