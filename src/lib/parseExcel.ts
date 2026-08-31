import * as XLSX from 'xlsx'
import type { ProductoCartel } from '../types'
import { limpiarPrecio } from './limpiarPrecio'

export type ResultadoParse = {
  productos: ProductoCartel[]
  columnasFaltantes: string[]
}

/** Etiquetas requeridas, tal cual se muestran al usuario. */
const COL_CODIGO = 'código de barras'
const COL_PRODUCTO = 'producto'
const COL_FINAL = 'final'

/** trim + lowercase + sin acentos, para comparar headers de forma tolerante. */
function normalizar(valor: unknown): string {
  return String(valor ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function toBuffer(file: File | ArrayBuffer | Uint8Array): Promise<ArrayBuffer | Uint8Array> {
  if (file instanceof ArrayBuffer || file instanceof Uint8Array) return Promise.resolve(file)
  return file.arrayBuffer()
}

export async function parseExcel(file: File | ArrayBuffer | Uint8Array): Promise<ResultadoParse> {
  const data = await toBuffer(file)
  const wb = XLSX.read(data, { type: 'array' })

  const primeraHoja = wb.SheetNames[0]
  const hoja = primeraHoja ? wb.Sheets[primeraHoja] : undefined
  if (!hoja) {
    return { productos: [], columnasFaltantes: [COL_CODIGO, COL_PRODUCTO, COL_FINAL] }
  }

  const filas = XLSX.utils.sheet_to_json<unknown[]>(hoja, {
    header: 1,
    raw: true,
    blankrows: false,
    defval: null,
  })

  const headers = (filas[0] ?? []) as unknown[]

  // Mapa: header normalizado -> índice de columna.
  const indices = new Map<string, number>()
  headers.forEach((h, i) => {
    const key = normalizar(h)
    if (key && !indices.has(key)) indices.set(key, i)
  })

  const idxCodigo = indices.get(normalizar(COL_CODIGO))
  const idxProducto = indices.get(normalizar(COL_PRODUCTO))
  const idxFinal = indices.get(normalizar(COL_FINAL))

  const columnasFaltantes: string[] = []
  if (idxCodigo === undefined) columnasFaltantes.push(COL_CODIGO)
  if (idxProducto === undefined) columnasFaltantes.push(COL_PRODUCTO)
  if (idxFinal === undefined) columnasFaltantes.push(COL_FINAL)

  if (columnasFaltantes.length > 0) {
    return { productos: [], columnasFaltantes }
  }

  const productos: ProductoCartel[] = []
  for (let i = 1; i < filas.length; i++) {
    const fila = filas[i] as unknown[]
    if (!fila) continue

    const final = limpiarPrecio(fila[idxFinal!])
    if (final === null) continue

    productos.push({
      codigo: String(fila[idxCodigo!] ?? '').trim(),
      nombre: String(fila[idxProducto!] ?? '').trim(),
      final,
    })
  }

  return { productos, columnasFaltantes: [] }
}
