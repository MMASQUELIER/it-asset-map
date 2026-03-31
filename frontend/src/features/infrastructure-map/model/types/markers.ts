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

export interface PlacementPcCandidate {
  id: string;
  markerId: string;
  hostname?: string;
  label: string;
  prodsched: string;
  sector: string;
  stationName: string;
  technicalDetails: PcTechnicalDetails;
}

export interface InfrastructureCatalog {
  availableSectors: string[];
  placementPcCandidates: PlacementPcCandidate[];
}
