import { useEffect, useRef } from "react";
import type {
  InteractiveMarker,
  MapImageDimensions,
  MapLayoutData,
  MapZone,
} from "@/features/infrastructure-map/model/types";
import { buildMapLayoutData } from "@/features/infrastructure-map/layout/services/mapLayoutPersistence";

interface PersistedMapLayoutOptions {
  mapImage: MapImageDimensions;
  markers: InteractiveMarker[];
  onSaveLayout: (layoutData: MapLayoutData) => Promise<void>;
  zones: MapZone[];
}

const LAYOUT_SAVE_DEBOUNCE_MS = 450;

/**
 * Sauvegarde automatiquement le layout apres une courte temporisation.
 */
export default function usePersistedMapLayout({
  mapImage,
  markers,
  onSaveLayout,
  zones,
}: PersistedMapLayoutOptions): void {
  const hasCompletedInitialMount = useRef(false);

  useEffect(() => {
    if (!hasCompletedInitialMount.current) {
      hasCompletedInitialMount.current = true;
      return;
    }

    const timeoutId = window.setTimeout(function savePersistedMapLayout() {
      void onSaveLayout(buildMapLayoutData(mapImage, zones, markers)).catch(
        function ignorePersistedLayoutError() {
          // L'erreur est deja exposee par le hook de persistence backend.
        },
      );
    }, LAYOUT_SAVE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mapImage, markers, onSaveLayout, zones]);
}
