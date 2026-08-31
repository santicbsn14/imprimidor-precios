import type { Formato, ProductoCartel } from '../types'
import Cartel from './Cartel'

type Props = {
  carteles: ProductoCartel[]
  formato: Formato
}

/**
 * Una página A4. El grid (1x2 en grande, 2x3 en mediano) y las medidas reales
 * las define print.css según la clase de formato.
 */
export default function Hoja({ carteles, formato }: Props) {
  return (
    <div className={`hoja hoja--${formato}`}>
      <div className="hoja__grid">
        {carteles.map((producto, i) => (
          <Cartel key={`${producto.codigo}-${i}`} producto={producto} />
        ))}
      </div>
    </div>
  )
}
