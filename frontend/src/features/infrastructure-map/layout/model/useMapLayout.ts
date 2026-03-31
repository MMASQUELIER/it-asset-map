import { useEffect, useState } from "react";
import type { MapLayoutData } from "@/features/infrastructure-map/model/types";
import {
  createEmptyMapLayout,
} from "@/features/infrastructure-map/layout/services/mapLayoutPersistence";
import { loadMapImageDimensions } from "@/features/infrastructure-map/layout/services/loadMapImageDimensions";

interface UseMapLayoutOptions {
  imageUrl: string;
  layoutUrl: string;
}

interface MapLayoutState {
  errorMessage: string | null;
  isLoading: boolean;
  isSaving: boolean;
  layoutData: MapLayoutData | null;
  saveErrorMessage: string | null;
  saveLayout: (layoutData: MapLayoutData) => Promise<void>;
}

/**
 * Charge le layout persiste et expose la sauvegarde du plan courant.
 *
 * Si le backend ne retourne aucun layout, le hook initialise un layout vide
 * a partir des dimensions reelles de l'image de carte.
 */
export default function useMapLayout({
  imageUrl,
  layoutUrl,
}: UseMapLayoutOptions): MapLayoutState {
  const [layoutData, setLayoutData] = useState<MapLayoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadLayout(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const layoutResponse = await fetch(layoutUrl);

        if (layoutResponse.status === 404) {
          const mapImage = await loadMapImageDimensions(imageUrl);

          if (!isCancelled) {
            setLayoutData(createEmptyMapLayout(mapImage));
          }

          return;
        }

        if (!layoutResponse.ok) {
          throw new Error(
            `Chargement du layout impossible (${layoutResponse.status}).`,
          );
        }

        const nextLayoutData = await layoutResponse.json() as MapLayoutData;

        if (isCancelled) {
          return;
        }

        setLayoutData(nextLayoutData);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setLayoutData(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Impossible de charger le layout de la carte.",
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadLayout();

    return () => {
      isCancelled = true;
    };
  }, [imageUrl, layoutUrl]);

  async function saveLayout(nextLayoutData: MapLayoutData): Promise<void> {
    setIsSaving(true);
    setSaveErrorMessage(null);

    try {
      const saveResponse = await fetch(layoutUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextLayoutData),
      });

      if (!saveResponse.ok) {
        const saveErrorPayload = await readErrorPayload(saveResponse);
        throw new Error(
          saveErrorPayload ??
            `Sauvegarde du layout impossible (${saveResponse.status}).`,
        );
      }

      setLayoutData(nextLayoutData);
    } catch (error) {
      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de sauvegarder le layout de la carte.",
      );
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    errorMessage,
    isLoading,
    isSaving,
    layoutData,
    saveErrorMessage,
    saveLayout,
  };
}

/**
 * Lit proprement le message d'erreur renvoye par l'API de layout.
 */
async function readErrorPayload(response: Response): Promise<string | null> {
  try {
    const errorPayload = await response.json() as { error?: string };
    return typeof errorPayload.error === "string" ? errorPayload.error : null;
  } catch {
    return null;
  }
}
