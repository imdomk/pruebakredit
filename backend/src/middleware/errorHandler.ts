import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { NotFoundError, ValidationError } from "../errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message, detalles: err.detalles });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Parámetros inválidos",
      detalles: err.issues.map((i) => ({ campo: i.path.join("."), mensaje: i.message })),
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  console.error("[error no controlado]", err);
  res.status(500).json({ error: "Error interno del servidor" });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Ruta no encontrada" });
}