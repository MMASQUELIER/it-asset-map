import type { VisiblePcDetailField } from "@/features/infrastructure-map/pc-details/ui/content/types";
import { PcDetailFieldCard } from "@/features/infrastructure-map/pc-details/ui/components/PcDetailFieldCard";

interface PcDetailsSectionProps {
  copiedFieldId: string | null;
  forceOpen?: boolean;
  items: VisiblePcDetailField[];
  onCopy: (field: VisiblePcDetailField) => void;
  startOpen?: boolean;
  title: string;
}

export function PcDetailsSection({
  copiedFieldId,
  forceOpen = false,
  items,
  onCopy,
  startOpen = false,
  title,
}: PcDetailsSectionProps) {
  if (items.length === 0) {
    return null;
  }

  const itemCountLabel = `${items.length} champ${items.length > 1 ? "s" : ""}`;

  return (
    <details
      className="group rounded-[26px] border border-schneider-950/10 bg-schneider-50/65 p-4 md:p-5"
      open={forceOpen || undefined}
      {...(!forceOpen ? { defaultOpen: startOpen } : {})}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <div className="grid gap-1">
          <h3 className="m-0 text-[0.82rem] font-black uppercase tracking-[0.14em] text-schneider-700">
            {title}
          </h3>
          <span className="text-xs font-medium text-schneider-800/65">{itemCountLabel}</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-schneider-800/55 transition group-open:rotate-180">
          ▼
        </span>
      </summary>

      <div className="mt-4 grid gap-2.5">
        {items.map(function renderSectionField(field) {
          return (
            <PcDetailFieldCard
              key={field.id}
              copiedFieldId={copiedFieldId}
              field={field}
              onCopy={onCopy}
            />
          );
        })}
      </div>
    </details>
  );
}
