import {useState, useEffect, useMemo } from "react";
import type { Credito, CreditoInput, ErroresPorCampo } from "../types/credito";
import { formatearMoneda } from "../lib/format";

interface CreditoFormModalProps {
  creditoEditando: Credito | null;
  onGuardar: (input: CreditoInput) => Promise<ErroresPorCampo | void>;
  onCerrar: () => void;
}

const valoresIniciales: CreditoInput = {
  cedula: "",
  nombres: "",
  apellidos: "",
  plazo: 12,
  tasaInteres: 0,
  valorCredito: 0,
};

export function CreditoFormModal({ creditoEditando, onGuardar, onCerrar }: CreditoFormModalProps) {
    const [form, setForm] = useState<CreditoInput>(valoresIniciales);
    const [errores, setErrores] = useState<ErroresPorCampo>({});
    const [guardado, setGuardado] = useState(false);
    const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
    const esEdicion = creditoEditando !== null;

    useEffect(() => {
        if (creditoEditando) {
            setForm({
                cedula: creditoEditando.cedula,
                nombres: creditoEditando.nombres,
                apellidos: creditoEditando.apellidos,
                plazo: creditoEditando.plazo,
                tasaInteres: creditoEditando.tasaInteres,
                valorCredito: creditoEditando.valorCredito,
            });
        } else {
            setForm(valoresIniciales);
        }
        setErrores({});
        setErrorGeneral(null);
    }, [creditoEditando]);

    const cuotaPreview = useMemo(() => {
        if (form.plazo > 0 && form.tasaInteres >= 0 && form.valorCredito > 0) {
            return ( form.valorCredito * (form.tasaInteres / 100) / form.plazo);
        }
        return null;
    }, [form.plazo, form.valorCredito, form.tasaInteres ]);

    function actualizarCampo<K extends keyof CreditoInput>(campo: K, valor: CreditoInput[K]) {
        setForm((prev) => ({ ...prev, [campo]: valor }));
    }

    function validarLocal(): ErroresPorCampo {
        const errores: ErroresPorCampo = {};
        if (!form.cedula.trim()) {
            errores.cedula = "La cédula es requerida.";
        } else if (!/^[0-9]+$/.test(form.cedula.trim())) {
            errores.cedula = "La cédula debe contener solo números.";
        }
        if (!form.nombres.trim()) {
            errores.nombres = "Los nombres son requeridos.";
        }
        if (!form.apellidos.trim()) {
            errores.apellidos = "Los apellidos son requeridos.";
        }
        if (form.plazo <= 0) {
            errores.plazo = "El plazo debe ser mayor a 0.";
        }
        if (form.tasaInteres < 0) {
            errores.tasaInteres = "La tasa de interés no debe ser negativa.";
        }
        if (form.valorCredito <= 0) {
            errores.valorCredito = "El valor del crédito debe ser mayor a 0.";
        }
        return errores;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const erroresLocales = validarLocal();
        if (Object.keys(erroresLocales).length > 0) {
            setErrores(erroresLocales);
            return;
        }
        setGuardado(true);
        setErrorGeneral(null);
        try {
            const resultado = await onGuardar(form);    
            if (resultado) setErrores(resultado);
        } catch (error) {
            setErrorGeneral("Ocurrió un error al guardar el crédito.");
        } finally {
            setGuardado(false);
        }
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="text-xl font-bold mb-4">{esEdicion ? "Editar Crédito" : "Nuevo Crédito"}</h2>
                {errorGeneral && <div className="text-red-500 mb-4">{errorGeneral}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Cédula</label>
                        <input
                            type="text"
                            value={form.cedula}
                            onChange={(e) => actualizarCampo("cedula", e.target.value)}
                            className={`w-full border ${errores.cedula ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
                        />
                        {errores.cedula && <div className="text-red-500 text-sm mt-1">{errores.cedula}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Nombres</label>
                        <input
                            type="text"
                            value={form.nombres}
                            onChange={(e) => actualizarCampo("nombres", e.target.value)}
                            className={`w-full border ${errores.nombres ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
                        />
                        {errores.nombres && <div className="text-red-500 text-sm mt-1">{errores.nombres}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Apellidos</label>
                        <input
                            type="text"
                            value={form.apellidos}
                            onChange={(e) => actualizarCampo("apellidos", e.target.value)}
                            className={`w-full border ${errores.apellidos ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
                        />
                        {errores.apellidos && <div className="text-red-500 text-sm mt-1">{errores.apellidos}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Plazo (meses)</label>
                        <input
                            type="number"
                            value={form.plazo}
                            onChange={(e) => actualizarCampo("plazo", parseInt(e.target.value))}
                            className={`w-full border ${errores.plazo ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
                        />
                        {errores.plazo && <div className="text-red-500 text-sm mt-1">{errores.plazo}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Tasa de Interés (%)</label>
                        <input
                            type="number"
                            value={form.tasaInteres}
                            onChange={(e) => actualizarCampo("tasaInteres", parseFloat(e.target.value))}
                            className={`w-full border ${errores.tasaInteres ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
                        />
                        {errores.tasaInteres && <div className="text-red-500 text-sm mt-1">{errores.tasaInteres}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Valor del Crédito</label>
                        <input
                            type="number"
                            value={form.valorCredito}
                            onChange={(e) => actualizarCampo("valorCredito", parseFloat(e.target.value))}
                            className={`w-full border ${errores.valorCredito ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
                        />
                        {errores.valorCredito && <div className="text-red-500 text-sm mt-1">{errores.valorCredito}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Cuota Estimada</label>
                        <input
                            type="text"
                            value={cuotaPreview !== null ? formatearMoneda(cuotaPreview) : ""}
                            readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onCerrar}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={guardado}
                            className={`px-4 py-2 rounded ${guardado ? 'bg-gray-400 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            {guardado ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>  
        </div>
    );
}