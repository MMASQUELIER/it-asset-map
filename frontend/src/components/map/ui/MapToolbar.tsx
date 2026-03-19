import type { InteractionTool } from "../logic/interactionTypes";

interface MapToolbarProps {
  activeTool: InteractionTool;
  isInteractionMode: boolean;
  onCloseInteractionMode: () => void;
  onOpenInteractionMode: () => void;
  onSelectTool: (tool: InteractionTool) => void;
}

const TOOL_BUTTONS: Array<{
  className: string;
  id: InteractionTool;
  label: string;
}> = [
  {
    id: "select-zone",
    label: "Editer zone",
    className: "map-toolbar__button--zone",
  },
  {
    id: "add-marker",
    label: "Ajouter un marqueur",
    className: "map-toolbar__button--primary",
  },
  {
    id: "move-marker",
    label: "Deplacer un marqueur",
    className: "map-toolbar__button--move",
  },
  {
    id: "delete-marker",
    label: "Supprimer un marqueur",
    className: "map-toolbar__button--danger",
  },
  {
    id: "add-zone",
    label: "Ajouter une zone",
    className: "map-toolbar__button--zone",
  },
  {
    id: "delete-zone",
    label: "Supprimer une zone",
    className: "map-toolbar__button--danger",
  },
];

export default function MapToolbar({
  activeTool,
  isInteractionMode,
  onCloseInteractionMode,
  onOpenInteractionMode,
  onSelectTool,
}: MapToolbarProps) {
  return (
    <div className="map-toolbar">
      <button
        className={`map-toolbar__button map-toolbar__button--interaction${isInteractionMode ? " map-toolbar__button--active" : ""}`}
        type="button"
        onClick={isInteractionMode ? onCloseInteractionMode : onOpenInteractionMode}
      >
        {isInteractionMode ? "Fermer le mode interaction" : "Mode interaction"}
      </button>

      {isInteractionMode ? (
        <>
          {TOOL_BUTTONS.map((tool) => (
            <button
              key={tool.id}
              className={`map-toolbar__button ${tool.className}${activeTool === tool.id ? " map-toolbar__button--active" : ""}`}
              type="button"
              onClick={() => onSelectTool(tool.id)}
            >
              {tool.label}
            </button>
          ))}
        </>
      ) : null}

      <span className="map-toolbar__status">
        {isInteractionMode ? getToolLabel(activeTool) : "Carte en lecture"}
      </span>
    </div>
  );
}

function getToolLabel(tool: InteractionTool): string {
  switch (tool) {
    case "select-zone":
      return "Interaction : edition des zones";
    case "add-marker":
      return "Interaction : ajout de marqueur";
    case "move-marker":
      return "Interaction : deplacement de marqueur";
    case "delete-marker":
      return "Interaction : suppression de marqueur";
    case "add-zone":
      return "Interaction : ajout de zone";
    case "delete-zone":
      return "Interaction : suppression de zone";
  }
}
