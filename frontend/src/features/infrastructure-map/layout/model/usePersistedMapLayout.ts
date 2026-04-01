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
  const lastSavedLayoutSignature = useRef<string | null>(null);
  const pendingLayoutSignature = useRef<string | null>(null);

  useEffect(() => {
    const nextLayoutData = buildMapLayoutData(mapImage, zones, markers);
    const nextLayoutSignature = JSON.stringify(nextLayoutData);

    if (!hasCompletedInitialMount.current) {
      hasCompletedInitialMount.current = true;
      lastSavedLayoutSignature.current = nextLayoutSignature;
      return;
    }

    if (
      lastSavedLayoutSignature.current === nextLayoutSignature ||
      pendingLayoutSignature.current === nextLayoutSignature
    ) {
      return;
    }

    let hasStartedSave = false;
    pendingLayoutSignature.current = nextLayoutSignature;

    const timeoutId = window.setTimeout(function savePersistedMapLayout() {
      hasStartedSave = true;

      void onSaveLayout(nextLayoutData).then(
        function handlePersistedLayoutSaveSuccess() {
          lastSavedLayoutSignature.current = nextLayoutSignature;
        },
      ).catch(
        function ignorePersistedLayoutError() {
          // L'erreur est deja exposee par le hook de persistence backend.
        },
      ).finally(function clearPendingLayoutSignature() {
        if (pendingLayoutSignature.current === nextLayoutSignature) {
          pendingLayoutSignature.current = null;
        }
      });
    }, LAYOUT_SAVE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);

      if (
        !hasStartedSave &&
        pendingLayoutSignature.current === nextLayoutSignature
      ) {
        pendingLayoutSignature.current = null;
      }
    };
  }, [mapImage, markers, onSaveLayout, zones]);
}
