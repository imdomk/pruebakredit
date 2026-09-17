import { z } from 'zod';

export const creditoInputSchema = z.object({
    cedula: z.string().trim().min(5, { message: "La cédula debe tener al menos 5 caracteres" }).regex(/^[0-9]+$/, { message: "La cédula debe contener solo números" }),
    nombres: z.string().trim().min(2, { message: "Los nombres son obligatorios" }),
    apellidos: z.string().trim().min(2, { message: "Los apellidos son obligatorios" }),
    plazo: z.coerce.number().int().positive({ message: "El plazo debe ser mayor a 0" }),
    tasaInteres: z.coerce.number().min(0, { message: "La tasa de interés no debe ser negativa" }),
    valorCredito: z.coerce.number().positive({ message: "El valor del crédito debe ser mayor a 0" }),
});

export const idParamSchema = z.coerce.number().int().positive();