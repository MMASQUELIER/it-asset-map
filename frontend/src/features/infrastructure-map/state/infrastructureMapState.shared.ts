import type {
  EditablePcFieldId,
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  PlacementCandidate,
  SectorRecord,
  ZoneDraft,
  ZoneDraftValues,
} from "@/features/infrastructure-map/model/types";
import type {
  InteractionTool,
  ZoneResizeHandle,
} from "@/features/infrastructure-map/shared/interactionTypes";

/** Etat public et callbacks exposes par le hook principal de la carte. */
export interface InfrastructureMapState {
  activeTool: InteractionTool;
  availablePlacementCandidates: PlacementCandidate[];
  availableSectors: string[];
  highlightedZoneId: number | null;
  clearRuntimeError: () => void;
  clearPendingDrafts: () => void;
  handleCloseInteractionMode: () => void;
  handleDeleteMarker: (markerId: string) => void;
  handleLeaveZone: () => void;
  handleMoveMarker: (markerId: string, x: number, y: number) => void;
  handleMarkerPlacement: (x: number, y: number) => void;
  handleMarkerDraftSave: () => void;
  handleOpenInteractionMode: () => void;
  handleHoverZone: (zoneId: number) => void;
  handleSelectTool: (tool: InteractionTool) => void;
  handleZoneInteraction: (zoneId: number) => void;
  handleUpdateMarkerTechnicalDetails: (
    markerId: string,
    equipmentDataId: number,
    fieldId: EditablePcFieldId,
    value: string,
  ) => void;
  handleZoneDraftCodeChange: (value: string) => void;
  handleZoneDraftNameChange: (value: string) => void;
  handleZoneDraftSectorChange: (value: string) => void;
  handleZoneDraftSave: () => void;
  handleSelectedZoneSave: (input: ZoneDraftValues) => void;
  handleZoneDraftDrag: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ) => void;
  handleZoneResizePreview: (
    handle: ZoneResizeHandle,
    x: number,
    y: number,
  ) => void;
  handleZoneResizeCommit: (
    handle: ZoneResizeHandle,
    x: number,
    y: number,
  ) => void;
  handleCloseSelectedMarker: () => void;
  handleSelectMarker: (markerId: string) => void;
  isSavingChanges: boolean;
  isMarkerCreationToolActive: boolean;
  isMarkerMoveToolActive: boolean;
  isCreationToolActive: boolean;
  isZoneCreationToolActive: boolean;
  isMarkerDeletionToolActive: boolean;
  isDeletionToolActive: boolean;
  isInteractionMode: boolean;
  isZoneEditToolActive: boolean;
  pendingMarkerDraft: MarkerDraft | null;
  pendingMarkerDraftError: string | null;
  pendingEquipmentId: string;
  saveErrorMessage: string | null;
  sectors: SectorRecord[];
  markers: InteractiveMarker[];
  selectedMarker: InteractiveMarker | null;
  selectedMarkerFocusToken: number;
  selectedMarkerId: string | null;
  selectedZone: MapZone | null;
  setPendingEquipmentId: (value: string) => void;
  pendingZoneDraft: ZoneDraft | null;
  pendingZoneDraftError: string | null;
  pendingZoneCode: string;
  pendingZoneName: string;
  pendingZoneSectorName: string;
  zones: MapZone[];
}
