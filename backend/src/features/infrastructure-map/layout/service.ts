import {
  readLayoutFile,
  writeLayoutFile,
} from "@/features/infrastructure-map/layout/repository.ts";
import { InvalidMapLayoutError } from "@/features/infrastructure-map/layout/errors.ts";
import { normalizeMapLayoutData } from "@/features/infrastructure-map/layout/normalizers/layout.ts";
import type { MapLayoutData } from "@/features/infrastructure-map/layout/types.ts";

export { MapLayoutFileNotFoundError } from "@/features/infrastructure-map/layout/repository.ts";
export { InvalidMapLayoutError } from "@/features/infrastructure-map/layout/errors.ts";

export async function readMapLayoutFile(
  layoutFilePath: string,
): Promise<MapLayoutData> {
  const rawLayoutContent = await readLayoutFile(layoutFilePath);
  const parsedLayout = JSON.parse(rawLayoutContent) as unknown;

  return normalizeMapLayoutData(parsedLayout);
}

export async function writeMapLayoutFile(
  layoutFilePath: string,
  layoutData: MapLayoutData,
): Promise<void> {
  const normalizedLayout = normalizeMapLayoutData(layoutData);

  await writeLayoutFile(
    layoutFilePath,
    `${JSON.stringify(normalizedLayout, null, 2)}\n`,
  );
}
