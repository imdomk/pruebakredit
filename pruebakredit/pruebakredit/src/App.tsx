import { useState, useEffect } from 'react'
import type {Credito, CreditoInput, ErroresPorCampo} from './types/credito'
import { creditosApi, ApiError } from './api/creditos'
import { CreditoFormModal } from './components/CreditoFormModal'
import { CreditoTable } from './components/CreditoTable'
import { ConfirmDeleteDialog } from './components/ConfirmDeleteDialog'

export default function App() {
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [creditoEditando, setCreditoEditando] = useState<Credito | null>(null);

  const [creditoAEliminar, setCreditoAEliminar] = useState<Credito | null>(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargarCreditos() {
    setCargando(true);
    setErrorCarga(null);
    try {
      const data = await creditosApi.listar();
      setCreditos(data);
    } catch (err) {
      setErrorCarga(
        err instanceof Error
          ? err.message
          : "No se pudo conectar con el servidor. ¿Está corriendo el backend en el puerto 4000?"
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    let activo = true;

    creditosApi.listar()
      .then((data) => {
        if (activo) setCreditos(data);
      })
      .catch((err) => {
        if (activo) {
          setErrorCarga(
            err instanceof Error
              ? err.message
              : "No se pudo conectar con el servidor. ¿Está corriendo el backend en el puerto 4000?"
          );
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  function abrirCrear() {
    setCreditoEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(credito: Credito) {
    setCreditoEditando(credito);
    setModalAbierto(true);
  }

  async function handleGuardar(input: CreditoInput): Promise<ErroresPorCampo | void> {
    try {
      if (creditoEditando) {
        await creditosApi.actualizar(creditoEditando.id, input);
      } else {
        await creditosApi.crear(input);
      }
      setModalAbierto(false);
      await cargarCreditos();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        return err.fieldErrors;
      }
      throw err;
    }
  }

  async function handleConfirmarEliminar() {
    if (!creditoAEliminar) return;
    setEliminando(true);
    try {
      await creditosApi.eliminar(creditoAEliminar.id);
      setCreditoAEliminar(null);
      await cargarCreditos();
    } catch (err) {
      setErrorCarga(err instanceof Error ? err.message : "No se pudo eliminar el crédito");
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">Prueba técnica — Ing. de Desarrollo</p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Gestión de créditos</h1>
            <p className="mt-1 text-sm text-slate-500">React + API REST (Express/TypeScript) + SQLite</p>
          </div>
          <button
            onClick={abrirCrear}
            className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-800"
          >
            + Nuevo crédito
          </button>
        </header>

        {errorCarga && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span>{errorCarga}</span>
            <button onClick={cargarCreditos} className="font-medium underline">
              Reintentar
            </button>
          </div>
        )}

        {cargando ? (
          <p className="py-16 text-center text-sm text-slate-500">Cargando créditos…</p>
        ) : (
          <>
            <CreditoTable creditos={creditos} onEditar={abrirEditar} onEliminar={setCreditoAEliminar} />
            <p className="mt-6 text-center text-xs text-slate-400">
              {creditos.length} {creditos.length === 1 ? "crédito" : "créditos"}
            </p>
          </>
        )}
      </div>

      {modalAbierto && (
        <CreditoFormModal
          creditoEditando={creditoEditando}
          onCerrar={() => setModalAbierto(false)}
          onGuardar={handleGuardar}
        />
      )}

      {creditoAEliminar && (
        <ConfirmDeleteDialog
          credito={creditoAEliminar}
          onCancelar={() => setCreditoAEliminar(null)}
          onConfirmar={handleConfirmarEliminar}
          eliminado={eliminando}
        />
      )}
    </div>
  )}
