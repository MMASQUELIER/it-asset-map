import type { Context, Hono } from "hono";
import { backendConfig } from "@/config/env.ts";
import {
  EDITABLE_CATALOG_FIELD_COLUMN_NAMES,
  isEditableCatalogFieldId,
} from "@/features/infrastructure-map/catalog/lib/editableFields.ts";
import {
  ExcelColumnNotFoundError,
  ExcelRowNotFoundError,
  ExcelSheetNotFoundError,
  readAssetsFromExcelFile,
  updateAssetFieldInExcelFile,
} from "@/features/infrastructure-map/catalog/repository.ts";
import { buildInfrastructureCatalog } from "@/features/infrastructure-map/catalog/service.ts";

export function registerCatalogRoutes(apiApp: Hono): void {
  apiApp.get("/api/catalog", handleGetCatalog);
  apiApp.patch("/api/catalog/pc/:sourceRowNumber", handlePatchCatalogPcField);
}

async function handleGetCatalog(context: Context) {
  try {
    const assets = await readAssetsFromExcelFile(
      backendConfig.excelFilePath,
      backendConfig.excelAssetSheetName,
    );

    return context.json(
      buildInfrastructureCatalog(assets, backendConfig.assetSectorColumnName),
    );
  } catch (error) {
    if (error instanceof ExcelSheetNotFoundError) {
      return context.json({ error: error.message }, 404);
    }

    return context.json(
      { error: "Impossible de charger le catalogue infrastructure." },
      500,
    );
  }
}

async function handlePatchCatalogPcField(context: Context) {
  try {
    const sourceRowNumber = parseSourceRowNumber(
      context.req.param("sourceRowNumber"),
    );
    const payload = await context.req.json() as {
      fieldId?: unknown;
      value?: unknown;
    };
    const fieldId = parseEditableFieldId(payload.fieldId);
    const value = parseEditableFieldValue(payload.value);

    const configuredColumnNames = fieldId === "sector"
      ? [backendConfig.assetSectorColumnName]
      : normalizeColumnNames(EDITABLE_CATALOG_FIELD_COLUMN_NAMES[fieldId]);

    for (const columnName of configuredColumnNames) {
      await updateAssetFieldInExcelFile(
        backendConfig.excelFilePath,
        backendConfig.excelAssetSheetName,
        sourceRowNumber,
        columnName,
        value,
      );
    }

    return context.json({
      fieldId,
      sourceRowNumber,
      success: true,
      value,
    });
  } catch (error) {
    if (
      error instanceof CatalogFieldUpdateValidationError ||
      error instanceof ExcelColumnNotFoundError ||
      error instanceof ExcelRowNotFoundError ||
      error instanceof SyntaxError
    ) {
      return context.json(
        { error: error.message || "La mise a jour Excel demandee est invalide." },
        400,
      );
    }

    if (error instanceof ExcelSheetNotFoundError) {
      return context.json({ error: error.message }, 404);
    }

    return context.json(
      { error: "Impossible de mettre a jour le catalogue Excel." },
      500,
    );
  }
}

class CatalogFieldUpdateValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogFieldUpdateValidationError";
  }
}

function parseSourceRowNumber(rawValue: string): number {
  const sourceRowNumber = Number(rawValue);

  if (!Number.isInteger(sourceRowNumber) || sourceRowNumber < 2) {
    throw new CatalogFieldUpdateValidationError(
      "Le numero de ligne Excel envoye est invalide.",
    );
  }

  return sourceRowNumber;
}

function parseEditableFieldId(rawValue: unknown) {
  if (typeof rawValue !== "string" || !isEditableCatalogFieldId(rawValue)) {
    throw new CatalogFieldUpdateValidationError(
      "Le champ Excel a modifier n'est pas autorise.",
    );
  }

  return rawValue;
}

function parseEditableFieldValue(rawValue: unknown): string {
  if (rawValue === null || rawValue === undefined) {
    return "";
  }

  if (typeof rawValue !== "string") {
    throw new CatalogFieldUpdateValidationError(
      "La valeur envoyee doit etre une chaine de caracteres.",
    );
  }

  return rawValue.trim();
}

function normalizeColumnNames(
  columnNames: string | readonly string[],
): string[] {
  if (typeof columnNames === "string") {
    return [columnNames];
  }

  return Array.from(columnNames);
}
