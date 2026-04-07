import { useState } from "react";
import type {
  MapImageDimensions,
  MapZone,
  ZoneDraft,
  ZoneDraftValues,
} from "@/features/infrastructure-map/model/types";
import {
  clampZoneBounds,
  createBoundsFromDragPoints,
  createZoneDraft,
  doesZoneOverlap,
  hasMinimumZoneDimensions,
  MIN_ZONE_DIMENSION,
} from "@/features/infrastructure-map/zones/logic/interactiveZones";

interface UseZoneDraftOptions {
  availableSectorNames: string[];
  mapImage: MapImageDimensions;
  zones: MapZone[];
}

export interface ZoneDraftSubmission extends ZoneDraftValues {
  bounds: ZoneDraft["bounds"];
}

interface ZoneDraftState {
  clearPendingZoneDraft: () => void;
  handleZoneDraftDrag: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ) => void;
  handleZoneDraftCodeChange: (code: string) => void;
  handleZoneDraftNameChange: (name: string) => void;
  handleZoneDraftSave: () => ZoneDraftSubmission | null;
  handleZoneDraftSectorChange: (sectorName: string) => void;
  pendingZoneDraft: ZoneDraft | null;
  pendingZoneDraftError: string | null;
  pendingZoneCode: string;
  pendingZoneName: string;
  pendingZoneSectorName: string;
}

export default function useZoneDraft({
  availableSectorNames,
  mapImage,
  zones,
}: UseZoneDraftOptions): ZoneDraftState {
  const [pendingZoneDraft, setPendingZoneDraft] = useState<ZoneDraft | null>(
    null,
  );
  const [pendingZoneSectorName, setPendingZoneSectorName] = useState("");
  const [pendingZoneCode, setPendingZoneCode] = useState("");
  const [pendingZoneName, setPendingZoneName] = useState("");
  const [pendingZoneDraftError, setPendingZoneDraftError] = useState<
    string | null
  >(null);

  function clearPendingZoneDraft(): void {
    setPendingZoneDraft(null);
    setPendingZoneSectorName("");
    setPendingZoneCode("");
    setPendingZoneName("");
    setPendingZoneDraftError(null);
  }

  function handleZoneDraftDrag(
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ): void {
    const nextBounds = createBoundsFromDragPoints(
      mapImage,
      startX,
      startY,
      currentX,
      currentY,
    );

    if (pendingZoneDraft !== null) {
      setPendingZoneDraft({
        ...pendingZoneDraft,
        bounds: nextBounds,
      });
      setPendingZoneDraftError(null);
      return;
    }

    const nextDraft = createZoneDraft(mapImage, zones, startX, startY);

    setPendingZoneDraft({
      ...nextDraft,
      bounds: nextBounds,
    });
    setPendingZoneSectorName((currentSectorName) =>
      currentSectorName.length > 0
        ? currentSectorName
        : (availableSectorNames[0] ?? "")
    );
    setPendingZoneDraftError(null);
  }

  function handleZoneDraftSectorChange(sectorName: string): void {
    setPendingZoneSectorName(sectorName);
    setPendingZoneDraftError(null);
  }

  function handleZoneDraftCodeChange(code: string): void {
    setPendingZoneCode(code);
    setPendingZoneDraftError(null);
  }

  function handleZoneDraftNameChange(name: string): void {
    setPendingZoneName(name);
    setPendingZoneDraftError(null);
  }

  function handleZoneDraftSave(): ZoneDraftSubmission | null {
    if (pendingZoneDraft === null) {
      return null;
    }

    const nextZoneSectorName = pendingZoneSectorName.trim();
    const nextZoneCode = pendingZoneCode.trim();
    const nextZoneName = pendingZoneName.trim();

    if (nextZoneSectorName.length === 0) {
      setPendingZoneDraftError("Le secteur de zone est obligatoire.");
      return null;
    }

    if (!/^\d{3}$/.test(nextZoneCode)) {
      setPendingZoneDraftError(
        "Le code de zone doit contenir exactement 3 chiffres.",
      );
      return null;
    }

    if (!hasMinimumZoneDimensions(pendingZoneDraft.bounds)) {
      setPendingZoneDraftError(
        `La zone doit faire au moins ${MIN_ZONE_DIMENSION} x ${MIN_ZONE_DIMENSION} pixels.`,
      );
      return null;
    }

    const nextBounds = clampZoneBounds(pendingZoneDraft.bounds, mapImage);

    if (doesZoneOverlap(zones, nextBounds)) {
      setPendingZoneDraftError("La nouvelle zone chevauche une zone existante.");
      return null;
    }

    return {
      bounds: nextBounds,
      code: nextZoneCode,
      name: nextZoneName,
      sectorName: nextZoneSectorName,
    };
  }

  return {
    clearPendingZoneDraft,
    handleZoneDraftDrag,
    handleZoneDraftCodeChange,
    handleZoneDraftNameChange,
    handleZoneDraftSave,
    handleZoneDraftSectorChange,
    pendingZoneDraft,
    pendingZoneDraftError,
    pendingZoneCode,
    pendingZoneName,
    pendingZoneSectorName,
  };
}
