import { useState } from 'react'
import type { SeleccionadoDetalle } from '../hooks/usePrecios'
import type { Formato } from '../types'

type Props = {
  totalSeleccionados: number
  totalCarteles: number
  formato: Formato
  seleccionadosDetalle: SeleccionadoDetalle[]
  onSetFormato: (formato: Formato) => void
  onVerImprimir: () => void
  onQuitar: (codigo: string) => void
}

export default function BarraSeleccion({
  totalSeleccionados,
  totalCarteles,
  formato,
  seleccionadosDetalle,
  onSetFormato,
  onVerImprimir,
  onQuitar,
}: Props) {
  const [abierto, setAbierto] = useState(false)
  const vacio = totalSeleccionados === 0

  return (
    <div className="barra">
      {abierto && !vacio && (
        <div className="barra__panel">
          <ul className="barra__detalle">
            {seleccionadosDetalle.map(({ producto, copias }) => (
              <li key={producto.codigo} className="barra__item">
                <span className="barra__item-nombre">{producto.nombre}</span>
                <span className="barra__item-copias">{copias} u.</span>
                <button
                  type="button"
                  className="barra__quitar"
                  onClick={() => onQuitar(producto.codigo)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="barra__fila">
        <button
          type="button"
          className="barra__resumen"
          onClick={() => setAbierto((v) => !v)}
          disabled={vacio}
        >
          {totalSeleccionados} producto{totalSeleccionados === 1 ? '' : 's'} ·{' '}
          {totalCarteles} cartel{totalCarteles === 1 ? '' : 'es'}
          {!vacio && <span className="barra__chevron">{abierto ? '▾' : '▴'}</span>}
        </button>

        <div className="barra__formato">
          <button
            type="button"
            className={`chip${formato === 'grande' ? ' chip--activo' : ''}`}
            onClick={() => onSetFormato('grande')}
          >
            Grande
          </button>
          <button
            type="button"
            className={`chip${formato === 'mediano' ? ' chip--activo' : ''}`}
            onClick={() => onSetFormato('mediano')}
          >
            Mediano
          </button>
        </div>

        <button
          type="button"
          className="btn btn--primario"
          onClick={onVerImprimir}
          disabled={vacio}
        >
          Ver e imprimir
        </button>
      </div>
    </div>
  )
}
