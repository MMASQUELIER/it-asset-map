import { useEffect, useState, type SVGProps } from "react";
import type { VisiblePcDetailField } from "@/features/infrastructure-map/pc-details/ui/content/types";
import {
  joinClassNames,
  textInputClassName,
} from "@/features/infrastructure-map/ui/uiClassNames";

interface PcDetailFieldCardProps {
  copiedFieldId: string | null;
  field: VisiblePcDetailField;
  onCopy: (field: VisiblePcDetailField) => void;
  onSaveField?: (field: VisiblePcDetailField, nextValue: string) => Promise<void>;
}

export function PcDetailFieldCard({
  copiedFieldId,
  field,
  onCopy,
  onSaveField,
}: PcDetailFieldCardProps) {
  const isCopied = copiedFieldId === field.id;
  const isEditable = field.editableFieldId !== undefined &&
    onSaveField !== undefined;
  const buttonLabel = isCopied ? `${field.label} copie` : `Copier ${field.label}`;
  const buttonTitle = isCopied ? "Copie" : "Copier";
  const [draftValue, setDraftValue] = useState(field.editValue ?? field.value);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      return;
    }

    setDraftValue(field.editValue ?? field.value);
  }, [field.editValue, field.value, isEditing]);

  function handleStartEdit(): void {
    setDraftValue(field.editValue ?? field.value);
    setErrorMessage(null);
    setIsEditing(true);
  }

  function handleCancelEdit(): void {
    setDraftValue(field.editValue ?? field.value);
    setErrorMessage(null);
    setIsEditing(false);
  }

  async function handleSaveEdit(): Promise<void> {
    if (!isEditable || onSaveField === undefined) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await onSaveField(field, draftValue);
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de sauvegarder ce champ.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-[20px] border border-schneider-950/10 bg-white/96 px-4 py-3 shadow-[0_8px_18px_rgba(16,38,26,0.05)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <span className="min-w-0 break-words text-[0.68rem] font-black uppercase leading-5 tracking-[0.12em] text-schneider-700/78">
          {field.label}
        </span>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          {isEditing
            ? (
              <>
                <button
                  className={smallSecondaryButtonClassName}
                  disabled={isSaving}
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Annuler
                </button>
                <button
                  className={smallPrimaryButtonClassName}
                  disabled={isSaving}
                  type="button"
                  onClick={() => void handleSaveEdit()}
                >
                  {isSaving ? "Sauvegarde..." : "Enregistrer"}
                </button>
              </>
            )
            : (
              <>
                {isEditable
                  ? (
                    <button
                      className={smallSecondaryButtonClassName}
                      type="button"
                      onClick={handleStartEdit}
                    >
                      Modifier
                    </button>
                  )
                  : null}
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
              </>
            )}
        </div>
      </div>

      <div className="mt-2.5 grid gap-2">
        {isEditing
          ? (
            <input
              className={joinClassNames(
                textInputClassName,
                "px-3 py-2.5 text-[0.95rem]",
              )}
              disabled={isSaving}
              type="text"
              value={draftValue}
              onChange={(event) => setDraftValue(event.target.value)}
            />
          )
          : (
            <strong
              className={joinClassNames(
                "min-w-0 break-words text-[0.98rem] leading-6",
                field.isMissingValue
                  ? "font-medium italic text-schneider-800/55"
                  : "text-schneider-950",
              )}
            >
              {field.value}
            </strong>
          )}

        {errorMessage !== null
          ? (
            <p className="m-0 text-xs font-medium leading-5 text-rose-700">
              {errorMessage}
            </p>
          )
          : null}
      </div>
    </div>
  );
}

const smallPrimaryButtonClassName = joinClassNames(
  "inline-flex min-h-9 items-center justify-center rounded-[14px] border px-3",
  "border-schneider-700/10 bg-schneider-700 text-[0.8rem] font-black text-white",
  "transition hover:-translate-y-0.5 hover:brightness-105",
  "disabled:cursor-not-allowed disabled:opacity-55",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/30",
);

const smallSecondaryButtonClassName = joinClassNames(
  "inline-flex min-h-9 items-center justify-center rounded-[14px] border px-3",
  "border-schneider-950/10 bg-schneider-50/88 text-[0.8rem] font-bold text-schneider-900",
  "transition hover:-translate-y-0.5 hover:border-schneider-700/20 hover:bg-schneider-100/90",
  "disabled:cursor-not-allowed disabled:opacity-55",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schneider-500/25",
);

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
