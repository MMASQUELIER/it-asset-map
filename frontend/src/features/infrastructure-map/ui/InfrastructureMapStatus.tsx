import {
  eyebrowTextClassName,
  infoBadgeClassName,
  mapCardClassName,
  panelDescriptionTextClassName,
  panelTitleTextClassName,
  surfacePanelClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

interface InfrastructureMapStatusProps {
  message: string;
  title: string;
}

/**
 * Affiche un etat de chargement ou d'indisponibilite pour la feature carte.
 */
export function InfrastructureMapStatus({
  message,
  title,
}: InfrastructureMapStatusProps) {
  return (
    <section className={mapCardClassName}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,_rgba(61,205,88,0.22),transparent_38%)]" />
      <div className="relative p-4 sm:p-5 lg:p-6">
        <div className={`${surfacePanelClassName} grid gap-3 p-5 sm:p-6`}>
          <span className={infoBadgeClassName}>Infrastructure map</span>
          <p className={eyebrowTextClassName}>{title}</p>
          <h2 className={panelTitleTextClassName}>Poste de supervision</h2>
          <p className={panelDescriptionTextClassName}>{message}</p>
        </div>
      </div>
    </section>
  );
}
