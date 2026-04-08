import type { MapPc, PcTechnicalDetails } from "@/features/infrastructure-map/model/types/pc";

export interface InteractiveMarker extends MapPc {
  zoneId: number | null;
}

export interface MarkerDraft {
  x: number;
  y: number;
  zoneId: number | null;
  suggestedId: string;
}

export interface PlacementCandidate {
  id: string;
  equipmentDataId: number;
  hostname?: string;
  label: string;
  prodsheet?: string;
  sector: string;
  stationName: string;
  technicalDetails: PcTechnicalDetails;
}
