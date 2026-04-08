import "leaflet/dist/leaflet.css";
import { useInfrastructureMapBootstrap } from "@/features/infrastructure-map/model/useInfrastructureMapBootstrap";
import { LoadedInfrastructureMap } from "@/features/infrastructure-map/ui/LoadedInfrastructureMap";
import { InfrastructureMapStatus } from "@/features/infrastructure-map/ui/InfrastructureMapStatus";

const MAP_IMAGE_URL = "/api/map-image";

export default function InfrastructureMap() {
  const infrastructureMapBootstrap = useInfrastructureMapBootstrap(MAP_IMAGE_URL);

  if (infrastructureMapBootstrap.isLoading) {
    return (
      <InfrastructureMapStatus
        message="Chargement des ressources de la carte..."
        title="Chargement"
        tone="info"
      />
    );
  }

  if (infrastructureMapBootstrap.errorMessage !== null) {
    return (
      <InfrastructureMapStatus
        message={infrastructureMapBootstrap.errorMessage}
        title="Carte indisponible"
        tone="error"
      />
    );
  }

  if (infrastructureMapBootstrap.bootstrap === null) {
    return (
      <InfrastructureMapStatus
        message="Impossible de charger les données de la carte."
        title="Carte indisponible"
        tone="error"
      />
    );
  }

  return (
    <LoadedInfrastructureMap
      availableSectors={infrastructureMapBootstrap.bootstrap.availableSectors}
      imageDimensions={infrastructureMapBootstrap.bootstrap.imageDimensions}
      imageUrl={MAP_IMAGE_URL}
      initialMarkers={infrastructureMapBootstrap.bootstrap.initialMarkers}
      initialPlacementCandidates={infrastructureMapBootstrap.bootstrap.initialPlacementCandidates}
      initialZones={infrastructureMapBootstrap.bootstrap.initialZones}
    />
  );
}

