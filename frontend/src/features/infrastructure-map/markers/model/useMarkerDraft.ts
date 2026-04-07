import { useState } from "react";
import type {
  InteractiveMarker,
  MapZone,
  MarkerDraft,
  PlacementCandidate,
  PcTechnicalDetails,
} from "@/features/infrastructure-map/model/types";
import {
  createMarkerDraft,
  isMarkerIdUnique,
} from "@/features/infrastructure-map/markers/logic/interactiveMarkers";
import { getAvailablePlacementCandidates } from "@/features/infrastructure-map/markers/services/markerAssignments";
import { doesPlacementCandidateMatchSector } from "@/features/infrastructure-map/markers/services/placementCandidateSearch";
import { syncPcTechnicalDetailsWithZone } from "@/features/infrastructure-map/pc-details/logic/pcTechnicalDetails";

interface UseMarkerDraftOptions {
  markers: InteractiveMarker[];
  placementCandidates: PlacementCandidate[];
  zones: MapZone[];
}

export interface MarkerDraftSubmission {
  equipmentDataId: number;
  equipmentId: string;
  technicalDetails: PcTechnicalDetails;
  x: number;
  y: number;
  zoneId: number | null;
}

interface MarkerDraftState {
  availablePlacementCandidates: PlacementCandidate[];
  clearPendingMarkerDraft: () => void;
  handleMarkerDraftSave: () => MarkerDraftSubmission | null;
  handleMarkerPlacement: (x: number, y: number) => void;
  pendingMarkerDraft: MarkerDraft | null;
  pendingMarkerDraftError: string | null;
  pendingEquipmentId: string;
  setPendingEquipmentId: (value: string) => void;
}

export default function useMarkerDraft({
  markers,
  placementCandidates,
  zones,
}: UseMarkerDraftOptions): MarkerDraftState {
  const [pendingMarkerDraft, setPendingMarkerDraft] = useState<
    MarkerDraft | null
  >(null);
  const [pendingEquipmentId, setPendingEquipmentId] = useState("");
  const [pendingMarkerDraftError, setPendingMarkerDraftError] = useState<
    string | null
  >(null);
  const pendingMarkerZone = getPendingMarkerZone(pendingMarkerDraft, zones);
  const availablePlacementCandidates = getAvailablePlacementCandidates(
    placementCandidates,
    markers,
    pendingMarkerZone,
  );

  function clearPendingMarkerDraft(): void {
    setPendingMarkerDraft(null);
    setPendingEquipmentId("");
    setPendingMarkerDraftError(null);
  }

  function handleMarkerPlacement(x: number, y: number): void {
    const nextDraft = createMarkerDraft(zones, markers, x, y);

    setPendingMarkerDraft(nextDraft);
    setPendingEquipmentId("");
    setPendingMarkerDraftError(null);
  }

  function handleMarkerDraftSave(): MarkerDraftSubmission | null {
    if (pendingMarkerDraft === null) {
      return null;
    }

    const nextEquipmentId = pendingEquipmentId.trim();

    if (nextEquipmentId.length === 0) {
      setPendingMarkerDraftError(
        "La selection d'un PC du catalogue est obligatoire.",
      );
      return null;
    }

    const selectedPlacementCandidate =
      availablePlacementCandidates.find((candidate) =>
        candidate.equipmentId === nextEquipmentId
      ) ?? null;

    if (selectedPlacementCandidate === null) {
      setPendingMarkerDraftError(
        "Le PC selectionne n'existe pas dans le catalogue charge.",
      );
      return null;
    }

    if (!isMarkerIdUnique(markers, nextEquipmentId)) {
      setPendingMarkerDraftError("Ce PC est deja place sur la carte.");
      return null;
    }

    if (
      pendingMarkerZone !== null &&
      !doesPlacementCandidateMatchSector(
        selectedPlacementCandidate,
        pendingMarkerZone.sectorName,
      )
    ) {
      setPendingMarkerDraftError(
        "Ce PC n'appartient pas au secteur de la zone selectionnee.",
      );
      return null;
    }

    return {
      equipmentDataId: selectedPlacementCandidate.equipmentDataId,
      equipmentId: nextEquipmentId,
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
    availablePlacementCandidates,
    clearPendingMarkerDraft,
    handleMarkerDraftSave,
    handleMarkerPlacement,
    pendingMarkerDraft,
    pendingMarkerDraftError,
    pendingEquipmentId,
    setPendingEquipmentId(value: string) {
      setPendingEquipmentId(value);
      setPendingMarkerDraftError(null);
    },
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
