import type {
  MapImageDimensions,
  RectangleBounds,
} from "@/features/infrastructure-map/model/types";
import type { ZoneResizeHandle } from "@/features/infrastructure-map/shared/interactionTypes";

/** Minimum allowed width and height for an interactive zone. */
export const MIN_ZONE_DIMENSION = 40;

/**
 * Builds a rectangle from two drag points while keeping the result inside the
 * image boundaries.
 *
 * @param image Map image dimensions.
 * @param startX Drag start X coordinate.
 * @param startY Drag start Y coordinate.
 * @param endX Current drag X coordinate.
 * @param endY Current drag Y coordinate.
 * @returns Normalised rectangle expressed in image coordinates.
 */
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

/**
 * Clamps a rectangle so it fully remains inside the map image.
 *
 * @param bounds Rectangle to clamp.
 * @param image Map image dimensions.
 * @returns Rectangle constrained to the image boundaries.
 */
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

/**
 * Validates the minimal size required for a zone.
 *
 * @param bounds Rectangle to validate.
 * @returns `true` when both dimensions meet the minimum size.
 */
export function hasMinimumZoneDimensions(bounds: RectangleBounds): boolean {
  return (
    bounds.width >= MIN_ZONE_DIMENSION && bounds.height >= MIN_ZONE_DIMENSION
  );
}

/**
 * Recomputes a zone rectangle after one of its resize handles is dragged.
 *
 * @param bounds Current zone rectangle.
 * @param handle Handle currently dragged by the user.
 * @param x New X coordinate.
 * @param y New Y coordinate.
 * @param image Map image dimensions.
 * @returns Resized rectangle constrained by image size and minimum dimensions.
 */
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

/**
 * Clamps a size value while preserving the zone minimum size.
 *
 * @param value Proposed dimension.
 * @param maxValue Maximum permitted dimension.
 * @returns Safe dimension value.
 */
function clampDimension(value: number, maxValue: number): number {
  return Math.max(MIN_ZONE_DIMENSION, Math.min(Math.round(value), maxValue));
}

/**
 * Clamps a coordinate inside the image.
 *
 * @param value Proposed coordinate.
 * @param maxValue Maximum permitted coordinate.
 * @returns Safe coordinate value.
 */
function clampCoordinate(value: number, maxValue: number): number {
  return Math.max(0, Math.min(Math.round(value), maxValue));
}
