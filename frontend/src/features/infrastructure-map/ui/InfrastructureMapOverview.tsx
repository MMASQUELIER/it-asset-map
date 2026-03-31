import {
  eyebrowTextClassName,
  executivePanelClassName,
  joinClassNames,
  metricRailClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

interface InfrastructureMapOverviewProps {
  availableSectorCount: number;
  isInteractionMode: boolean;
  markerCount: number;
  selectedMarkerId: string | null;
  zoneCount: number;
}

export function InfrastructureMapOverview({
  availableSectorCount,
  isInteractionMode,
  markerCount,
  selectedMarkerId,
  zoneCount,
}: InfrastructureMapOverviewProps) {
  const interactionModeLabel = isInteractionMode
    ? "Mode edition actif"
    : "Mode consultation";
  const focusLabel = selectedMarkerId === null
    ? "Aucun poste cible"
    : `Poste cible : ${selectedMarkerId}`;
  const overviewSignals = [
    { label: "Catalogue", value: "Backend synchronise" },
    { label: "Layout", value: "Persistance active" },
    { label: "Focus", value: focusLabel },
  ];

  return (
    <section className="grid gap-5 p-4 pb-0 sm:p-5 sm:pb-0 lg:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.72fr)] lg:p-6 lg:pb-0">
      <div className={`${executivePanelClassName} relative overflow-hidden p-6 sm:p-7`}>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%),linear-gradient(90deg,transparent_0,transparent_58%,rgba(255,255,255,0.08)_58%,rgba(255,255,255,0.08)_58.3%,transparent_58.3%)]" />
        <div className="relative grid gap-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid max-w-3xl gap-3">
              <p className="m-0 text-[0.72rem] font-black uppercase tracking-[0.2em] text-schneider-300">
                Schneider Electric
              </p>
              <h1 className="m-0 text-[clamp(1.85rem,2.4vw,3rem)] font-black leading-[1.02] tracking-[-0.04em] text-white">
                Pilotage visuel des zones et des equipements
              </h1>
              <p className="m-0 max-w-3xl text-sm leading-7 text-white/76 sm:text-[0.98rem]">
                Retrouvez rapidement les postes du catalogue backend, pilotez
                les zones de production et gardez un plan propre, lisible et
                synchronise avec le layout persiste.
              </p>
            </div>

            <span
              className={joinClassNames(
                "inline-flex items-center rounded-full border px-3.5 py-1.5 text-[0.76rem] font-black uppercase tracking-[0.14em]",
                isInteractionMode
                  ? "border-schneider-400/35 bg-schneider-400/16 text-schneider-100"
                  : "border-white/14 bg-white/8 text-white/88",
              )}
            >
              {interactionModeLabel}
            </span>
          </div>

          <dl className="grid overflow-hidden rounded-[26px] border border-white/10 bg-white/6 sm:grid-cols-3">
            {overviewSignals.map((signal) => (
              <div
                key={signal.label}
                className="grid gap-1 border-b border-white/10 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <dt className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-schneider-300/90">
                  {signal.label}
                </dt>
                <dd className="m-0 text-sm font-semibold leading-6 text-white/90">
                  {signal.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={`${metricRailClassName} grid overflow-hidden`}>
        <OverviewMetricRow
          isEmphasized
          label="Equipements places"
          value={markerCount}
        />
        <OverviewMetricRow label="Zones actives" value={zoneCount} />
        <OverviewMetricRow
          label="Secteurs disponibles"
          value={availableSectorCount}
        />
      </div>
    </section>
  );
}

interface OverviewMetricRowProps {
  isEmphasized?: boolean;
  label: string;
  value: number;
}

function OverviewMetricRow({
  isEmphasized = false,
  label,
  value,
}: OverviewMetricRowProps) {
  return (
    <article className="grid gap-2 border-b border-schneider-900/8 px-5 py-5 last:border-b-0">
      <span
        className={joinClassNames(
          eyebrowTextClassName,
          isEmphasized && "text-schneider-700",
        )}
      >
        {label}
      </span>
      <strong
        className={joinClassNames(
          "text-[2rem] font-black tracking-[-0.05em] text-schneider-950",
          isEmphasized && "text-schneider-800",
        )}
      >
        {value}
      </strong>
    </article>
  );
}
