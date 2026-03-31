import { useEffect, useState } from "react";
import type { VisiblePcDetailField } from "@/features/infrastructure-map/pc-details/ui/content/types";
import { copyTextToClipboard } from "@/features/infrastructure-map/pc-details/ui/components/copyTextToClipboard";

const COPIED_FEEDBACK_DELAY_MS = 1400;

export function useCopiedField() {
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null);

  useEffect(() => {
    if (copiedFieldId === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedFieldId(null);
    }, COPIED_FEEDBACK_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copiedFieldId]);

  async function handleCopy(field: VisiblePcDetailField): Promise<void> {
    const didCopy = await copyTextToClipboard(field.value);

    if (didCopy) {
      setCopiedFieldId(field.id);
    }
  }

  return {
    copiedFieldId,
    handleCopy,
  };
}
