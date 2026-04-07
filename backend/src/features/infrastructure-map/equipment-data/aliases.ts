import type { EquipmentDataDto } from "@/features/infrastructure-map/equipment-data/types.ts";

type EquipmentLocationFields = Pick<EquipmentDataDto, "floorLocation" | "sector">;
type EquipmentConnectionFields = Pick<
  EquipmentDataDto,
  "connectionType" | "wifiOrWiredConnection"
>;
type EquipmentCommentFields = Pick<EquipmentDataDto, "comment" | "secondaryComment">;
type EquipmentStatusFields = Pick<EquipmentDataDto, "securityStatus" | "status">;

export function getResolvedEquipmentLocation(
  equipmentData: EquipmentLocationFields,
): string | undefined {
  return getFirstVisibleText(equipmentData.floorLocation, equipmentData.sector);
}

export function getResolvedEquipmentConnectionMode(
  equipmentData: EquipmentConnectionFields,
): string | undefined {
  return getFirstVisibleText(
    equipmentData.wifiOrWiredConnection,
    equipmentData.connectionType,
  );
}

export function getResolvedEquipmentComment(
  equipmentData: EquipmentCommentFields,
): string | undefined {
  return getFirstVisibleText(
    equipmentData.secondaryComment,
    equipmentData.comment,
  );
}

export function getResolvedEquipmentStatus(
  equipmentData: EquipmentStatusFields,
): string | undefined {
  return getFirstVisibleText(equipmentData.status, equipmentData.securityStatus);
}

export function normalizeEquipmentDataAliases(
  equipmentData: EquipmentDataDto,
): EquipmentDataDto {
  const resolvedLocation = getResolvedEquipmentLocation(equipmentData);
  const resolvedConnectionMode = getResolvedEquipmentConnectionMode(equipmentData);
  const resolvedComment = getResolvedEquipmentComment(equipmentData);
  const resolvedStatus = getResolvedEquipmentStatus(equipmentData);

  return {
    ...equipmentData,
    comment: equipmentData.comment ?? resolvedComment,
    connectionType: equipmentData.connectionType ?? resolvedConnectionMode,
    floorLocation: equipmentData.floorLocation ?? resolvedLocation,
    secondaryComment: equipmentData.secondaryComment ?? resolvedComment,
    securityStatus: equipmentData.securityStatus ?? resolvedStatus,
    sector: equipmentData.sector ?? resolvedLocation,
    status: equipmentData.status ?? resolvedStatus,
    wifiOrWiredConnection: equipmentData.wifiOrWiredConnection ?? resolvedConnectionMode,
  };
}

function getFirstVisibleText(
  ...values: Array<string | undefined>
): string | undefined {
  for (const value of values) {
    const visibleText = getVisibleText(value);

    if (visibleText !== undefined) {
      return visibleText;
    }
  }

  return undefined;
}

function getVisibleText(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length === 0 ? undefined : trimmedValue;
}
