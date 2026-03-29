import { useEffect, useRef } from "react";
import type {
  InteractiveMarker,
  MapImageDimensions,
  MapLayoutData,
  MapZone,
} from "../shared/types";
import { buildMapLayoutData } from "./mapLayoutPersistence";

interface PersistedMapLayoutOptions {
  mapImage: MapImageDimensions;
  markers: InteractiveMarker[];
  onSaveLayout: (layoutData: MapLayoutData) => Promise<void>;
  zones: MapZone[];
}

/** Delay used to debounce backend saves while the user edits the map. */
const LAYOUT_SAVE_DEBOUNCE_MS = 450;

/**
 * Persists map edits to the backend JSON file after each stabilized change.
 *
 * @param options Current map state and backend save callback.
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

    const timeoutId = window.setTimeout(() => {
      void onSaveLayout(buildMapLayoutData(mapImage, zones, markers)).catch(
        () => {
          // L'erreur est deja exposee par le hook de persistence backend.
        },
      );
    }, LAYOUT_SAVE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mapImage, markers, onSaveLayout, zones]);
}
