import { RequestHandler } from "express";
import { ZodSchema } from "zod";

type Source = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, source: Source = "body"): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      next(result.error);
      return;
    }
    // overwrite with parsed (coerced/trimmed) data
    (req as any)[source] = result.data;
    next();
  };
