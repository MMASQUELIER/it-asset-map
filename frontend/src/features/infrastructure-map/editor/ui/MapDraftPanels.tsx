import type {
  MarkerDraft,
  PlacementPcCandidate,
  ZoneDraft,
} from "../../shared/types";
import MarkerDraftForm from "../../markers/ui/MarkerDraftForm";
import ZoneDraftForm from "../../zones/ui/ZoneDraftForm";

/** Props for the floating draft editors displayed on top of the map. */
interface MapDraftPanelsProps {
  availableSectors: string[];
  markerDraft: MarkerDraft | null;
  markerDraftError: string | null;
  markerDraftId: string;
  markerPlacementCatalogError: string | null;
  markerPlacementCatalogLoading: boolean;
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
 * Renders the marker and zone draft forms currently active on the map.
 *
 * @param props Draft state and callbacks shared by both forms.
 * @returns Draft editor panels or `null` when no draft is active.
 */
export default function MapDraftPanels({
  availableSectors,
  markerDraft,
  markerDraftError,
  markerDraftId,
  markerPlacementCatalogError,
  markerPlacementCatalogLoading,
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
      {markerDraft !== null
        ? (
          <MarkerDraftForm
            availableCandidates={markerPlacementCandidates}
            draft={markerDraft}
            errorMessage={markerDraftError}
            markerId={markerDraftId}
            placementCatalogError={markerPlacementCatalogError}
            placementCatalogLoading={markerPlacementCatalogLoading}
            onCancel={onCancel}
            onMarkerIdChange={onMarkerIdChange}
            onSubmit={onMarkerSubmit}
          />
        )
        : null}

      {zoneDraft !== null
        ? (
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
        )
        : null}
    </>
  );
}
