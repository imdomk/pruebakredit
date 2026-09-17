export interface Credito {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  plazo: number;
  tasaInteres: number;
  valorCredito: number;
  cuota: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreditoInput {
  cedula: string;
  nombres: string;
  apellidos: string;
  plazo: number;
  tasaInteres: number;
  valorCredito: number;
}