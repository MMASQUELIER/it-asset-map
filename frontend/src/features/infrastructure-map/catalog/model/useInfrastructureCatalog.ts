import { useEffect, useState } from "react";
import type {
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

  useEffect(() => {
    let isCancelled = false;

    async function loadCatalog(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const catalogResponse = await fetch(catalogUrl);

        if (!catalogResponse.ok) {
          throw new Error(`Chargement du catalogue impossible (${catalogResponse.status}).`);
        }

        const catalog = await catalogResponse.json() as InfrastructureCatalog;

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
  }, [catalogUrl]);

  return {
    availableSectors,
    errorMessage,
    isLoading,
    placementPcCandidates,
  };
}
