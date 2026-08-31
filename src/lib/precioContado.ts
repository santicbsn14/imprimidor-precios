// Fórmula confirmada con el cliente. NO modificar.
export function precioContado(final: number): number {
  const conDescuento = final * 0.93
  if (conDescuento >= 5000) return Math.floor(conDescuento / 100) * 100
  if (conDescuento >= 1000) return Math.floor(conDescuento / 50) * 50
  return Math.floor(conDescuento / 10) * 10
}
