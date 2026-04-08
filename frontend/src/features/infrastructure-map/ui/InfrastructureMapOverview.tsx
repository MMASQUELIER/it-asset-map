import {
  eyebrowTextClassName,
  infoBadgeClassName,
  joinClassNames,
} from "@/features/infrastructure-map/ui/uiClassNames";

const MAP_TITLE = "Plan atelier";

interface InfrastructureMapOverviewProps {
  isInteractionMode: boolean;
  markerCount: number;
  zoneCount: number;
}

export function InfrastructureMapOverview({
  isInteractionMode,
  markerCount,
  zoneCount,
}: InfrastructureMapOverviewProps) {
  const modeLabel = isInteractionMode ? "Edition" : "Consultation";
  const modeBadgeClassName = joinClassNames(
    infoBadgeClassName,
    isInteractionMode
      ? "border-schneider-500/18 bg-schneider-500/10 text-schneider-700"
      : "text-schneider-800/72",
  );

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 border-b border-schneider-900/8 p-4 sm:p-5 lg:p-6">
      <div className="grid gap-1">
        <p className={eyebrowTextClassName}>Carte</p>
        <h1 className="m-0 text-[1.35rem] font-semibold tracking-[-0.03em] text-schneider-950">
          {MAP_TITLE}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={infoBadgeClassName}>{markerCount} postes</span>
        <span className={infoBadgeClassName}>{zoneCount} zones</span>
        <span className={modeBadgeClassName}>{modeLabel}</span>
      </div>
    </section>
  );
}
