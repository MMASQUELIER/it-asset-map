import type { InteractionTool } from "@/features/infrastructure-map/shared/interactionTypes";

interface InteractionModeController {
  closeInteractionMode: () => void;
  openInteractionMode: () => void;
  selectTool: (tool: InteractionTool) => void;
}

interface CreateInteractionModeHandlersOptions {
  interactionMode: InteractionModeController;
  resetTransientUiState: () => void;
}

export function createInteractionModeHandlers({
  interactionMode,
  resetTransientUiState,
}: CreateInteractionModeHandlersOptions) {
  function handleOpenInteractionMode(): void {
    interactionMode.openInteractionMode();
    resetTransientUiState();
  }

  function handleCloseInteractionMode(): void {
    interactionMode.closeInteractionMode();
    resetTransientUiState();
  }

  function handleSelectTool(tool: InteractionTool): void {
    interactionMode.selectTool(tool);
    resetTransientUiState();
  }

  return {
    handleCloseInteractionMode,
    handleOpenInteractionMode,
    handleSelectTool,
  };
}
