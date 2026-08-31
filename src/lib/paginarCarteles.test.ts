import { describe, expect, it } from 'vitest'
import type { ProductoCartel } from '../types'
import { paginarCarteles } from './paginarCarteles'

const A: ProductoCartel = { codigo: 'A', nombre: 'Prod A', final: 1000 }
const B: ProductoCartel = { codigo: 'B', nombre: 'Prod B', final: 2000 }
const C: ProductoCartel = { codigo: 'C', nombre: 'Prod C', final: 3000 }

describe('paginarCarteles', () => {
  it('expande copias y pagina de a 2', () => {
    const paginas = paginarCarteles(
      [
        { producto: A, copias: 2 },
        { producto: B, copias: 1 },
        { producto: C, copias: 3 },
      ],
      2,
    )
    expect(paginas).toEqual([
      [A, A],
      [B, C],
      [C, C],
    ])
  })

  it('mismo input en una sola hoja de 6', () => {
    const paginas = paginarCarteles(
      [
        { producto: A, copias: 2 },
        { producto: B, copias: 1 },
        { producto: C, copias: 3 },
      ],
      6,
    )
    expect(paginas).toHaveLength(1)
    expect(paginas[0]).toEqual([A, A, B, C, C, C])
  })

  it('7 carteles con porHoja 6 -> [[6],[1]]', () => {
    const paginas = paginarCarteles([{ producto: A, copias: 7 }], 6)
    expect(paginas.map((p) => p.length)).toEqual([6, 1])
  })

  it('ignora copias < 1', () => {
    const paginas = paginarCarteles(
      [
        { producto: A, copias: 0 },
        { producto: B, copias: -3 },
        { producto: C, copias: 2 },
      ],
      6,
    )
    expect(paginas).toEqual([[C, C]])
  })

  it('lista vacía -> []', () => {
    expect(paginarCarteles([], 6)).toEqual([])
  })
})
