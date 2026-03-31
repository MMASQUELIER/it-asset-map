import type { CSSProperties } from "react";
import type { MapZone } from "@/features/infrastructure-map/model/types";
import {
  closeButtonClassName,
  detailLabelTextClassName,
  detailsGridClassName,
  eyebrowTextClassName,
  fieldGroupClassName,
  panelDescriptionTextClassName,
  panelTitleTextClassName,
  scrollableFloatingPanelClassName,
  textInputClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";
import { getSectorColor } from "@/features/infrastructure-map/zones/logic/zoneAppearance";
import ZoneSectorSelector from "@/features/infrastructure-map/zones/ui/ZoneSectorSelector";

/** Props du panneau d'edition rapide de la zone selectionnee. */
interface SelectedZonePanelProps {
  availableSectors: string[];
  onClose: () => void;
  onProdschedChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  zone: MapZone;
}

/** Affiche un editeur compact pour la zone actuellement selectionnee. */
export default function SelectedZonePanel({
  availableSectors,
  onClose,
  onProdschedChange,
  onSectorChange,
  zone,
}: SelectedZonePanelProps) {
  return (
    <aside className={`${scrollableFloatingPanelClassName} grid gap-4`}>
      {renderSelectedZoneHeader(onClose)}

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Secteur</span>
        <ZoneSectorSelector
          availableSectors={availableSectors}
          onSelectSector={onSectorChange}
          selectedSector={zone.sector}
        />
      </label>

      <label className={fieldGroupClassName}>
        <span className="text-sm font-bold text-schneider-900">Prodsched</span>
        <input
          autoFocus
          className={textInputClassName}
          inputMode="numeric"
          placeholder="Ex. 250"
          type="text"
          value={zone.prodsched}
          onChange={(event) => onProdschedChange(event.target.value)}
        />
      </label>

      <div className={detailsGridClassName}>
        <div>
          <span className={detailLabelTextClassName}>Position</span>
          <strong>
            X {zone.bounds.x} / Y {zone.bounds.y}
          </strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Dimensions</span>
          <strong>
            {zone.bounds.width} x {zone.bounds.height}
          </strong>
        </div>

        <div>
          <span className={detailLabelTextClassName}>Couleur secteur</span>
          {renderSelectedZoneBadge(zone.sector)}
        </div>
      </div>
    </aside>
  );
}

function renderSelectedZoneHeader(onClose: () => void) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={eyebrowTextClassName}>Zone selectionnee</p>
        <h2 className={panelTitleTextClassName}>Edition rapide</h2>
        <p className={panelDescriptionTextClassName}>
          Changez le secteur ou le prodsched, puis ajustez les coins
          directement sur la carte si besoin.
        </p>
      </div>

      <button className={closeButtonClassName} type="button" onClick={onClose}>
        Fermer
      </button>
    </div>
  );
}

function renderSelectedZoneBadge(zoneSector: string) {
  return (
    <strong
      className="inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-bold text-schneider-900"
      style={getSelectedZoneBadgeStyle(zoneSector)}
    >
      {zoneSector}
    </strong>
  );
}

function getSelectedZoneBadgeStyle(zoneSector: string): CSSProperties {
  const sectorAccentColor = getSectorColor(zoneSector);

  return {
    borderColor: `color-mix(in srgb, ${sectorAccentColor} 40%, rgba(16,38,26,0.1))`,
    background: `color-mix(in srgb, ${sectorAccentColor} 18%, white)`,
  } as CSSProperties;
}
