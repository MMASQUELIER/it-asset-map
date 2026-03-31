import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  PlacementPcCandidate,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import MapDraftPanels from "@/features/infrastructure-map/editor/ui/MapDraftPanels";
import PcDetailsPanel from "@/features/infrastructure-map/pc-details/ui/PcDetailsPanel";
import SelectedZonePanel from "@/features/infrastructure-map/zones/ui/SelectedZonePanel";

interface InfrastructureMapOverlaysProps {
  availablePlacementPcCandidates: PlacementPcCandidate[];
  availableSectors: string[];
  isInteractionMode: boolean;
  isZoneEditToolActive: boolean;
  markerDraft: MarkerDraft | null;
  markerDraftError: string | null;
  markerDraftId: string;
  onCancelDrafts: () => void;
  onCloseSelectedMarker: () => void;
  onMarkerIdChange: (value: string) => void;
  onMarkerSubmit: () => void;
  onSelectedZoneClose: () => void;
  onSelectedZoneProdschedChange: (value: string) => void;
  onSelectedZoneSectorChange: (value: string) => void;
  onZoneProdschedChange: (value: string) => void;
  onZoneSectorChange: (value: string) => void;
  onZoneSubmit: () => void;
  selectedMarker: InteractiveMarker | null;
  selectedMarkerAssignedZone: MapZone | null;
  selectedZone: MapZone | null;
  zoneDraft: ZoneDraft | null;
  zoneDraftError: string | null;
  zoneDraftProdsched: string;
  zoneDraftSector: string;
}

export function InfrastructureMapOverlays({
  availablePlacementPcCandidates,
  availableSectors,
  isInteractionMode,
  isZoneEditToolActive,
  markerDraft,
  markerDraftError,
  markerDraftId,
  onCancelDrafts,
  onCloseSelectedMarker,
  onMarkerIdChange,
  onMarkerSubmit,
  onSelectedZoneClose,
  onSelectedZoneProdschedChange,
  onSelectedZoneSectorChange,
  onZoneProdschedChange,
  onZoneSectorChange,
  onZoneSubmit,
  selectedMarker,
  selectedMarkerAssignedZone,
  selectedZone,
  zoneDraft,
  zoneDraftError,
  zoneDraftProdsched,
  zoneDraftSector,
}: InfrastructureMapOverlaysProps) {
  return (
    <>
      <MapDraftPanels
        availableSectors={availableSectors}
        markerDraft={markerDraft}
        markerDraftError={markerDraftError}
        markerDraftId={markerDraftId}
        markerPlacementCandidates={availablePlacementPcCandidates}
        onCancel={onCancelDrafts}
        onMarkerIdChange={onMarkerIdChange}
        onMarkerSubmit={onMarkerSubmit}
        onZoneProdschedChange={onZoneProdschedChange}
        onZoneSectorChange={onZoneSectorChange}
        onZoneSubmit={onZoneSubmit}
        zoneDraft={zoneDraft}
        zoneDraftError={zoneDraftError}
        zoneDraftProdsched={zoneDraftProdsched}
        zoneDraftSector={zoneDraftSector}
      />
      {isInteractionMode && isZoneEditToolActive && selectedZone !== null &&
          markerDraft === null && zoneDraft === null
        ? (
          <SelectedZonePanel
            availableSectors={availableSectors}
            onClose={onSelectedZoneClose}
            onProdschedChange={onSelectedZoneProdschedChange}
            onSectorChange={onSelectedZoneSectorChange}
            zone={selectedZone}
          />
        )
        : null}
      {!isInteractionMode && selectedMarker !== null
        ? (
          <PcDetailsPanel
            marker={selectedMarker}
            onClose={onCloseSelectedMarker}
            zone={selectedMarkerAssignedZone}
          />
        )
        : null}
    </>
  );
}
