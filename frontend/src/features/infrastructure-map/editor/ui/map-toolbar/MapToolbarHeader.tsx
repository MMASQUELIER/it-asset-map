import type { ToolDefinition } from "@/features/infrastructure-map/editor/ui/map-toolbar/mapToolbarDefinitions";
import {
  closeButtonClassName,
  eyebrowTextClassName,
  joinClassNames,
  panelTitleTextClassName,
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

export function MapToolbarHeader({
  activeToolDefinition,
  isInteractionMode,
  onCloseInteractionMode,
  onOpenInteractionMode,
}: MapToolbarHeaderProps) {
  const content = getMapToolbarHeaderContent(
    activeToolDefinition,
    isInteractionMode,
    onCloseInteractionMode,
    onOpenInteractionMode,
  );

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="grid gap-1.5">
        <p className={eyebrowTextClassName}>Edition</p>
        <p className={panelTitleTextClassName}>{content.title}</p>
        {content.status !== undefined
          ? <p className="m-0 text-sm text-schneider-800/70">{content.status}</p>
          : null}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          aria-pressed={isInteractionMode}
          className={joinClassNames(
            closeButtonClassName,
            "min-h-11 border-schneider-800/10 bg-schneider-800 px-5 text-white",
            "hover:border-schneider-900/20 hover:bg-schneider-700",
            isInteractionMode && "bg-schneider-700",
          )}
          type="button"
          onClick={content.onAction}
        >
          {content.actionLabel}
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
      title: "Modification des zones et postes",
    };
  }

  return {
    actionLabel: "Quitter l'edition",
    onAction: onCloseInteractionMode,
    status: `Outil actif: ${activeToolDefinition.label}`,
    title: "Modification des zones et postes",
  };
}
