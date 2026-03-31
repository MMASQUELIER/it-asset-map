import { COLUMN_KEYS } from "@/features/infrastructure-map/catalog/lib/columns.ts";
import { readMeaningfulCell } from "@/features/infrastructure-map/catalog/lib/cellReaders.ts";
import type { BackendAssetRecord } from "@/features/infrastructure-map/catalog/types.ts";

export function buildExcelIssues(
  asset: BackendAssetRecord,
  sectorColumnName: string,
): string[] | undefined {
  const issues = [
    createMissingFieldIssue("Hostname", readMeaningfulCell(asset[COLUMN_KEYS.hostname])),
    createMissingFieldIssue("Prodsched", readMeaningfulCell(asset[COLUMN_KEYS.prodsched])),
    createMissingFieldIssue(
      "Manufacturing Station names",
      readMeaningfulCell(asset[COLUMN_KEYS.stationName]),
    ),
    createMissingFieldIssue(
      "Location / physical location on floor",
      readMeaningfulCell(asset[sectorColumnName]),
    ),
  ].filter((issue): issue is string => issue !== null);

  return issues.length > 0 ? issues : undefined;
}

function createMissingFieldIssue(
  fieldLabel: string,
  fieldValue: string | null,
): string | null {
  return fieldValue === null
    ? `Excel incomplet : champ ${fieldLabel} manquant.`
    : null;
}
