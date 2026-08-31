import { describe, expect, it } from 'vitest'
import * as XLSX from 'xlsx'
import { parseExcel } from './parseExcel'

/** Arma un .xlsx en memoria a partir de una matriz (primera fila = headers). */
function makeFile(aoa: unknown[][], sheetName = 'Hoja1'): File {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
  return new File([buf], 'lista.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

describe('parseExcel', () => {
  it('mapea las 3 columnas requeridas e ignora el resto', async () => {
    const file = makeFile([
      [
        'id',
        'Código Interno',
        'Código de Barras',
        'Producto',
        'Marca',
        'Categoría',
        'Moneda',
        'Neto',
        'FINAL',
        'MAYORISTA (NETO)',
        'MAYORISTA (FINAL)',
      ],
      [1, 'INT-1', '779000000001', 'Pañales Talle G x40', 'AcmeBaby', 'Pañales', 'ARS', '2.500,00', '3.093,30', '2.100,00', '2.600,00'],
      [2, 'INT-2', '779000000002', 'Toallitas x100', 'AcmeBaby', 'Higiene', 'ARS', '1.000,00', '1.450,75', '900,00', '1.100,00'],
    ])

    const { productos, columnasFaltantes } = await parseExcel(file)

    expect(columnasFaltantes).toEqual([])
    expect(productos).toEqual([
      { codigo: '779000000001', nombre: 'Pañales Talle G x40', final: 3093 },
      { codigo: '779000000002', nombre: 'Toallitas x100', final: 1451 },
    ])
  })

  it('el matching de headers es tolerante a acentos, mayúsculas y espacios', async () => {
    const file = makeFile([
      ['  CODIGO DE BARRAS  ', 'producto', 'Final'],
      ['abc', 'Producto X', 4000],
    ])

    const { productos, columnasFaltantes } = await parseExcel(file)

    expect(columnasFaltantes).toEqual([])
    expect(productos).toEqual([{ codigo: 'abc', nombre: 'Producto X', final: 4000 }])
  })

  it('descarta filas sin "final" válido', async () => {
    const file = makeFile([
      ['Código de Barras', 'Producto', 'Final'],
      ['ok', 'Con precio', '1.200,00'],
      ['bad', 'Sin precio', ''],
      ['bad2', 'Precio basura', 'N/D'],
    ])

    const { productos } = await parseExcel(file)

    expect(productos).toEqual([{ codigo: 'ok', nombre: 'Con precio', final: 1200 }])
  })

  it('reporta columnasFaltantes cuando falta "final" (sin confundir con MAYORISTA (FINAL))', async () => {
    const file = makeFile([
      ['Código de Barras', 'Producto', 'MAYORISTA (FINAL)'],
      ['x', 'Producto sin final de lista', '2.600,00'],
    ])

    const { productos, columnasFaltantes } = await parseExcel(file)

    expect(productos).toEqual([])
    expect(columnasFaltantes).toEqual(['final'])
  })

  it('reporta todas las columnas requeridas faltantes', async () => {
    const file = makeFile([
      ['Marca', 'Categoría', 'Moneda'],
      ['AcmeBaby', 'Pañales', 'ARS'],
    ])

    const { productos, columnasFaltantes } = await parseExcel(file)

    expect(productos).toEqual([])
    expect(columnasFaltantes).toEqual(['código de barras', 'producto', 'final'])
  })

  it('solo lee la primera hoja', async () => {
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([
        ['Código de Barras', 'Producto', 'Final'],
        ['prim', 'De la primera hoja', 5000],
      ]),
      'Primera',
    )
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([
        ['Código de Barras', 'Producto', 'Final'],
        ['seg', 'De la segunda hoja', 9999],
      ]),
      'Segunda',
    )
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
    const file = new File([buf], 'lista.xlsx')

    const { productos } = await parseExcel(file)

    expect(productos).toEqual([{ codigo: 'prim', nombre: 'De la primera hoja', final: 5000 }])
  })
})
