import type { Dispatch, SetStateAction } from "react";
import type { InteractiveMarker, MapZone } from "@/features/infrastructure-map/model/types";
import {
  applyZoneProdschedChange,
  applyZoneSectorChange,
  deleteZoneState,
} from "@/features/infrastructure-map/zones/services/zoneMutations";

interface CreateSelectedZoneMutationHandlersOptions {
  clearHoveredZoneIfMatches: (zoneId: number) => void;
  clearSelectedZone: () => void;
  markers: InteractiveMarker[];
  selectedZone: MapZone | null;
  selectedZoneId: number | null;
  setMarkers: Dispatch<SetStateAction<InteractiveMarker[]>>;
  setZones: Dispatch<SetStateAction<MapZone[]>>;
  zones: MapZone[];
}

export function createSelectedZoneMutationHandlers({
  clearHoveredZoneIfMatches,
  clearSelectedZone,
  markers,
  selectedZone,
  selectedZoneId,
  setMarkers,
  setZones,
  zones,
}: CreateSelectedZoneMutationHandlersOptions) {
  function handleSelectedZoneSectorChange(sector: string): void {
    if (selectedZone === null) {
      return;
    }

    const mutationResult = applyZoneSectorChange(
      zones,
      markers,
      selectedZone,
      sector,
    );

    setZones(mutationResult.zones);
    setMarkers(mutationResult.markers);
  }

  function handleSelectedZoneProdschedChange(prodsched: string): void {
    if (selectedZone === null) {
      return;
    }

    const mutationResult = applyZoneProdschedChange(
      zones,
      markers,
      selectedZone,
      prodsched,
    );

    setZones(mutationResult.zones);
    setMarkers(mutationResult.markers);
  }

  function handleDeleteZone(zoneId: number): void {
    const mutationResult = deleteZoneState(zones, markers, zoneId);

    setZones(mutationResult.zones);
    setMarkers(mutationResult.markers);
    clearHoveredZoneIfMatches(zoneId);

    if (selectedZoneId === zoneId) {
      clearSelectedZone();
    }
  }

  return {
    handleDeleteZone,
    handleSelectedZoneProdschedChange,
    handleSelectedZoneSectorChange,
  };
}
