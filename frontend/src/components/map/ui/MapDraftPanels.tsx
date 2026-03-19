import type { MarkerDraft, ZoneDraft } from "../../../types/layout";
import MarkerDraftForm from "./MarkerDraftForm";
import ZoneDraftForm from "./ZoneDraftForm";

interface MapDraftPanelsProps {
  markerDraft: MarkerDraft | null;
  markerDraftError: string | null;
  markerDraftId: string;
  onCancel: () => void;
  onMarkerIdChange: (value: string) => void;
  onMarkerSubmit: () => void;
  onZoneColorChange: (value: string) => void;
  onZoneIdChange: (value: string) => void;
  onZoneSubmit: () => void;
  zoneDraft: ZoneDraft | null;
  zoneDraftError: string | null;
  zoneDraftId: string;
}

export default function MapDraftPanels({
  markerDraft,
  markerDraftError,
  markerDraftId,
  onCancel,
  onMarkerIdChange,
  onMarkerSubmit,
  onZoneColorChange,
  onZoneIdChange,
  onZoneSubmit,
  zoneDraft,
  zoneDraftError,
  zoneDraftId,
}: MapDraftPanelsProps) {
  return (
    <>
      {markerDraft !== null ? (
        <MarkerDraftForm
          draft={markerDraft}
          errorMessage={markerDraftError}
          markerId={markerDraftId}
          onCancel={onCancel}
          onMarkerIdChange={onMarkerIdChange}
          onSubmit={onMarkerSubmit}
        />
      ) : null}

      {zoneDraft !== null ? (
        <ZoneDraftForm
          draft={zoneDraft}
          errorMessage={zoneDraftError}
          onCancel={onCancel}
          onColorChange={onZoneColorChange}
          onIdChange={onZoneIdChange}
          onSubmit={onZoneSubmit}
          zoneId={zoneDraftId}
        />
      ) : null}
    </>
  );
}
