import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { InteractiveMarker } from "@/features/infrastructure-map/model/types";

interface SelectedMarkerState {
  clearSelectedMarker: () => void;
  focusSelectedMarker: (markerId: string) => void;
  selectedMarker: InteractiveMarker | null;
  selectedMarkerFocusToken: number;
  selectedMarkerId: string | null;
  setSelectedMarkerId: Dispatch<SetStateAction<string | null>>;
}

export function useSelectedMarker(
  markers: InteractiveMarker[],
): SelectedMarkerState {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [selectedMarkerFocusToken, setSelectedMarkerFocusToken] = useState(0);
  const selectedMarker = findSelectedMarker(markers, selectedMarkerId);

  function clearSelectedMarker(): void {
    setSelectedMarkerId(null);
  }

  function focusSelectedMarker(markerId: string): void {
    setSelectedMarkerId(markerId);
    setSelectedMarkerFocusToken((currentToken) => currentToken + 1);
  }

  return {
    clearSelectedMarker,
    focusSelectedMarker,
    selectedMarker,
    selectedMarkerFocusToken,
    selectedMarkerId,
    setSelectedMarkerId,
  };
}

function findSelectedMarker(
  markers: InteractiveMarker[],
  selectedMarkerId: string | null,
): InteractiveMarker | null {
  if (selectedMarkerId === null) {
    return null;
  }

  for (const marker of markers) {
    if (marker.id === selectedMarkerId) {
      return marker;
    }
  }

  return null;
}
