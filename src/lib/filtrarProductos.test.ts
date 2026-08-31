import { describe, expect, it } from 'vitest'
import type { ProductoCartel } from '../types'
import { filtrarProductos } from './filtrarProductos'

const productos: ProductoCartel[] = [
  { codigo: '779000000001', nombre: 'Pañales Talle G x40', final: 3000 },
  { codigo: '779000000002', nombre: 'Toallitas Húmedas x100', final: 1500 },
  { codigo: 'ABC-123', nombre: 'Óleo Calcáreo 200ml', final: 900 },
]

describe('filtrarProductos', () => {
  it('match por nombre (substring)', () => {
    expect(filtrarProductos(productos, 'toallitas')).toEqual([productos[1]])
    expect(filtrarProductos(productos, 'x40')).toEqual([productos[0]])
  })

  it('match por código (substring, no exacto)', () => {
    expect(filtrarProductos(productos, '0000002')).toEqual([productos[1]])
    expect(filtrarProductos(productos, 'abc-123')).toEqual([productos[2]])
  })

  it('insensible a acentos y mayúsculas', () => {
    expect(filtrarProductos(productos, 'OLEO CALCAREO')).toEqual([productos[2]])
    expect(filtrarProductos(productos, 'húmedas')).toEqual([productos[1]])
    expect(filtrarProductos(productos, 'PAÑALES')).toEqual([productos[0]])
  })

  it('query vacía o whitespace -> []', () => {
    expect(filtrarProductos(productos, '')).toEqual([])
    expect(filtrarProductos(productos, '   ')).toEqual([])
  })

  it('sin coincidencias -> []', () => {
    expect(filtrarProductos(productos, 'zzz')).toEqual([])
  })
})
