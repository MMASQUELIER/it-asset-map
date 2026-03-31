import type { MapImageDimensions } from "@/features/infrastructure-map/layout/types.ts";
import { InvalidMapLayoutError } from "@/features/infrastructure-map/layout/errors.ts";
import {
  isRecord,
  readPositiveNumber,
} from "@/features/infrastructure-map/layout/normalizers/primitives.ts";

export function normalizeMapImageDimensions(
  value: unknown,
): MapImageDimensions {
  if (!isRecord(value)) {
    throw new InvalidMapLayoutError(
      "La section mapImage est obligatoire dans le layout JSON.",
    );
  }

  return {
    width: readPositiveNumber(value.width, "mapImage.width"),
    height: readPositiveNumber(value.height, "mapImage.height"),
  };
}
