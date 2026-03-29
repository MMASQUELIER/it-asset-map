import { useEffect, useState } from "react";
import type { PlacementPcCandidate } from "../shared/types";
import { buildPlacementPcCandidates } from "../markers/logic/backendPlacementCandidates";

interface BackendInfrastructureCatalogOptions {
  assetsUrl: string;
  sectorsUrl: string;
}

interface BackendInfrastructureCatalogState {
  availableSectors: string[];
  errorMessage: string | null;
  isLoading: boolean;
  placementPcCandidates: PlacementPcCandidate[];
}

/**
 * Loads the backend asset catalog and the list of allowed sectors.
 *
 * @param options Backend endpoints used by the frontend map.
 * @returns Placement-ready PCs, allowed sectors and loading state.
 */
export default function useBackendInfrastructureCatalog({
  assetsUrl,
  sectorsUrl,
}: BackendInfrastructureCatalogOptions): BackendInfrastructureCatalogState {
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

        const [assetsResponse, sectorsResponse] = await Promise.all([
          fetch(assetsUrl),
          fetch(sectorsUrl),
        ]);

        if (!assetsResponse.ok) {
          throw new Error(`Chargement des assets impossible (${assetsResponse.status}).`);
        }

        if (!sectorsResponse.ok) {
          throw new Error(`Chargement des secteurs impossible (${sectorsResponse.status}).`);
        }

        const [assetRows, sectors] = await Promise.all([
          assetsResponse.json() as Promise<Record<string, unknown>[]>,
          sectorsResponse.json() as Promise<string[]>,
        ]);

        if (isCancelled) {
          return;
        }

        setPlacementPcCandidates(buildPlacementPcCandidates(assetRows));
        setAvailableSectors(sectors);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("Erreur lors du chargement du catalogue backend :", error);
        setPlacementPcCandidates([]);
        setAvailableSectors([]);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Impossible de charger le catalogue backend.",
        );
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
  }, [assetsUrl, sectorsUrl]);

  return {
    availableSectors,
    errorMessage,
    isLoading,
    placementPcCandidates,
  };
}
