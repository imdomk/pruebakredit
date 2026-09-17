import type { Credito } from "../types/credito";

interface ConfirmDeleteDialogProps {
  credito: Credito;
  onConfirmar: () => void;
  onCancelar: () => void;
  eliminado: boolean;
}

export function ConfirmDeleteDialog({ credito, onConfirmar, onCancelar, eliminado }: ConfirmDeleteDialogProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Confirmar Eliminación</h2>
        <p className="mb-4">
          ¿Está seguro de que desea eliminar el crédito de {credito.nombres} {credito.apellidos}?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className={`px-4 py-2 rounded ${eliminado ? 'bg-green-500 text-white' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            {eliminado ? 'Eliminado' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}