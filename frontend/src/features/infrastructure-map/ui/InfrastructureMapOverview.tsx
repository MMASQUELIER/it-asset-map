import {
  eyebrowTextClassName,
  infoBadgeClassName,
  joinClassNames,
} from "@/features/infrastructure-map/ui/uiClassNames";

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
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 border-b border-schneider-900/8 p-4 sm:p-5 lg:p-6">
      <div className="grid gap-1">
        <p className={eyebrowTextClassName}>Carte</p>
        <h1 className="m-0 text-[1.35rem] font-semibold tracking-[-0.03em] text-schneider-950">
          Plan atelier
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={infoBadgeClassName}>{markerCount} postes</span>
        <span className={infoBadgeClassName}>{zoneCount} zones</span>
        <span
          className={joinClassNames(
            infoBadgeClassName,
            isInteractionMode
              ? "border-schneider-500/18 bg-schneider-500/10 text-schneider-700"
              : "text-schneider-800/72",
          )}
        >
          {isInteractionMode ? "Edition" : "Consultation"}
        </span>
      </div>
    </section>
  );
}
