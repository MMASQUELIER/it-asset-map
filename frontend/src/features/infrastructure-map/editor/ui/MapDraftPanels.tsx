import type {
  MarkerDraft,
  PlacementCandidate,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import MarkerDraftForm from "@/features/infrastructure-map/markers/ui/MarkerDraftForm";
import ZoneDraftForm from "@/features/infrastructure-map/zones/ui/ZoneDraftForm";

/** Props des panneaux flottants d'edition des drafts. */
interface MapDraftPanelsProps {
  availableSectors: string[];
  markerDraft: MarkerDraft | null;
  markerDraftId: string;
  markerPlacementCandidates: PlacementCandidate[];
  onCancel: () => void;
  onMarkerIdChange: (value: string) => void;
  onMarkerSubmit: () => void;
  onZoneCodeChange: (value: string) => void;
  onZoneNameChange: (value: string) => void;
  onZoneSectorChange: (value: string) => void;
  onZoneSubmit: () => void;
  zoneDraft: ZoneDraft | null;
  zoneDraftCode: string;
  zoneDraftName: string;
  zoneDraftSectorName: string;
}

/**
 * Affiche les formulaires de draft actuellement ouverts sur la carte.
 */
export default function MapDraftPanels({
  availableSectors,
  markerDraft,
  markerDraftId,
  markerPlacementCandidates,
  onCancel,
  onMarkerIdChange,
  onMarkerSubmit,
  onZoneCodeChange,
  onZoneNameChange,
  onZoneSectorChange,
  onZoneSubmit,
  zoneDraft,
  zoneDraftCode,
  zoneDraftName,
  zoneDraftSectorName,
}: MapDraftPanelsProps) {
  if (markerDraft === null && zoneDraft === null) {
    return null;
  }

  return (
    <>
      {renderMarkerDraftForm(
        markerDraft,
        markerPlacementCandidates,
        markerDraftId,
        onCancel,
        onMarkerIdChange,
        onMarkerSubmit,
      )}
      {renderZoneDraftForm(
        zoneDraft,
        availableSectors,
        onCancel,
        onZoneCodeChange,
        onZoneNameChange,
        onZoneSectorChange,
        onZoneSubmit,
        zoneDraftCode,
        zoneDraftName,
        zoneDraftSectorName,
      )}
    </>
  );
}

function renderMarkerDraftForm(
  markerDraft: MarkerDraft | null,
  markerPlacementCandidates: PlacementCandidate[],
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
  onCancel: () => void,
  onZoneCodeChange: (value: string) => void,
  onZoneNameChange: (value: string) => void,
  onZoneSectorChange: (value: string) => void,
  onZoneSubmit: () => void,
  zoneDraftCode: string,
  zoneDraftName: string,
  zoneDraftSectorName: string,
) {
  if (zoneDraft === null) {
    return null;
  }

  return (
    <ZoneDraftForm
      availableSectors={availableSectors}
      draft={zoneDraft}
      onCancel={onCancel}
      onCodeChange={onZoneCodeChange}
      onNameChange={onZoneNameChange}
      onSectorChange={onZoneSectorChange}
      onSubmit={onZoneSubmit}
      zoneCode={zoneDraftCode}
      zoneName={zoneDraftName}
      zoneSectorName={zoneDraftSectorName}
    />
  );
}
