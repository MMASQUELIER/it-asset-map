import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  PlacementPcCandidate,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import type {
  InteractionTool,
  ZoneResizeHandle,
} from "@/features/infrastructure-map/shared/interactionTypes";

/** Etat public et callbacks exposes par le hook principal de la carte. */
export interface InfrastructureMapState {
  activeTool: InteractionTool;
  highlightedZoneId: number | null;
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
  handleZoneDraftProdschedChange: (value: string) => void;
  handleZoneDraftSectorChange: (value: string) => void;
  handleZoneDraftSave: () => void;
  handleSelectedZoneProdschedChange: (value: string) => void;
  handleSelectedZoneSectorChange: (value: string) => void;
  handleZoneDraftDrag: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ) => void;
  handleZoneResizeDrag: (
    handle: ZoneResizeHandle,
    x: number,
    y: number,
  ) => void;
  handleCloseSelectedMarker: () => void;
  handleSelectMarker: (markerId: string) => void;
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
  pendingMarkerId: string;
  availablePlacementPcCandidates: PlacementPcCandidate[];
  availableSectors: string[];
  markers: InteractiveMarker[];
  selectedMarker: InteractiveMarker | null;
  selectedMarkerFocusToken: number;
  selectedMarkerId: string | null;
  selectedZone: MapZone | null;
  setPendingMarkerId: (value: string) => void;
  pendingZoneDraft: ZoneDraft | null;
  pendingZoneDraftError: string | null;
  pendingZoneProdsched: string;
  pendingZoneSector: string;
  zones: MapZone[];
}
