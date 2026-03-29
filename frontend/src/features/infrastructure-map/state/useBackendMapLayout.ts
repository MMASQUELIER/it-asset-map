import { useCallback, useEffect, useState } from "react";
import type { MapLayoutData } from "../shared/types";

interface BackendMapLayoutOptions {
  layoutUrl: string;
}

interface BackendMapLayoutState {
  errorMessage: string | null;
  isLoading: boolean;
  isSaving: boolean;
  layoutData: MapLayoutData | null;
  saveErrorMessage: string | null;
  saveLayout: (layoutData: MapLayoutData) => Promise<void>;
}

/**
 * Loads and persists the editable map layout stored by the backend.
 *
 * @param options Backend URL used to read and write the layout JSON.
 * @returns Loaded layout data, loading state and save callback.
 */
export default function useBackendMapLayout({
  layoutUrl,
}: BackendMapLayoutOptions): BackendMapLayoutState {
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

        console.error("Erreur lors du chargement du layout :", error);
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
  }, [layoutUrl]);

  const saveLayout = useCallback(async (nextLayoutData: MapLayoutData) => {
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
      console.error("Erreur lors de la sauvegarde du layout :", error);
      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de sauvegarder le layout de la carte.",
      );
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [layoutUrl]);

  return {
    errorMessage,
    isLoading,
    isSaving,
    layoutData,
    saveErrorMessage,
    saveLayout,
  };
}

async function readErrorPayload(response: Response): Promise<string | null> {
  try {
    const errorPayload = await response.json() as { error?: string };
    return typeof errorPayload.error === "string" ? errorPayload.error : null;
  } catch {
    return null;
  }
}
