import type { ToolDefinition } from "@/features/infrastructure-map/editor/ui/map-toolbar/mapToolbarDefinitions";
import {
  eyebrowTextClassName,
  joinClassNames,
  panelTitleTextClassName,
  primaryButtonClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

interface MapToolbarHeaderProps {
  activeToolDefinition: ToolDefinition;
  isInteractionMode: boolean;
  onCloseInteractionMode: () => void;
  onOpenInteractionMode: () => void;
}

interface MapToolbarHeaderContent {
  actionLabel: string;
  onAction: () => void;
  status?: string;
  title: string;
}

const MAP_TOOLBAR_TITLE = "Modification des zones et postes";

export function MapToolbarHeader({
  activeToolDefinition,
  isInteractionMode,
  onCloseInteractionMode,
  onOpenInteractionMode,
}: MapToolbarHeaderProps) {
  const headerContent = getMapToolbarHeaderContent(
    activeToolDefinition,
    isInteractionMode,
    onCloseInteractionMode,
    onOpenInteractionMode,
  );
  const actionButtonClassName = joinClassNames(
    primaryButtonClassName,
    "min-h-11 px-5",
    isInteractionMode && "border-schneider-700 bg-schneider-700",
  );

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="grid gap-1.5">
        <p className={eyebrowTextClassName}>Edition</p>
        <p className={panelTitleTextClassName}>{headerContent.title}</p>
        {headerContent.status !== undefined
          ? <p className="m-0 text-sm text-schneider-800/70">{headerContent.status}</p>
          : null}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          aria-pressed={isInteractionMode}
          className={actionButtonClassName}
          type="button"
          onClick={headerContent.onAction}
        >
          {headerContent.actionLabel}
        </button>
      </div>
    </div>
  );
}

function getMapToolbarHeaderContent(
  activeToolDefinition: ToolDefinition,
  isInteractionMode: boolean,
  onCloseInteractionMode: () => void,
  onOpenInteractionMode: () => void,
): MapToolbarHeaderContent {
  if (!isInteractionMode) {
    return {
      actionLabel: "Passer en edition",
      onAction: onOpenInteractionMode,
      title: MAP_TOOLBAR_TITLE,
    };
  }

  return {
    actionLabel: "Quitter l'edition",
    onAction: onCloseInteractionMode,
    status: `Outil actif: ${activeToolDefinition.label}`,
    title: MAP_TOOLBAR_TITLE,
  };
}
