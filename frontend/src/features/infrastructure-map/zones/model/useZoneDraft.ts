import { useState } from "react";
import type {
  MapImageDimensions,
  MapZone,
  ZoneDraft,
} from "@/features/infrastructure-map/model/types";
import {
  clampZoneBounds,
  createBoundsFromDragPoints,
  createZoneDraft,
  doesZoneOverlap,
  hasMinimumZoneDimensions,
  isZoneIdUnique,
  MIN_ZONE_DIMENSION,
} from "@/features/infrastructure-map/zones/logic/interactiveZones";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";

interface UseZoneDraftOptions {
  availableSectors: string[];
  mapImage: MapImageDimensions;
  zones: MapZone[];
}

interface ZoneDraftState {
  clearPendingZoneDraft: () => void;
  handleZoneDraftDrag: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
  ) => void;
  handleZoneDraftProdschedChange: (prodsched: string) => void;
  handleZoneDraftSave: () => MapZone | null;
  handleZoneDraftSectorChange: (sector: string) => void;
  pendingZoneDraft: ZoneDraft | null;
  pendingZoneDraftError: string | null;
  pendingZoneProdsched: string;
  pendingZoneSector: string;
}

export default function useZoneDraft({
  availableSectors,
  mapImage,
  zones,
}: UseZoneDraftOptions): ZoneDraftState {
  const [pendingZoneDraft, setPendingZoneDraft] = useState<ZoneDraft | null>(
    null,
  );
  const [pendingZoneId, setPendingZoneId] = useState("");
  const [pendingZoneSector, setPendingZoneSector] = useState("");
  const [pendingZoneProdsched, setPendingZoneProdsched] = useState("");
  const [pendingZoneDraftError, setPendingZoneDraftError] = useState<
    string | null
  >(null);

  function clearPendingZoneDraft(): void {
    setPendingZoneDraft(null);
    setPendingZoneId("");
    setPendingZoneSector("");
    setPendingZoneProdsched("");
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
    setPendingZoneId((currentZoneId) =>
      currentZoneId.length > 0 ? currentZoneId : String(nextDraft.suggestedId)
    );
    setPendingZoneSector((currentSector) =>
      currentSector.length > 0 ? currentSector : (availableSectors[0] ?? "")
    );
    setPendingZoneDraftError(null);
  }

  function handleZoneDraftSectorChange(sector: string): void {
    setPendingZoneSector(sector);
  }

  function handleZoneDraftProdschedChange(prodsched: string): void {
    setPendingZoneProdsched(prodsched);
  }

  function handleZoneDraftSave(): MapZone | null {
    if (pendingZoneDraft === null) {
      return null;
    }

    const nextZoneId = Number(pendingZoneId);

    if (!Number.isInteger(nextZoneId) || nextZoneId <= 0) {
      setPendingZoneDraftError(
        "Impossible de generer un identifiant interne valide pour la zone.",
      );
      return null;
    }

    const nextZoneSector = pendingZoneSector.trim();
    const nextZoneProdsched = pendingZoneProdsched.trim();

    if (nextZoneSector.length === 0) {
      setPendingZoneDraftError("Le secteur de zone est obligatoire.");
      return null;
    }

    if (nextZoneProdsched.length === 0) {
      setPendingZoneDraftError("Le prodsched de zone est obligatoire.");
      return null;
    }

    if (!isZoneIdUnique(zones, nextZoneId)) {
      setPendingZoneDraftError(
        "Impossible d'enregistrer la zone car son identifiant interne existe deja.",
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

    clearPendingZoneDraft();

    return {
      id: nextZoneId,
      label: nextZoneProdsched,
      sector: nextZoneSector,
      prodsched: nextZoneProdsched,
      color: getSectorColor(nextZoneSector),
      bounds: nextBounds,
    };
  }

  return {
    clearPendingZoneDraft,
    handleZoneDraftDrag,
    handleZoneDraftProdschedChange,
    handleZoneDraftSave,
    handleZoneDraftSectorChange,
    pendingZoneDraft,
    pendingZoneDraftError,
    pendingZoneProdsched,
    pendingZoneSector,
  };
}
