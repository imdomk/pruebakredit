import type { Request, Response, NextFunction } from "express";
import { creditoService } from "../services/credito.service";
import { creditoInputSchema, idParamSchema } from "../validators/credito.validator";
import { ValidationError } from "../errors";
import type { ZodError } from "zod";

function formatearErroresZod(error: ZodError): Record<string, string> {
  const detalles: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "general");
    if (!detalles[key]) detalles[key] = issue.message;
  }
  return detalles;
}

export const creditoController = {
  crear(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = creditoInputSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Datos de crédito inválidos", formatearErroresZod(parsed.error));
      }
      const credito = creditoService.crear(parsed.data);
      res.status(201).json(credito);
    } catch (err) {
      next(err);
    }
  },

  listar(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(creditoService.listar());
    } catch (err) {
      next(err);
    }
  },

  obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idParamSchema.parse(req.params.id);
      res.status(200).json(creditoService.obtenerPorId(id));
    } catch (err) {
      next(err);
    }
  },

  actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idParamSchema.parse(req.params.id);
      const parsed = creditoInputSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Datos de crédito inválidos", formatearErroresZod(parsed.error));
      }
      res.status(200).json(creditoService.actualizar(id, parsed.data));
    } catch (err) {
      next(err);
    }
  },

  eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idParamSchema.parse(req.params.id);
      creditoService.eliminar(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};