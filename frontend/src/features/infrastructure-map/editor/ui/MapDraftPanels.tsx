import type {
  MarkerDraft,
  PlacementPcCandidate,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import MarkerDraftForm from "@/features/infrastructure-map/markers/ui/MarkerDraftForm";
import ZoneDraftForm from "@/features/infrastructure-map/zones/ui/ZoneDraftForm";

/** Props des panneaux flottants d'edition des drafts. */
interface MapDraftPanelsProps {
  availableSectors: string[];
  markerDraft: MarkerDraft | null;
  markerDraftError: string | null;
  markerDraftId: string;
  markerPlacementCandidates: PlacementPcCandidate[];
  onCancel: () => void;
  onMarkerIdChange: (value: string) => void;
  onMarkerSubmit: () => void;
  onZoneProdschedChange: (value: string) => void;
  onZoneSectorChange: (value: string) => void;
  onZoneSubmit: () => void;
  zoneDraft: ZoneDraft | null;
  zoneDraftError: string | null;
  zoneDraftProdsched: string;
  zoneDraftSector: string;
}

/**
 * Affiche les formulaires de draft actuellement ouverts sur la carte.
 */
export default function MapDraftPanels({
  availableSectors,
  markerDraft,
  markerDraftError,
  markerDraftId,
  markerPlacementCandidates,
  onCancel,
  onMarkerIdChange,
  onMarkerSubmit,
  onZoneProdschedChange,
  onZoneSectorChange,
  onZoneSubmit,
  zoneDraft,
  zoneDraftError,
  zoneDraftProdsched,
  zoneDraftSector,
}: MapDraftPanelsProps) {
  if (markerDraft === null && zoneDraft === null) {
    return null;
  }

  return (
    <>
      {renderMarkerDraftForm(
        markerDraft,
        markerPlacementCandidates,
        markerDraftError,
        markerDraftId,
        onCancel,
        onMarkerIdChange,
        onMarkerSubmit,
      )}
      {renderZoneDraftForm(
        zoneDraft,
        availableSectors,
        zoneDraftError,
        onCancel,
        onZoneProdschedChange,
        onZoneSectorChange,
        onZoneSubmit,
        zoneDraftProdsched,
        zoneDraftSector,
      )}
    </>
  );
}

function renderMarkerDraftForm(
  markerDraft: MarkerDraft | null,
  markerPlacementCandidates: PlacementPcCandidate[],
  markerDraftError: string | null,
  markerDraftId: string,
  onCancel: () => void,
  onMarkerIdChange: (value: string) => void,
  onMarkerSubmit: () => void,
) {
  if (markerDraft === null) {
    return null;
  }

  return (
    <MarkerDraftForm
      availableCandidates={markerPlacementCandidates}
      draft={markerDraft}
      errorMessage={markerDraftError}
      markerId={markerDraftId}
      onCancel={onCancel}
      onMarkerIdChange={onMarkerIdChange}
      onSubmit={onMarkerSubmit}
    />
  );
}

function renderZoneDraftForm(
  zoneDraft: ZoneDraft | null,
  availableSectors: string[],
  zoneDraftError: string | null,
  onCancel: () => void,
  onZoneProdschedChange: (value: string) => void,
  onZoneSectorChange: (value: string) => void,
  onZoneSubmit: () => void,
  zoneDraftProdsched: string,
  zoneDraftSector: string,
) {
  if (zoneDraft === null) {
    return null;
  }

  return (
    <ZoneDraftForm
      availableSectors={availableSectors}
      draft={zoneDraft}
      errorMessage={zoneDraftError}
      onCancel={onCancel}
      onProdschedChange={onZoneProdschedChange}
      onSectorChange={onZoneSectorChange}
      onSubmit={onZoneSubmit}
      zoneProdsched={zoneDraftProdsched}
      zoneSector={zoneDraftSector}
    />
  );
}
