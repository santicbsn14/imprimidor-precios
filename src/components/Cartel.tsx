import { precioContado } from '../lib/precioContado'
import type { ProductoCartel } from '../types'

type Props = {
  producto: ProductoCartel
}

/**
 * Íconos placeholder — SVG inline monocromo negro que imitan los del cartel del
 * Excel. Tamaño controlado por la variable CSS --icono-size (clase .cartel__icono).
 * Reemplazables por <img src="..."> con los PNG reales sin tocar el layout.
 */
function IconoBillete() {
  return (
    <svg
      className="cartel__icono"
      viewBox="0 0 48 32"
      fill="none"
      stroke="#0a0a0a"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="45" height="29" rx="3" />
      <circle cx="24" cy="16" r="6.5" />
      <path d="M8 8h.01M40 24h.01" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function IconoTarjetas() {
  return (
    <svg
      className="cartel__icono"
      viewBox="0 0 48 40"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="10.5"
        width="34"
        height="23"
        rx="3"
        fill="#ffffff"
        stroke="#0a0a0a"
        strokeWidth="2.5"
      />
      <rect
        x="12.5"
        y="5.5"
        width="34"
        height="23"
        rx="3"
        fill="#ffffff"
        stroke="#0a0a0a"
        strokeWidth="2.5"
      />
      <path d="M12.5 13h34" stroke="#0a0a0a" strokeWidth="3" />
      <path d="M17 22h9" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Cartel individual — replica el cartel del Excel del cliente: negro sobre
 * blanco, salvo el logo. Única fuente de verdad del diseño (pantalla e
 * impresión). Todo el dimensionamiento sale de las custom properties por
 * formato definidas en print.css — sin tamaños hardcodeados acá.
 */
export default function Cartel({ producto }: Props) {
  const contado = precioContado(producto.final)

  return (
    <div className="cartel">
      <p className="cartel__nombre">{producto.nombre}</p>
      <p className="cartel__codigo">{producto.codigo}</p>

      <div className="cartel__oferta">
        <img className="cartel__logo" src="/logo-nano.png" alt="Nano" />
        <span className="cartel__oferta-label">OFERTA EFECTIVO:</span>
        <IconoBillete />
      </div>

      <div className="cartel__precio">
        <span className="cartel__precio-simbolo">$</span>
        <span className="cartel__precio-num">{String(contado)}</span>
      </div>

      <div className="cartel__debito">
        <span className="cartel__debito-label">DEBITO/CREDITO/TRANSFERENCIA/QR</span>
        <IconoTarjetas />
      </div>

      <p className="cartel__lista">{`$ ${producto.final.toLocaleString('es-AR')}`}</p>
    </div>
  )
}
