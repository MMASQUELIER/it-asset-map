import "leaflet/dist/leaflet.css";
import useInfrastructureCatalog from "@/features/infrastructure-map/catalog/model/useInfrastructureCatalog";
import useMapLayout from "@/features/infrastructure-map/layout/model/useMapLayout";
import { LoadedInfrastructureMap } from "@/features/infrastructure-map/ui/LoadedInfrastructureMap";
import { InfrastructureMapStatus } from "@/features/infrastructure-map/ui/InfrastructureMapStatus";

interface InfrastructureMapProps {
  catalogUrl: string;
  imageUrl: string;
  layoutUrl: string;
}

export default function InfrastructureMap({
  catalogUrl,
  imageUrl,
  layoutUrl,
}: InfrastructureMapProps) {
  const infrastructureCatalogState = useInfrastructureCatalog({ catalogUrl });
  const mapLayoutState = useMapLayout({ imageUrl, layoutUrl });

  if (infrastructureCatalogState.isLoading || mapLayoutState.isLoading) {
    return (
      <InfrastructureMapStatus
        message="Chargement du catalogue Excel et du layout de la carte..."
        title="Chargement"
      />
    );
  }

  if (infrastructureCatalogState.errorMessage !== null) {
    return (
      <InfrastructureMapStatus
        message={infrastructureCatalogState.errorMessage}
        title="Catalogue indisponible"
      />
    );
  }

  if (mapLayoutState.errorMessage !== null || mapLayoutState.layoutData === null) {
    return (
      <InfrastructureMapStatus
        message={mapLayoutState.errorMessage ??
          "Impossible de charger le layout de la carte."}
        title="Layout indisponible"
      />
    );
  }

  return (
    <LoadedInfrastructureMap
      availableSectors={infrastructureCatalogState.availableSectors}
      imageUrl={imageUrl}
      isSavingLayout={mapLayoutState.isSaving}
      layoutData={mapLayoutState.layoutData}
      onSaveLayout={mapLayoutState.saveLayout}
      placementPcCandidates={infrastructureCatalogState.placementPcCandidates}
      saveLayoutErrorMessage={mapLayoutState.saveErrorMessage}
    />
  );
}
