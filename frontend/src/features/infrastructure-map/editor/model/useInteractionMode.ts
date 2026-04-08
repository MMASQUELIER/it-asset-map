import { useState } from "react";
import type { InteractionTool } from "@/features/infrastructure-map/shared/interactionTypes";

export interface InteractionModeState {
  activeTool: InteractionTool;
  isCreationToolActive: boolean;
  isDeletionToolActive: boolean;
  isInteractionMode: boolean;
  isMarkerCreationToolActive: boolean;
  isMarkerDeletionToolActive: boolean;
  isMarkerMoveToolActive: boolean;
  isZoneCreationToolActive: boolean;
  isZoneDeletionToolActive: boolean;
  isZoneEditToolActive: boolean;
  openInteractionMode: () => void;
  closeInteractionMode: () => void;
  selectTool: (tool: InteractionTool) => void;
}

const INITIAL_TOOL: InteractionTool = "select-zone";

export default function useInteractionMode(): InteractionModeState {
  const [isInteractionMode, setIsInteractionMode] = useState(false);
  const [activeTool, setActiveTool] = useState<InteractionTool>(INITIAL_TOOL);

  function resetTool(): void {
    setActiveTool(INITIAL_TOOL);
  }

  function openInteractionMode(): void {
    setIsInteractionMode(true);
    resetTool();
  }

  function closeInteractionMode(): void {
    setIsInteractionMode(false);
    resetTool();
  }

  function selectTool(tool: InteractionTool): void {
    setActiveTool(tool);
  }

  const isMarkerCreationToolActive = isInteractionMode &&
    activeTool === "add-marker";
  const isMarkerMoveToolActive = isInteractionMode &&
    activeTool === "move-marker";
  const isMarkerDeletionToolActive = isInteractionMode &&
    activeTool === "delete-marker";
  const isZoneCreationToolActive = isInteractionMode &&
    activeTool === "add-zone";
  const isZoneDeletionToolActive = isInteractionMode &&
    activeTool === "delete-zone";
  const isZoneEditToolActive = isInteractionMode &&
    activeTool === "select-zone";

  return {
    activeTool,
    closeInteractionMode,
    isCreationToolActive: isMarkerCreationToolActive ||
      isZoneCreationToolActive,
    isDeletionToolActive: isMarkerDeletionToolActive ||
      isZoneDeletionToolActive,
    isInteractionMode,
    isMarkerCreationToolActive,
    isMarkerDeletionToolActive,
    isMarkerMoveToolActive,
    isZoneCreationToolActive,
    isZoneDeletionToolActive,
    isZoneEditToolActive,
    openInteractionMode,
    selectTool,
  };
}
