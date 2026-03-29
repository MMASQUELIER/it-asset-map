import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import type { InteractiveMarker, MapZone } from "../../shared/types";
import { searchMarkers } from "../logic/markerSearch";

/** Props used by the equipment search panel. */
interface MapSearchPanelProps {
  markers: InteractiveMarker[];
  onSelectMarker: (markerId: string) => void;
  selectedMarkerId: string | null;
  zones: MapZone[];
}

/**
 * Lets the user search for a marker and focus the map on the best match.
 *
 * @param props Markers, zones and selection callbacks.
 * @returns Search panel UI.
 */
export default function MapSearchPanel({
  markers,
  onSelectMarker,
  selectedMarkerId,
  zones,
}: MapSearchPanelProps) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const results = trimmedQuery.length === 0 ? [] : searchMarkers(markers, query);
  const selectedMarker =
    selectedMarkerId === null
      ? null
      : (markers.find((marker) => marker.id === selectedMarkerId) ?? null);
  const zoneById = new Map(zones.map((zone) => [zone.id, zone]));

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (results.length === 0) {
      return;
    }

    handleMarkerSelection(results[0].marker.id);
  }

  function handleMarkerSelection(markerId: string): void {
    setQuery(markerId);
    onSelectMarker(markerId);
  }

  return (
    <section className="map-search">
      <form className="map-search__panel" onSubmit={handleSubmit}>
        <div className="map-search__intro">
          <p className="map-search__eyebrow">Recherche equipement</p>
          <h2 className="map-search__title">Localiser un poste specifique</h2>
          <p className="map-search__description">
            Recherchez par identifiant, hostname, IP, MAC, numero de serie ou
            emplacement.
          </p>
        </div>

        <div className="map-search__controls">
          <input
            aria-label="Rechercher un equipement"
            autoComplete="off"
            className="map-search__input"
            placeholder="Ex. PC-104, FR-IDE-00104-WS01, 10.20.4.12..."
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            className="map-search__button map-search__button--primary"
            disabled={results.length === 0}
            type="submit"
          >
            Localiser
          </button>
          <button
            className="map-search__button map-search__button--secondary"
            disabled={trimmedQuery.length === 0}
            type="button"
            onClick={() => setQuery("")}
          >
            Effacer
          </button>
        </div>

        {trimmedQuery.length > 0 ? (
          <div className="map-search__results" role="list">
            {results.length > 0 ? (
              results.map((result) => {
                const zone =
                  result.marker.zoneId === null
                    ? null
                    : (zoneById.get(result.marker.zoneId) ?? null);
                const hostname = result.marker.technicalDetails.hostname;
                const secondaryLabel =
                  hostname === undefined || hostname === result.marker.id
                    ? result.matchedValue
                    : hostname;
                const zoneStyle =
                  zone === null
                    ? undefined
                    : ({
                        "--map-search-zone-color": zone.color,
                      } as CSSProperties);

                return (
                  <button
                    key={result.marker.id}
                    className={`map-search__result${selectedMarkerId === result.marker.id ? " map-search__result--active" : ""}`}
                    type="button"
                    onClick={() => handleMarkerSelection(result.marker.id)}
                  >
                    <span className="map-search__result-head">
                      <strong className="map-search__result-id">{result.marker.id}</strong>
                      <span
                        className="map-search__result-zone"
                        style={zoneStyle}
                      >
                        {zone === null ? "Hors zone" : `Zone ${zone.id}`}
                      </span>
                    </span>
                    <span className="map-search__result-meta">{secondaryLabel}</span>
                    <span className="map-search__result-match">
                      {result.matchedFieldLabel} : {result.matchedValue}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="map-search__empty">
                Aucun equipement correspondant a cette recherche.
              </p>
            )}
          </div>
        ) : selectedMarker !== null ? (
          <p className="map-search__hint">
            Equipement selectionne : <strong>{selectedMarker.id}</strong>
          </p>
        ) : (
          <p className="map-search__hint">
            Saisissez un critere puis validez pour centrer la carte sur le
            premier resultat.
          </p>
        )}
      </form>
    </section>
  );
}
