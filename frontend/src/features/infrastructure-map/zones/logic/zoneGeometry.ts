import type {
  MapImageDimensions,
  RectangleBounds,
} from "@/features/infrastructure-map/model/types";
import type { ZoneResizeHandle } from "@/features/infrastructure-map/shared/interactionTypes";

export const MIN_ZONE_DIMENSION = 1;

export function createBoundsFromDragPoints(
  image: MapImageDimensions,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): RectangleBounds {
  const clampedStartX = clampCoordinate(startX, image.width);
  const clampedStartY = clampCoordinate(startY, image.height);
  const clampedEndX = clampCoordinate(endX, image.width);
  const clampedEndY = clampCoordinate(endY, image.height);
  const left = Math.min(clampedStartX, clampedEndX);
  const top = Math.min(clampedStartY, clampedEndY);
  const right = Math.max(clampedStartX, clampedEndX);
  const bottom = Math.max(clampedStartY, clampedEndY);

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

export function clampZoneBounds(
  bounds: RectangleBounds,
  image: MapImageDimensions,
): RectangleBounds {
  const width = clampDimension(bounds.width, image.width);
  const height = clampDimension(bounds.height, image.height);
  const maxX = Math.max(image.width - width, 0);
  const maxY = Math.max(image.height - height, 0);

  return {
    x: clampCoordinate(bounds.x, maxX),
    y: clampCoordinate(bounds.y, maxY),
    width,
    height,
  };
}

export function hasMinimumZoneDimensions(bounds: RectangleBounds): boolean {
  return (
    bounds.width >= MIN_ZONE_DIMENSION && bounds.height >= MIN_ZONE_DIMENSION
  );
}

export function resizeZoneBoundsFromHandle(
  bounds: RectangleBounds,
  handle: ZoneResizeHandle,
  x: number,
  y: number,
  image: MapImageDimensions,
): RectangleBounds {
  const roundedX = Math.round(x);
  const roundedY = Math.round(y);
  let left = bounds.x;
  let top = bounds.y;
  let right = bounds.x + bounds.width;
  let bottom = bounds.y + bounds.height;

  switch (handle) {
    case "top-left":
      left = clampCoordinate(roundedX, right - MIN_ZONE_DIMENSION);
      top = clampCoordinate(roundedY, bottom - MIN_ZONE_DIMENSION);
      break;
    case "top-right":
      right = clampCoordinate(roundedX, image.width);
      right = Math.max(right, left + MIN_ZONE_DIMENSION);
      top = clampCoordinate(roundedY, bottom - MIN_ZONE_DIMENSION);
      break;
    case "bottom-left":
      left = clampCoordinate(roundedX, right - MIN_ZONE_DIMENSION);
      bottom = clampCoordinate(roundedY, image.height);
      bottom = Math.max(bottom, top + MIN_ZONE_DIMENSION);
      break;
    case "bottom-right":
      right = clampCoordinate(roundedX, image.width);
      right = Math.max(right, left + MIN_ZONE_DIMENSION);
      bottom = clampCoordinate(roundedY, image.height);
      bottom = Math.max(bottom, top + MIN_ZONE_DIMENSION);
      break;
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

function clampDimension(value: number, maxValue: number): number {
  return Math.max(MIN_ZONE_DIMENSION, Math.min(Math.round(value), maxValue));
}

function clampCoordinate(value: number, maxValue: number): number {
  return Math.max(0, Math.min(Math.round(value), maxValue));
}
