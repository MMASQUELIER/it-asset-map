import { useState } from "react";
import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  PlacementPcCandidate,
} from "@/features/infrastructure-map/model/types";
import {
  createMarkerDraft,
  isMarkerIdUnique,
} from "@/features/infrastructure-map/markers/logic/interactiveMarkers";
import { getAvailablePlacementPcCandidates } from "@/features/infrastructure-map/markers/services/markerAssignments";
import { doesPlacementCandidateMatchSector } from "@/features/infrastructure-map/markers/services/placementCandidateSearch";
import { syncPcTechnicalDetailsWithZone } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";

interface UseMarkerDraftOptions {
  markers: InteractiveMarker[];
  placementPcCandidates: PlacementPcCandidate[];
  zones: MapZone[];
}

interface MarkerDraftState {
  availablePlacementPcCandidates: PlacementPcCandidate[];
  clearPendingMarkerDraft: () => void;
  handleMarkerDraftSave: () => InteractiveMarker | null;
  handleMarkerPlacement: (x: number, y: number) => void;
  pendingMarkerDraft: MarkerDraft | null;
  pendingMarkerDraftError: string | null;
  pendingMarkerId: string;
  setPendingMarkerId: (value: string) => void;
}

export default function useMarkerDraft({
  markers,
  placementPcCandidates,
  zones,
}: UseMarkerDraftOptions): MarkerDraftState {
  const [pendingMarkerDraft, setPendingMarkerDraft] = useState<
    MarkerDraft | null
  >(null);
  const [pendingMarkerId, setPendingMarkerId] = useState("");
  const [pendingMarkerDraftError, setPendingMarkerDraftError] = useState<
    string | null
  >(null);
  const pendingMarkerZone = getPendingMarkerZone(pendingMarkerDraft, zones);
  const availablePlacementPcCandidates = getAvailablePlacementPcCandidates(
    placementPcCandidates,
    markers,
    pendingMarkerZone,
  );

  function clearPendingMarkerDraft(): void {
    setPendingMarkerDraft(null);
    setPendingMarkerId("");
    setPendingMarkerDraftError(null);
  }

  function handleMarkerPlacement(x: number, y: number): void {
    const nextDraft = createMarkerDraft(zones, markers, x, y);

    setPendingMarkerDraft(nextDraft);
    setPendingMarkerId("");
    setPendingMarkerDraftError(null);
  }

  function handleMarkerDraftSave(): InteractiveMarker | null {
    if (pendingMarkerDraft === null) {
      return null;
    }

    const nextMarkerId = pendingMarkerId.trim();

    if (nextMarkerId.length === 0) {
      setPendingMarkerDraftError(
        "La selection d'un PC du catalogue est obligatoire.",
      );
      return null;
    }

    const selectedPlacementCandidate =
      availablePlacementPcCandidates.find((candidate) =>
        candidate.markerId === nextMarkerId
      ) ?? null;

    if (selectedPlacementCandidate === null) {
      setPendingMarkerDraftError(
        "Le PC selectionne n'existe pas dans le catalogue charge.",
      );
      return null;
    }

    if (!isMarkerIdUnique(markers, nextMarkerId)) {
      setPendingMarkerDraftError("Ce PC est deja place sur la carte.");
      return null;
    }

    if (
      pendingMarkerZone !== null &&
      !doesPlacementCandidateMatchSector(
        selectedPlacementCandidate,
        pendingMarkerZone.sector,
      )
    ) {
      setPendingMarkerDraftError(
        "Ce PC n'appartient pas au secteur de la zone selectionnee.",
      );
      return null;
    }

    clearPendingMarkerDraft();

    return {
      id: nextMarkerId,
      sourceRowNumber: selectedPlacementCandidate.sourceRowNumber,
      x: pendingMarkerDraft.x,
      y: pendingMarkerDraft.y,
      technicalDetails: syncPcTechnicalDetailsWithZone(
        selectedPlacementCandidate.technicalDetails,
        pendingMarkerZone,
      ),
      zoneId: pendingMarkerDraft.zoneId,
    };
  }

  return {
    availablePlacementPcCandidates,
    clearPendingMarkerDraft,
    handleMarkerDraftSave,
    handleMarkerPlacement,
    pendingMarkerDraft,
    pendingMarkerDraftError,
    pendingMarkerId,
    setPendingMarkerId,
  };
}

/**
 * Retrouve la zone cible du draft de marqueur si le draft est rattache a une
 * zone existante.
 */
function getPendingMarkerZone(
  pendingMarkerDraft: MarkerDraft | null,
  zones: MapZone[],
): MapZone | null {
  if (pendingMarkerDraft?.zoneId === null || pendingMarkerDraft?.zoneId === undefined) {
    return null;
  }

  return zones.find((zone) => zone.id === pendingMarkerDraft.zoneId) ?? null;
}
