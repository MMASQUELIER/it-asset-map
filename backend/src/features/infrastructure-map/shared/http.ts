import type { Context } from "hono";
import {
  HttpError,
  ValidationError,
} from "@/features/infrastructure-map/shared/errors.ts";

type RouteHandler = (context: Context) => Promise<Response>;
type JsonRouteResolver<T> = (context: Context) => Promise<T>;
type NoContentRouteResolver = (context: Context) => Promise<void>;

export async function readJsonBody(context: Context): Promise<unknown> {
  try {
    return await context.req.json();
  } catch {
    throw new ValidationError("The request body must contain valid JSON.");
  }
}

export async function readJsonBodyAs<T>(context: Context): Promise<T> {
  return await readJsonBody(context) as T;
}

export function getNumericRouteParam(
  context: Context,
  paramName: string,
): number {
  const rawValue = context.req.param(paramName);
  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new ValidationError(
      `Route parameter "${paramName}" must be a positive integer.`,
    );
  }

  return parsedValue;
}

export function getStringRouteParam(
  context: Context,
  paramName: string,
): string {
  const rawValue = context.req.param(paramName);

  if (typeof rawValue !== "string") {
    throw new ValidationError(`Route parameter "${paramName}" is required.`);
  }

  const value = rawValue.trim();

  if (value.length === 0) {
    throw new ValidationError(`Route parameter "${paramName}" is required.`);
  }

  return value;
}

export function handleRouteError(
  context: Context,
  error: unknown,
  fallbackMessage: string,
): Response {
  if (error instanceof HttpError) {
    return context.json(
      { error: error.message },
      error.status as 400 | 404 | 409,
    );
  }

  console.error(error);
  return context.json({ error: fallbackMessage }, 500);
}

export function createRouteHandler(
  fallbackMessage: string,
  handler: RouteHandler,
): RouteHandler {
  return async (context) => {
    try {
      return await handler(context);
    } catch (error) {
      return handleRouteError(context, error, fallbackMessage);
    }
  };
}

export function createJsonRoute<T>(
  fallbackMessage: string,
  resolver: JsonRouteResolver<T>,
  status: 200 | 201 = 200,
): RouteHandler {
  return createRouteHandler(
    fallbackMessage,
    async (context) => context.json(await resolver(context), status),
  );
}

export function createNoContentRoute(
  fallbackMessage: string,
  resolver: NoContentRouteResolver,
): RouteHandler {
  return createRouteHandler(fallbackMessage, async (context) => {
    await resolver(context);
    return context.body(null, 204);
  });
}
