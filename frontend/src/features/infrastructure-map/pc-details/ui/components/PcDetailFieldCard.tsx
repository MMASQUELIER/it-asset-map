import type { SVGProps } from "react";
import type { VisiblePcDetailField } from "@/features/infrastructure-map/pc-details/ui/content/types";
import { joinClassNames } from "@/features/infrastructure-map/ui/uiClassNames";

interface PcDetailFieldCardProps {
  copiedFieldId: string | null;
  field: VisiblePcDetailField;
  onCopy: (field: VisiblePcDetailField) => void;
}

export function PcDetailFieldCard({
  copiedFieldId,
  field,
  onCopy,
}: PcDetailFieldCardProps) {
  const isCopied = copiedFieldId === field.id;
  const buttonLabel = isCopied ? `${field.label} copie` : `Copier ${field.label}`;
  const buttonTitle = isCopied ? "Copie" : "Copier";

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-[20px] border border-schneider-950/10 bg-white/96 px-4 py-3 shadow-[0_8px_18px_rgba(16,38,26,0.05)]">
      <div className="min-w-0 grid gap-1.5">
        <span className="min-w-0 break-words text-[0.68rem] font-black uppercase leading-5 tracking-[0.12em] text-schneider-700/78">
          {field.label}
        </span>
        <strong className="min-w-0 break-words text-[0.98rem] leading-6 text-schneider-950">
          {field.value}
        </strong>
      </div>

      <div className="pt-0.5">
        <button
          aria-label={buttonLabel}
          className={joinClassNames(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition sm:size-9",
            "border-schneider-950/10 bg-schneider-50 text-schneider-800 hover:-translate-y-0.5 hover:bg-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/25",
            isCopied && "border-schneider-500/20 bg-schneider-500 text-schneider-950",
          )}
          title={buttonTitle}
          type="button"
          onClick={function handleCopyButtonClick() {
            onCopy(field);
          }}
        >
          {renderCopyButtonIcon(isCopied)}
        </button>
      </div>
    </div>
  );
}

function renderCopyButtonIcon(isCopied: boolean) {
  if (isCopied) {
    return <CheckIcon />;
  }

  return <CopyIcon />;
}

function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M5.5 3.5h5a2 2 0 0 1 2 2v5M5 6.5h5a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 10 13.5H5A1.5 1.5 0 0 1 3.5 12V8A1.5 1.5 0 0 1 5 6.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="m3.5 8.5 2.4 2.4 6.6-6.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}
