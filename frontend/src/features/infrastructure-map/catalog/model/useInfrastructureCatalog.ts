import { useCallback, useEffect, useState } from "react";
import type {
  EditablePcFieldId,
  InfrastructureCatalog,
  PlacementPcCandidate,
} from "@/features/infrastructure-map/model/types";

interface UseInfrastructureCatalogOptions {
  catalogUrl: string;
}

interface InfrastructureCatalogState {
  availableSectors: string[];
  errorMessage: string | null;
  isLoading: boolean;
  placementPcCandidates: PlacementPcCandidate[];
  updatePcField: (input: UpdatePcFieldInput) => Promise<void>;
}

interface UpdatePcFieldInput {
  fieldId: EditablePcFieldId;
  sourceRowNumber: number;
  value: string;
}

/**
 * Charge le catalogue infrastructure expose par le backend.
 */
export default function useInfrastructureCatalog({
  catalogUrl,
}: UseInfrastructureCatalogOptions): InfrastructureCatalogState {
  const [placementPcCandidates, setPlacementPcCandidates] = useState<
    PlacementPcCandidate[]
  >([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCatalog = useCallback(async function fetchCatalog(): Promise<
    InfrastructureCatalog
  > {
    const catalogResponse = await fetch(catalogUrl);

    if (!catalogResponse.ok) {
      throw new Error(`Chargement du catalogue impossible (${catalogResponse.status}).`);
    }

    return await catalogResponse.json() as InfrastructureCatalog;
  }, [catalogUrl]);

  useEffect(() => {
    let isCancelled = false;

    async function loadCatalog(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const catalog = await fetchCatalog();

        if (isCancelled) {
          return;
        }

        setPlacementPcCandidates(catalog.placementPcCandidates);
        setAvailableSectors(catalog.availableSectors);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setPlacementPcCandidates([]);
        setAvailableSectors([]);

        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Impossible de charger le catalogue infrastructure.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      isCancelled = true;
    };
  }, [fetchCatalog]);

  const updatePcField = useCallback(async function updatePcField({
    fieldId,
    sourceRowNumber,
    value,
  }: UpdatePcFieldInput): Promise<void> {
    const updateResponse = await fetch(`${catalogUrl}/pc/${sourceRowNumber}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fieldId,
        value,
      }),
    });

    if (!updateResponse.ok) {
      const errorPayload = await readErrorPayload(updateResponse);

      throw new Error(
        errorPayload ??
          `Mise a jour du catalogue impossible (${updateResponse.status}).`,
      );
    }

    try {
      const nextCatalog = await fetchCatalog();

      setPlacementPcCandidates(nextCatalog.placementPcCandidates);
      setAvailableSectors(nextCatalog.availableSectors);
    } catch {
      // On conserve les donnees courantes si le refresh silencieux echoue.
    }
  }, [catalogUrl, fetchCatalog]);

  return {
    availableSectors,
    errorMessage,
    isLoading,
    placementPcCandidates,
    updatePcField,
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
