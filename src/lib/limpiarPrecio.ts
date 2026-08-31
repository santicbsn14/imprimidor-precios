/**
 * Convierte un precio en formato argentino a number entero (redondeado).
 *
 *   "3.093,30"  -> 3093   (punto = miles, coma = decimal)
 *   3093.3      -> 3093   (number: se redondea)
 *   "", "  ", "abc", null, undefined -> null
 */
export function limpiarPrecio(valor: unknown): number | null {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? Math.round(valor) : null
  }

  if (typeof valor !== 'string') return null

  const limpio = valor.trim()
  if (limpio === '') return null

  // Nos quedamos solo con dígitos, separadores y signo.
  const soloNumero = limpio.replace(/[^\d.,-]/g, '')
  if (soloNumero === '' || soloNumero === '-') return null

  // Formato argentino: se eliminan los puntos de miles y la coma pasa a punto decimal.
  const normalizado = soloNumero.replace(/\./g, '').replace(',', '.')

  const n = Number(normalizado)
  if (!Number.isFinite(n)) return null

  return Math.round(n)
}
