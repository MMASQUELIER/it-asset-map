import type { PcTechnicalDetails } from "@/features/infrastructure-map/model/types/pc";

export interface SectorRecord {
  color: string;
  id: number;
  name: string;
}

export interface ZoneRecord {
  code: string;
  id: number;
  name?: string;
  sectorId: number;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}

export interface EquipmentRecord {
  equipmentDataId: number;
  id: string;
  x: number;
  y: number;
  zoneId: number | null;
}

export interface EquipmentDataRecord extends Omit<PcTechnicalDetails, "catalogIssues"> {
  id: number;
}
