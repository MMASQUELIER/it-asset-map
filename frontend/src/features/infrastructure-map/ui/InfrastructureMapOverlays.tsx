import type {
  EditablePcFieldId,
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  PlacementCandidate,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import MapDraftPanels from "@/features/infrastructure-map/editor/ui/MapDraftPanels";
import PcDetailsPanel from "@/features/infrastructure-map/pc-details/ui/PcDetailsPanel";
import SelectedZonePanel from "@/features/infrastructure-map/zones/ui/SelectedZonePanel";

interface InfrastructureMapOverlaysProps {
  availablePlacementCandidates: PlacementCandidate[];
  availableSectors: string[];
  isInteractionMode: boolean;
  isSaving: boolean;
  isZoneEditToolActive: boolean;
  markerDraft: MarkerDraft | null;
  markerDraftId: string;
  onCancelDrafts: () => void;
  onCloseSelectedMarker: () => void;
  onMarkerIdChange: (value: string) => void;
  onMarkerSubmit: () => void;
  onSelectedZoneClose: () => void;
  onSelectedZoneInputChange: () => void;
  onSelectedZoneSubmit: (input: {
    code: string;
    name: string;
    sectorName: string;
  }) => void;
  onZoneCodeChange: (value: string) => void;
  onZoneNameChange: (value: string) => void;
  onZoneSectorChange: (value: string) => void;
  onZoneSubmit: () => void;
  onUpdatePcField: (
    markerId: string,
    equipmentDataId: number,
    fieldId: EditablePcFieldId,
    value: string,
  ) => Promise<void> | void;
  selectedMarker: InteractiveMarker | null;
  selectedMarkerAssignedZone: MapZone | null;
  selectedZone: MapZone | null;
  zoneDraft: ZoneDraft | null;
  zoneDraftCode: string;
  zoneDraftName: string;
  zoneDraftSectorName: string;
}

export function InfrastructureMapOverlays({
  availablePlacementCandidates,
  availableSectors,
  isInteractionMode,
  isSaving,
  isZoneEditToolActive,
  markerDraft,
  markerDraftId,
  onCancelDrafts,
  onCloseSelectedMarker,
  onMarkerIdChange,
  onMarkerSubmit,
  onSelectedZoneClose,
  onSelectedZoneInputChange,
  onSelectedZoneSubmit,
  onZoneCodeChange,
  onZoneNameChange,
  onZoneSectorChange,
  onZoneSubmit,
  onUpdatePcField,
  selectedMarker,
  selectedMarkerAssignedZone,
  selectedZone,
  zoneDraft,
  zoneDraftCode,
  zoneDraftName,
  zoneDraftSectorName,
}: InfrastructureMapOverlaysProps) {
  return (
    <>
      <MapDraftPanels
        availableSectors={availableSectors}
        markerDraft={markerDraft}
        markerDraftId={markerDraftId}
        markerPlacementCandidates={availablePlacementCandidates}
        onCancel={onCancelDrafts}
        onMarkerIdChange={onMarkerIdChange}
        onMarkerSubmit={onMarkerSubmit}
        onZoneCodeChange={onZoneCodeChange}
        onZoneNameChange={onZoneNameChange}
        onZoneSectorChange={onZoneSectorChange}
        onZoneSubmit={onZoneSubmit}
        zoneDraft={zoneDraft}
        zoneDraftCode={zoneDraftCode}
        zoneDraftName={zoneDraftName}
        zoneDraftSectorName={zoneDraftSectorName}
      />
      {isInteractionMode && isZoneEditToolActive && selectedZone !== null &&
          markerDraft === null && zoneDraft === null
        ? (
          <SelectedZonePanel
            availableSectors={availableSectors}
            isSaving={isSaving}
            onClose={onSelectedZoneClose}
            onInputChange={onSelectedZoneInputChange}
            onSubmit={onSelectedZoneSubmit}
            zone={selectedZone}
          />
        )
        : null}
      {!isInteractionMode && selectedMarker !== null
        ? (
          <PcDetailsPanel
            marker={selectedMarker}
            onClose={onCloseSelectedMarker}
            onUpdatePcField={onUpdatePcField}
            zone={selectedMarkerAssignedZone}
          />
        )
        : null}
    </>
  );
}
