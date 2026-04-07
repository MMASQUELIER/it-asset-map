import type { MapImageDimensions } from "@/features/infrastructure-map/model/types";

export async function loadMapImageDimensions(
  imageUrl: string,
): Promise<MapImageDimensions> {
  return new Promise(function resolveImageDimensions(resolve, reject) {
    const image = new Image();

    image.onload = function handleImageLoad() {
      resolve({
        height: image.naturalHeight,
        width: image.naturalWidth,
      });
    };
    image.onerror = function handleImageError() {
      reject(new Error("Impossible de charger le plan."));
    };
    image.src = imageUrl;
  });
}
