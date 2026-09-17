import {creditoRepository} from '../repositories/credito.repository';
import {NotFoundError} from '../errors';
import type {Credito, CreditoInput} from '../models/credito.model';

export function calcularCuota(input: Pick<CreditoInput, "valorCredito" | "tasaInteres" | "plazo" >): number {
    const interesTotal = input.valorCredito * (input.tasaInteres / 100);
    const cuota = (input.valorCredito + interesTotal) / input.plazo;
    return Math.round(cuota * 100) / 100;
}

export const creditoService = {
    crear(input: CreditoInput): Credito {
        return creditoRepository.crear(input, calcularCuota(input));
    },
    listar(): Credito[] {
        return creditoRepository.listar();
    },
    obtenerPorId(id: number): Credito {
        const credito = creditoRepository.obtenerPorId(id);
        if (!credito) {
            throw new NotFoundError(`Crédito con ID ${id} no encontrado`);
        }
        return credito;
    },
    actualizar(id: number, input: CreditoInput): Credito {
        const actualizado = creditoRepository.actualizar(id, input, calcularCuota(input));
        if (!actualizado) {
            throw new NotFoundError(`Crédito con ID ${id} no encontrado`);
        }
        return actualizado;
    },
    eliminar(id: number): void {
        if (!creditoRepository.eliminar(id)) throw new NotFoundError(`No existe un crédito con id ${id}`);
    },
};