import type { CSSProperties } from "react";
import type { MapZone } from "../../shared/types";
import { getSectorColor } from "../logic/zoneAppearance";
import ZoneSectorSelector from "./ZoneSectorSelector";

/** Props used by the quick editor shown for the currently selected zone. */
interface SelectedZonePanelProps {
  availableSectors: string[];
  onClose: () => void;
  onProdschedChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  zone: MapZone;
}

/**
 * Displays a lightweight editor for the currently selected zone.
 *
 * @param props Selected zone and update callbacks.
 * @returns Quick zone editor UI.
 */
export default function SelectedZonePanel({
  availableSectors,
  onClose,
  onProdschedChange,
  onSectorChange,
  zone,
}: SelectedZonePanelProps) {
  const sectorColor = getSectorColor(zone.sector);

  return (
    <aside className="marker-draft-card zone-editor-panel">
      <div className="marker-draft-card__header">
        <div>
          <p className="marker-draft-card__eyebrow">Zone selectionnee</p>
          <h2 className="marker-draft-card__title">Edition rapide</h2>
          <p className="zone-form__intro">
            Changez le secteur ou le prodsched, puis ajustez les coins
            directement sur la carte si besoin.
          </p>
        </div>

        <button
          className="marker-draft-card__close"
          type="button"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>

      <label className="marker-draft-card__field">
        <span>Secteur</span>
        <ZoneSectorSelector
          availableSectors={availableSectors}
          onSelectSector={onSectorChange}
          selectedSector={zone.sector}
        />
      </label>

      <label className="marker-draft-card__field">
        <span>Prodsched</span>
        <input
          autoFocus
          className="marker-draft-card__input"
          inputMode="numeric"
          placeholder="Ex. 250"
          type="text"
          value={zone.prodsched}
          onChange={(event) => onProdschedChange(event.target.value)}
        />
      </label>

      <div className="marker-draft-card__details">
        <div>
          <span className="marker-draft-card__detail-label">Position</span>
          <strong>
            X {zone.bounds.x} / Y {zone.bounds.y}
          </strong>
        </div>

        <div>
          <span className="marker-draft-card__detail-label">Dimensions</span>
          <strong>
            {zone.bounds.width} x {zone.bounds.height}
          </strong>
        </div>

        <div>
          <span className="marker-draft-card__detail-label">
            Couleur secteur
          </span>
          <strong
            className="zone-draft-form__sector-color"
            style={{ "--zone-sector-color": sectorColor } as CSSProperties}
          >
            {zone.sector}
          </strong>
        </div>
      </div>
    </aside>
  );
}
