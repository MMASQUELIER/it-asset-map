import { joinClassNames } from "@/features/infrastructure-map/ui/uiClassNames";

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
      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Aucun secteur n&apos;est disponible dans la configuration backend.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" role="list">
      {availableSectors.map((sector) => {
        const isSelected = sector === selectedSector;

        return (
          <button
            key={sector}
            aria-pressed={isSelected}
            className={joinClassNames(
              "rounded-full border px-3 py-2 text-[0.78rem] font-black uppercase tracking-[0.08em] transition",
              "border-schneider-950/10 bg-white text-schneider-800 hover:-translate-y-0.5 hover:border-schneider-500/20 hover:bg-schneider-50",
              isSelected && "border-schneider-500/25 bg-schneider-500 text-schneider-950 shadow-[0_12px_24px_rgba(61,205,88,0.2)]",
            )}
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
