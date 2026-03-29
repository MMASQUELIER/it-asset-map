/** Props used by the sector picker shared by zone creation and edition. */
interface ZoneSectorSelectorProps {
  availableSectors: string[];
  selectedSector: string;
  onSelectSector: (sector: string) => void;
}

/**
 * Renders the available sectors as quick action buttons.
 *
 * @param props Available sectors and selection callback.
 * @returns Sector picker UI.
 */
export default function ZoneSectorSelector({
  availableSectors,
  selectedSector,
  onSelectSector,
}: ZoneSectorSelectorProps) {
  if (availableSectors.length === 0) {
    return (
      <p className="zone-sector-selector__empty">
        Aucun secteur n&apos;est disponible dans la configuration backend.
      </p>
    );
  }

  return (
    <div className="zone-sector-selector" role="list">
      {availableSectors.map((sector) => {
        const isSelected = sector === selectedSector;

        return (
          <button
            key={sector}
            aria-pressed={isSelected}
            className={`zone-sector-selector__chip${
              isSelected ? " zone-sector-selector__chip--selected" : ""
            }`}
            type="button"
            onClick={() => onSelectSector(sector)}
          >
            {sector}
          </button>
        );
      })}
    </div>
  );
}
