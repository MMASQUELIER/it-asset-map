export interface EquipmentDto {
  equipmentDataId: number;
  id: string;
  x: number;
  y: number;
  zoneId: number | null;
}

export interface CreateEquipmentInput {
  equipmentDataId: number;
  id: string;
  x: number;
  y: number;
  zoneId: number | null;
}

export interface UpdateEquipmentInput {
  x?: number;
  y?: number;
  zoneId?: number | null;
}
