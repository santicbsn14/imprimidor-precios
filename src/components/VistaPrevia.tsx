import { useMemo } from 'react'
import type { SeleccionadoDetalle } from '../hooks/usePrecios'
import { paginarCarteles } from '../lib/paginarCarteles'
import type { Formato } from '../types'
import Hoja from './Hoja'
import '../styles/print.css'

const POR_HOJA: Record<Formato, number> = { grande: 2, mediano: 6 }

type Props = {
  seleccionadosDetalle: SeleccionadoDetalle[]
  formato: Formato
  setFormato: (formato: Formato) => void
}

export default function VistaPrevia({ seleccionadosDetalle, formato, setFormato }: Props) {
  const paginas = useMemo(
    () => paginarCarteles(seleccionadosDetalle, POR_HOJA[formato]),
    [seleccionadosDetalle, formato],
  )

  const totalCarteles = paginas.reduce((acc, p) => acc + p.length, 0)

  if (paginas.length === 0) {
    return (
      <div className="preview-placeholder no-print">
        <p>No hay productos seleccionados para imprimir.</p>
      </div>
    )
  }

  return (
    <div className="preview">
      <div className="preview__header no-print">
        <div className="preview__formato">
          <button
            type="button"
            className={`chip${formato === 'grande' ? ' chip--activo' : ''}`}
            onClick={() => setFormato('grande')}
          >
            Grande
          </button>
          <button
            type="button"
            className={`chip${formato === 'mediano' ? ' chip--activo' : ''}`}
            onClick={() => setFormato('mediano')}
          >
            Mediano
          </button>
        </div>

        <span className="preview__contador">
          {paginas.length} hoja{paginas.length === 1 ? '' : 's'} · {totalCarteles} cartel
          {totalCarteles === 1 ? '' : 'es'}
        </span>

        <button type="button" className="btn btn--primario" onClick={() => window.print()}>
          Imprimir
        </button>
      </div>

      <div className="zona-impresion">
        {paginas.map((carteles, i) => (
          <Hoja key={i} carteles={carteles} formato={formato} />
        ))}
      </div>
    </div>
  )
}
