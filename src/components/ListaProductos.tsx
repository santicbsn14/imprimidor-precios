import { precioContado } from '../lib/precioContado'
import type { ProductoCartel } from '../types'

type Props = {
  busqueda: string
  resultados: ProductoCartel[]
  seleccionados: Map<string, number>
  onToggle: (codigo: string) => void
  onSetCopias: (codigo: string, n: number) => void
}

const pesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export default function ListaProductos({
  busqueda,
  resultados,
  seleccionados,
  onToggle,
  onSetCopias,
}: Props) {
  if (busqueda.trim() === '') {
    return <p className="lista__vacio">Buscá por nombre o código para empezar</p>
  }
  if (resultados.length === 0) {
    return <p className="lista__vacio">No se encontraron productos</p>
  }

  return (
    <ul className="lista">
      {resultados.map((p) => {
        const copias = seleccionados.get(p.codigo)
        const activo = copias !== undefined

        return (
          <li
            key={p.codigo}
            className={`fila${activo ? ' fila--activa' : ''}`}
            onClick={() => onToggle(p.codigo)}
          >
            <div className="fila__check" aria-hidden="true">
              {activo ? '✓' : ''}
            </div>

            <div className="fila__info">
              <span className="fila__nombre">{p.nombre}</span>
              <span className="fila__codigo">{p.codigo}</span>
            </div>

            <div className="fila__precios">
              <span className="fila__lista">{pesos.format(p.final)}</span>
              <span className="fila__contado">{pesos.format(precioContado(p.final))} contado</span>
            </div>

            {activo && (
              <div
                className="stepper"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="stepper__btn"
                  onClick={() => onSetCopias(p.codigo, copias - 1)}
                  aria-label="Menos copias"
                >
                  −
                </button>
                <span className="stepper__n">{copias}</span>
                <button
                  type="button"
                  className="stepper__btn"
                  onClick={() => onSetCopias(p.codigo, copias + 1)}
                  aria-label="Más copias"
                >
                  +
                </button>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
