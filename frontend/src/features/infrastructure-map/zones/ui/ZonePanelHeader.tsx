import {
  closeButtonClassName,
  eyebrowTextClassName,
  panelDescriptionTextClassName,
  panelTitleTextClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

interface ZonePanelHeaderProps {
  description: string;
  onClose: () => void;
  title: string;
}

export function ZonePanelHeader({
  description,
  onClose,
  title,
}: ZonePanelHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={eyebrowTextClassName}>Zone</p>
        <h2 className={panelTitleTextClassName}>{title}</h2>
        <p className={panelDescriptionTextClassName}>{description}</p>
      </div>

      <button className={closeButtonClassName} type="button" onClick={onClose}>
        Fermer
      </button>
    </div>
  );
}
