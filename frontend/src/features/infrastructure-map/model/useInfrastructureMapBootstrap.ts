import { useEffect, useState } from "react";
import {
  listEquipment,
  listEquipmentData,
  listSectors,
  listZones,
} from "@/features/infrastructure-map/api/client";
import { loadMapImageDimensions } from "@/features/infrastructure-map/map-image/services/loadMapImageDimensions";
import { buildPlacementCandidates, hydrateInteractiveMarkers, hydrateMapZones } from "@/features/infrastructure-map/model/resourceHydration";
import { normalizeAppErrorMessage } from "@/features/infrastructure-map/shared/errorMessages";
import type {
  InteractiveMarker,
  MapImageDimensions,
  MapZone,
  PlacementCandidate,
  SectorRecord,
} from "@/features/infrastructure-map/model/types";

interface InfrastructureMapBootstrap {
  availableSectors: SectorRecord[];
  imageDimensions: MapImageDimensions;
  initialMarkers: InteractiveMarker[];
  initialPlacementCandidates: PlacementCandidate[];
  initialZones: MapZone[];
}

interface InfrastructureMapBootstrapState {
  bootstrap: InfrastructureMapBootstrap | null;
  errorMessage: string | null;
  isLoading: boolean;
}

export function useInfrastructureMapBootstrap(
  imageUrl: string,
): InfrastructureMapBootstrapState {
  const [bootstrap, setBootstrap] = useState<InfrastructureMapBootstrap | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadBootstrap(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [
          imageDimensions,
          sectors,
          zoneRecords,
          equipmentDataRecords,
          equipmentRecords,
        ] = await Promise.all([
          loadMapImageDimensions(imageUrl),
          listSectors(),
          listZones(),
          listEquipmentData(),
          listEquipment(),
        ]);

        if (isCancelled) {
          return;
        }

        const initialZones = hydrateMapZones(zoneRecords, sectors);
        const initialPlacementCandidates = buildPlacementCandidates(
          equipmentDataRecords,
        );
        const initialMarkers = hydrateInteractiveMarkers(
          equipmentRecords,
          equipmentDataRecords,
          initialZones,
        );

        setBootstrap({
          availableSectors: sectors,
          imageDimensions,
          initialMarkers,
          initialPlacementCandidates,
          initialZones,
        });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setBootstrap(null);
        setErrorMessage(
          normalizeAppErrorMessage(error, "Impossible de charger la carte."),
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadBootstrap();

    return () => {
      isCancelled = true;
    };
  }, [imageUrl]);

  return {
    bootstrap,
    errorMessage,
    isLoading,
  };
}
