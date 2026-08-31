import type { ProductoCartel } from '../types'

/** trim + lowercase + sin acentos, para comparar de forma tolerante. */
function normalizar(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

/**
 * Filtra productos por nombre O código (substring, no exacto).
 * Con búsqueda vacía / whitespace devuelve [] — la UI muestra un prompt en vez
 * de renderizar los ~1000 productos de una.
 */
export function filtrarProductos(
  productos: ProductoCartel[],
  busqueda: string,
): ProductoCartel[] {
  const query = normalizar(busqueda)
  if (query === '') return []

  return productos.filter(
    (p) =>
      normalizar(p.nombre).includes(query) || normalizar(p.codigo).includes(query),
  )
}
