import type { Credito, CreditoInput, ErroresPorCampo } from "../types/credito";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  fieldErrors?: ErroresPorCampo;
  constructor(message: string, fieldErrors?: ErroresPorCampo) {
    super(message);
    this.name = "ApiError";
    this.fieldErrors = fieldErrors;
  }
}

async function manejarRespuesta<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(body?.error ?? `Error ${res.status}`, body?.detalles);
  }

  return body as T;
}

export const creditosApi = {
  async listar(): Promise<Credito[]> { 
    const res = await fetch(`${API_URL}/creditos`);
    return manejarRespuesta<Credito[]>(res);
  },
  async crear(input: CreditoInput): Promise<Credito> {
    const res = await fetch(`${API_URL}/creditos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return manejarRespuesta<Credito>(res);
  },
  async actualizar(id: number, input: CreditoInput): Promise<Credito> {
    const res = await fetch(`${API_URL}/creditos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return manejarRespuesta<Credito>(res);
  },
  async eliminar(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/creditos/${id}`, { method: "DELETE" });
    return manejarRespuesta<void>(res);
  },
};