import { useState } from "react";
import type { MapZone } from "@/features/infrastructure-map/model/types";

interface ZoneSelectionState {
  clearSelectedZone: () => void;
  selectZone: (zoneId: number | null) => void;
  selectedZone: MapZone | null;
  selectedZoneId: number | null;
  toggleZoneSelection: (zoneId: number) => void;
}

export default function useZoneSelection(zones: MapZone[]): ZoneSelectionState {
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? null;

  function clearSelectedZone(): void {
    setSelectedZoneId(null);
  }

  function selectZone(zoneId: number | null): void {
    setSelectedZoneId(zoneId);
  }

  function toggleZoneSelection(zoneId: number): void {
    setSelectedZoneId((currentZoneId) =>
      currentZoneId === zoneId ? null : zoneId
    );
  }

  return {
    clearSelectedZone,
    selectZone,
    selectedZone,
    selectedZoneId,
    toggleZoneSelection,
  };
}
