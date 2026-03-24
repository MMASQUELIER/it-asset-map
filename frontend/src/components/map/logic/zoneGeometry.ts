import type { RectangleBounds, StaticMapImage } from "../../../types/layout";
import type { ZoneResizeHandle } from "./interactionTypes";

const MIN_ZONE_DIMENSION = 40;

export function createBoundsFromDragPoints(
  image: StaticMapImage,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): RectangleBounds {
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  return clampZoneBounds(
    {
      x: Math.round(left),
      y: Math.round(top),
      width,
      height,
    },
    image,
  );
}

export function clampZoneBounds(
  bounds: RectangleBounds,
  image: StaticMapImage,
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

export function resizeZoneBoundsFromHandle(
  bounds: RectangleBounds,
  handle: ZoneResizeHandle,
  x: number,
  y: number,
  image: StaticMapImage,
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
