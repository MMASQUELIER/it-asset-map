export interface PcPoint {
  id: number;
  nom: string;
  description: string;
  zoneCode: string;
  x: number;
  y: number;
}

export interface ZoneData {
  id: number;
  code: string;
  nom: string;
  couleur: string;
  position: [number, number, number, number];
  pcs?: PcPoint[];
}

export type ZoneColor = "green" | "blue" | "yellow" | "red" | "purple";

export interface ZoneStyle {
  stroke: string;
  fill: string;
  label: string;
  ring: string;
}
