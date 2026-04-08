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
  markerId: string;
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
  pendingMarkerId: string;
  setPendingMarkerId: (value: string) => void;
}

export default function useMarkerDraft({
  markers,
  placementCandidates,
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
  const availablePlacementCandidates = getAvailablePlacementCandidates(
    placementCandidates,
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

  function handleMarkerDraftSave(): MarkerDraftSubmission | null {
    if (pendingMarkerDraft === null) {
      return null;
    }

    const nextCandidateId = pendingMarkerId.trim();

    if (nextCandidateId.length === 0) {
      setPendingMarkerDraftError(
        "La selection d'un PC du catalogue est obligatoire.",
      );
      return null;
    }

    const selectedPlacementCandidate =
      availablePlacementCandidates.find((candidate) =>
        candidate.id === nextCandidateId
      ) ?? null;

    if (selectedPlacementCandidate === null) {
      setPendingMarkerDraftError(
        "Le PC selectionne n'existe pas dans le catalogue charge.",
      );
      return null;
    }

    if (!isMarkerIdUnique(markers, nextCandidateId)) {
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
      markerId: nextCandidateId,
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
    pendingMarkerId,
    setPendingMarkerId(value: string) {
      setPendingMarkerId(value);
      setPendingMarkerDraftError(null);
    },
  };
}

function getPendingMarkerZone(
  pendingMarkerDraft: MarkerDraft | null,
  zones: MapZone[],
): MapZone | null {
  if (pendingMarkerDraft?.zoneId === null || pendingMarkerDraft?.zoneId === undefined) {
    return null;
  }

  return zones.find((zone) => zone.id === pendingMarkerDraft.zoneId) ?? null;
}
