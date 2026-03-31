import type { MapImageDimensions } from "@/features/infrastructure-map/model/types";

/**
 * Lit les dimensions reelles de l'image utilisee comme fond de carte.
 */
export async function loadMapImageDimensions(
  imageUrl: string,
): Promise<MapImageDimensions> {
  return new Promise(function loadImageDimensions(resolve, reject) {
    const image = new Image();

    image.onload = function handleImageLoad() {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = function handleImageError() {
      reject(new Error("Impossible de charger l'image de la carte."));
    };
    image.src = imageUrl;
  });
}
