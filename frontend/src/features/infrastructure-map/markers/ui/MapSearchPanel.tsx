import { useState } from "react";
import type { FormEvent } from "react";
import type {
  InteractiveMarker,
  MapZone,
} from "@/features/infrastructure-map/model/types";
import { searchMarkers } from "@/features/infrastructure-map/markers/logic/markerSearch";
import { MapSearchResultCard } from "@/features/infrastructure-map/markers/ui/map-search/MapSearchResultCard";
import {
  eyebrowTextClassName,
  panelTitleTextClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  surfacePanelClassName,
  textInputClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

const SEARCH_RESULT_LIMIT = 6;
const EMPTY_RESULT_TEXT = "Aucun resultat.";

interface MapSearchPanelProps {
  markers: InteractiveMarker[];
  onSelectMarker: (markerId: string) => void;
  selectedMarkerId: string | null;
  zones: MapZone[];
}

export default function MapSearchPanel({
  markers,
  onSelectMarker,
  selectedMarkerId,
  zones,
}: MapSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const trimmedSearchQuery = searchQuery.trim();
  const searchResults = trimmedSearchQuery.length === 0
    ? []
    : searchMarkers(markers, searchQuery, SEARCH_RESULT_LIMIT);
  const selectedMarker = findSelectedMarker(markers, selectedMarkerId);
  const zonesById = createZoneByIdMap(zones);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (searchResults.length === 0) {
      return;
    }

    handleSearchResultSelection(searchResults[0].marker.id);
  }

  function handleSearchResultSelection(markerId: string): void {
    setSearchQuery(markerId);
    onSelectMarker(markerId);
  }

  function renderSearchResults() {
    if (trimmedSearchQuery.length > 0) {
      if (searchResults.length === 0) {
        return (
          <p className="rounded-[18px] border border-schneider-900/8 bg-schneider-50/78 px-4 py-3 text-sm text-schneider-800/75">
            {EMPTY_RESULT_TEXT}
          </p>
        );
      }

      return (
        <div className="grid gap-2" role="list">
          {searchResults.map(function renderSearchResult(result) {
            const zone = getMarkerZone(result.marker.zoneId, zonesById);

            return (
              <MapSearchResultCard
                key={result.marker.id}
                isSelected={selectedMarkerId === result.marker.id}
                result={result}
                zone={zone}
                onSelect={handleSearchResultSelection}
              />
            );
          })}
        </div>
      );
    }

    if (selectedMarker !== null) {
      return (
        <p className="rounded-[18px] border border-schneider-900/8 bg-schneider-50/78 px-4 py-3 text-sm text-schneider-800/75">
          Selection : <strong>{selectedMarker.id}</strong>
        </p>
      );
    }

    return (
      <p className="rounded-[18px] border border-schneider-900/8 bg-schneider-50/78 px-4 py-3 text-sm text-schneider-800/75">
        {markers.length} poste(s)
      </p>
    );
  }

  return (
    <section className="min-w-0">
      <form
        className={`${surfacePanelClassName} grid gap-4 p-4 sm:p-5`}
        onSubmit={handleSearchSubmit}
      >
        <div className="grid gap-1.5">
          <p className={eyebrowTextClassName}>Recherche</p>
          <h2 className={panelTitleTextClassName}>Trouver un poste</h2>
        </div>

        <div className="grid gap-3 rounded-[18px] border border-schneider-900/8 bg-schneider-50/78 p-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
          <input
            aria-label="Rechercher un equipement"
            autoComplete="off"
            className={textInputClassName}
            placeholder="ID, hostname, IP..."
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button
            className={primaryButtonClassName}
            disabled={searchResults.length === 0}
            type="submit"
          >
            Localiser
          </button>
          <button
            className={secondaryButtonClassName}
            disabled={trimmedSearchQuery.length === 0}
            type="button"
            onClick={() => setSearchQuery("")}
          >
            Effacer
          </button>
        </div>

        {renderSearchResults()}
      </form>
    </section>
  );
}

function findSelectedMarker(
  markers: InteractiveMarker[],
  selectedMarkerId: string | null,
): InteractiveMarker | null {
  if (selectedMarkerId === null) {
    return null;
  }

  return markers.find((marker) => marker.id === selectedMarkerId) ?? null;
}

function createZoneByIdMap(zones: MapZone[]): Map<number, MapZone> {
  return new Map(zones.map((zone) => [zone.id, zone]));
}

function getMarkerZone(
  zoneId: number | null,
  zonesById: Map<number, MapZone>,
): MapZone | null {
  if (zoneId === null) {
    return null;
  }

  return zonesById.get(zoneId) ?? null;
}
