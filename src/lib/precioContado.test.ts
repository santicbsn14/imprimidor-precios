import { describe, expect, it } from 'vitest'
import { precioContado } from './precioContado'

describe('precioContado', () => {
  it('casos confirmados con el cliente', () => {
    expect(precioContado(1760)).toBe(1600) // 1636.8 -> tramo 1000..5000 -> floor a 50
    expect(precioContado(5820)).toBe(5400) // 5412.6 -> tramo >=5000 -> floor a 100
    expect(precioContado(290)).toBe(260) //  269.7  -> tramo <1000 -> floor a 10
  })

  it('borde de 5000: cruza del tramo de 50 al de 100', () => {
    expect(precioContado(5376)).toBe(4950) // 4999.68 -> tramo 1000..5000 -> floor a 50
    expect(precioContado(5377)).toBe(5000) // 5000.61 -> tramo >=5000  -> floor a 100
  })

  it('borde de 1000: cruza del tramo de 10 al de 50', () => {
    expect(precioContado(1075)).toBe(990) //  999.75 -> tramo <1000    -> floor a 10
    expect(precioContado(1076)).toBe(1000) // 1000.68 -> tramo >=1000  -> floor a 50
  })
})
