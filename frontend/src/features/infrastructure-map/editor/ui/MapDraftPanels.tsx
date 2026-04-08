import type {
  MarkerDraft,
  PlacementCandidate,
  SectorRecord,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import MarkerDraftForm from "@/features/infrastructure-map/markers/ui/MarkerDraftForm";
import ZoneDraftForm from "@/features/infrastructure-map/zones/ui/ZoneDraftForm";

interface MapDraftPanelsProps {
  availableSectors: SectorRecord[];
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
      {markerDraft !== null ? (
        <MarkerDraftForm
          availableCandidates={markerPlacementCandidates}
          draft={markerDraft}
          markerId={markerDraftId}
          onCancel={onCancel}
          onMarkerIdChange={onMarkerIdChange}
          onSubmit={onMarkerSubmit}
        />
      ) : null}
      {zoneDraft !== null ? (
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
      ) : null}
    </>
  );
}
