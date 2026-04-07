export interface ZoneDto {
  code: string;
  id: number;
  name?: string;
  sectorId: number;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}

export interface CreateZoneInput {
  code: string;
  name?: string;
  sectorId: number;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}

export interface UpdateZoneInput {
  code?: string;
  name?: string | null;
  sectorId?: number;
  xMax?: number;
  xMin?: number;
  yMax?: number;
  yMin?: number;
}
