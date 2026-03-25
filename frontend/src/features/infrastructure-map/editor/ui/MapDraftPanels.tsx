import type { MarkerDraft, ZoneDraft } from "../../shared/types";
import MarkerDraftForm from "../../markers/ui/MarkerDraftForm";
import ZoneDraftForm from "../../zones/ui/ZoneDraftForm";

/** Props for the floating draft editors displayed on top of the map. */
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

/**
 * Renders the marker and zone draft forms currently active on the map.
 *
 * @param props Draft state and callbacks shared by both forms.
 * @returns Draft editor panels or `null` when no draft is active.
 */
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
  if (markerDraft === null && zoneDraft === null) {
    return null;
  }

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
