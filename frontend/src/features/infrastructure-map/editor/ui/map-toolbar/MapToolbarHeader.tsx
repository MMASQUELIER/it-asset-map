import type { ToolDefinition } from "@/features/infrastructure-map/editor/ui/map-toolbar/mapToolbarDefinitions";
import {
  closeButtonClassName,
  eyebrowTextClassName,
  infoBadgeClassName,
  joinClassNames,
  panelDescriptionTextClassName,
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
  description: string;
  onAction: () => void;
  status: string;
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
      <div className="grid max-w-[30rem] gap-1.5">
        <p className={eyebrowTextClassName}>Outils de carte</p>
        <p className={panelTitleTextClassName}>{content.title}</p>
        <p className={panelDescriptionTextClassName}>{content.description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <span
          className={joinClassNames(
            infoBadgeClassName,
            isInteractionMode
              ? "border-schneider-500/18 bg-schneider-500/10 text-schneider-700"
              : "bg-schneider-100/70 text-schneider-800/75",
          )}
        >
          {content.status}
        </span>

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
      actionLabel: "Activer le mode interaction",
      description:
        "Activez le mode interaction pour modifier les zones et les marqueurs.",
      onAction: onOpenInteractionMode,
      status: "Navigation libre",
      title: "Carte en lecture",
    };
  }

  return {
    actionLabel: "Fermer le mode interaction",
    description: "Choisissez un outil puis intervenez directement sur le plan.",
    onAction: onCloseInteractionMode,
    status: `Outil actif : ${activeToolDefinition.label}`,
    title: "Mode interaction actif",
  };
}
