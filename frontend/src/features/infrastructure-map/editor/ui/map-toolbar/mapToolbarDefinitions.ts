import type { InteractionTool } from "@/features/infrastructure-map/shared/interactionTypes";

export interface ToolDefinition {
  description: string;
  id: InteractionTool;
  label: string;
  tone: "danger" | "move" | "primary" | "zone";
}

export interface ToolSection {
  description: string;
  title: string;
  tools: ToolDefinition[];
}

export const TOOL_SECTIONS: ToolSection[] = [
  {
    title: "Marqueurs",
    description: "Agir sur les PC affiches sur le plan.",
    tools: [
      {
        id: "add-marker",
        label: "Ajouter un marqueur",
        description: "Cliquez sur la carte pour preparer un nouveau PC.",
        tone: "primary",
      },
      {
        id: "move-marker",
        label: "Deplacer un marqueur",
        description: "Glissez un PC vers sa nouvelle position.",
        tone: "move",
      },
      {
        id: "delete-marker",
        label: "Supprimer un marqueur",
        description: "Cliquez sur un PC pour le retirer.",
        tone: "danger",
      },
    ],
  },
  {
    title: "Zones",
    description: "Mettre a jour les zones et leur contour.",
    tools: [
      {
        id: "select-zone",
        label: "Editer une zone",
        description:
          "Selectionnez une zone pour changer son secteur, son prodsched ou ses coins.",
        tone: "zone",
      },
      {
        id: "add-zone",
        label: "Ajouter une zone",
        description:
          "Dessinez un rectangle puis choisissez rapidement secteur et prodsched.",
        tone: "zone",
      },
      {
        id: "delete-zone",
        label: "Supprimer une zone",
        description: "Cliquez sur une zone pour retirer son contour.",
        tone: "danger",
      },
    ],
  },
];

export function getToolDefinition(tool: InteractionTool): ToolDefinition {
  for (const section of TOOL_SECTIONS) {
    const matchingTool = section.tools.find((candidate) =>
      candidate.id === tool
    );

    if (matchingTool !== undefined) {
      return matchingTool;
    }
  }

  return TOOL_SECTIONS[0].tools[0];
}
