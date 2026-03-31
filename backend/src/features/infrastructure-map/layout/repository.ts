import { dirname } from "@std/path";

export class MapLayoutFileNotFoundError extends Error {
  constructor(layoutFilePath: string) {
    super(`Aucun layout n'existe encore pour ${layoutFilePath}.`);
    this.name = "MapLayoutFileNotFoundError";
  }
}

export async function readLayoutFile(layoutFilePath: string): Promise<string> {
  try {
    return await Deno.readTextFile(layoutFilePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new MapLayoutFileNotFoundError(layoutFilePath);
    }

    throw error;
  }
}

export async function writeLayoutFile(
  layoutFilePath: string,
  serializedLayout: string,
): Promise<void> {
  await Deno.mkdir(dirname(layoutFilePath), { recursive: true });
  await Deno.writeTextFile(layoutFilePath, serializedLayout);
}
