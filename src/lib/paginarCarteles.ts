import type { ProductoCartel } from '../types'

/**
 * Expande la selección a una lista plana (cada producto repetido `copias` veces,
 * ignorando copias < 1) y la parte en páginas de tamaño `porHoja`.
 *
 * Devuelve un array de páginas; cada página tiene a lo sumo `porHoja` carteles.
 * Selección vacía -> [].
 */
export function paginarCarteles(
  seleccionados: { producto: ProductoCartel; copias: number }[],
  porHoja: number,
): ProductoCartel[][] {
  const plano: ProductoCartel[] = []
  for (const { producto, copias } of seleccionados) {
    const n = Math.floor(copias)
    for (let i = 0; i < n; i++) plano.push(producto)
  }

  const paginas: ProductoCartel[][] = []
  for (let i = 0; i < plano.length; i += porHoja) {
    paginas.push(plano.slice(i, i + porHoja))
  }
  return paginas
}
