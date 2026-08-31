import { describe, expect, it } from 'vitest'
import { limpiarPrecio } from './limpiarPrecio'

describe('limpiarPrecio', () => {
  it('formato argentino con miles y decimales', () => {
    expect(limpiarPrecio('3.093,30')).toBe(3093)
    expect(limpiarPrecio('1.234.567,89')).toBe(1234568)
    expect(limpiarPrecio('$ 3.093,30')).toBe(3093)
    expect(limpiarPrecio('1.500')).toBe(1500) // solo separador de miles
    expect(limpiarPrecio('999,99')).toBe(1000) // redondeo
  })

  it('number passthrough (redondeado)', () => {
    expect(limpiarPrecio(3093)).toBe(3093)
    expect(limpiarPrecio(3093.3)).toBe(3093)
    expect(limpiarPrecio(3093.6)).toBe(3094)
    expect(limpiarPrecio(0)).toBe(0)
  })

  it('valores inválidos o vacíos -> null', () => {
    expect(limpiarPrecio('')).toBeNull()
    expect(limpiarPrecio('   ')).toBeNull()
    expect(limpiarPrecio('abc')).toBeNull()
    expect(limpiarPrecio(null)).toBeNull()
    expect(limpiarPrecio(undefined)).toBeNull()
    expect(limpiarPrecio(NaN)).toBeNull()
    expect(limpiarPrecio(Infinity)).toBeNull()
    expect(limpiarPrecio({})).toBeNull()
    expect(limpiarPrecio(true)).toBeNull()
  })
})
