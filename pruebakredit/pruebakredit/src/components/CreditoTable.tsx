import type { Credito } from "../types/credito";
import { formatearMoneda, formatearFecha } from "../lib/format";

interface CreditoTableProps {
  creditos: Credito[];
  onEditar: (credito: Credito) => void;
  onEliminar: (credito: Credito) => void;
}

export function CreditoTable({ creditos, onEditar, onEliminar }: CreditoTableProps) {
    if (creditos.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <p className="text-slate-500 text-sm">No hay créditos registrados.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-md">
            <table className="w-full border-collapse border border-slate-300">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="border border-slate-300 px-4 py-2 text-left">Cédula</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Cliente</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Valor Credito</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Tasa</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Plazo</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Cuota</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Registrado</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {creditos.map((credito) => (
                        <tr key={credito.id}>
                            <td className="border border-slate-300 px-4 py-2 text-left">{credito.cedula}</td>
                            <td className="border border-slate-300 px-4 py-2 text-left">{credito.nombres} {credito.apellidos}</td>
                            <td className="border border-slate-300 px-4 py-2 text-left">{formatearMoneda(credito.valorCredito)}</td>
                            <td className="border border-slate-300 px-4 py-2 text-left">{credito.tasaInteres} %</td>
                            <td className="border border-slate-300 px-4 py-2 text-left">{credito.plazo} meses</td>
                            <td className="border border-slate-300 px-4 py-2 text-left">{formatearMoneda(credito.cuota)}</td>
                            <td className="border border-slate-300 px-4 py-2 text-left">{formatearFecha(credito.creadoEn)}</td>
                            <td className="border border-slate-300 px-4 py-2 text-left">
                                <button
                                    onClick={() => onEditar(credito)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onEliminar(credito)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}