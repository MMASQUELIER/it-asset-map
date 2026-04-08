import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
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
  const hasSearchQuery = trimmedSearchQuery.length > 0;
  const searchResults = !hasSearchQuery
    ? []
    : searchMarkers(markers, searchQuery, SEARCH_RESULT_LIMIT);
  const selectedMarker = selectedMarkerId === null
    ? null
    : (markers.find((marker) => marker.id === selectedMarkerId) ?? null);
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

        <MapSearchPanelResults
          hasSearchQuery={hasSearchQuery}
          markerCount={markers.length}
          searchResults={searchResults}
          selectedMarker={selectedMarker}
          selectedMarkerId={selectedMarkerId}
          zonesById={zonesById}
          onSelect={handleSearchResultSelection}
        />
      </form>
    </section>
  );
}

function createZoneByIdMap(zones: MapZone[]): Map<number, MapZone> {
  return new Map(zones.map((zone) => [zone.id, zone]));
}

interface MapSearchPanelResultsProps {
  hasSearchQuery: boolean;
  markerCount: number;
  onSelect: (markerId: string) => void;
  searchResults: ReturnType<typeof searchMarkers>;
  selectedMarker: InteractiveMarker | null;
  selectedMarkerId: string | null;
  zonesById: Map<number, MapZone>;
}

function MapSearchPanelResults({
  hasSearchQuery,
  markerCount,
  onSelect,
  searchResults,
  selectedMarker,
  selectedMarkerId,
  zonesById,
}: MapSearchPanelResultsProps) {
  if (!hasSearchQuery) {
    return selectedMarker === null
      ? <PanelInfoMessage>{markerCount} poste(s)</PanelInfoMessage>
      : (
        <PanelInfoMessage>
          Selection : <strong>{selectedMarker.id}</strong>
        </PanelInfoMessage>
      );
  }

  if (searchResults.length === 0) {
    return <PanelInfoMessage>{EMPTY_RESULT_TEXT}</PanelInfoMessage>;
  }

  return (
    <div className="grid gap-2" role="list">
      {searchResults.map((result) => (
        <MapSearchResultCard
          key={result.marker.id}
          isSelected={selectedMarkerId === result.marker.id}
          result={result}
          zone={result.marker.zoneId === null
            ? null
            : (zonesById.get(result.marker.zoneId) ?? null)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

interface PanelInfoMessageProps {
  children: ReactNode;
}

function PanelInfoMessage({ children }: PanelInfoMessageProps) {
  return (
    <p className="rounded-[18px] border border-schneider-900/8 bg-schneider-50/78 px-4 py-3 text-sm text-schneider-800/75">
      {children}
    </p>
  );
}
