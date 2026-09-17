export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

export function formatearFecha(iso: string): string {
  const fecha = new Date(iso.replace(" ", "T") + "Z").toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
   });
  return fecha;
}