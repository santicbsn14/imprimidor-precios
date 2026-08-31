import { useRef, useState } from 'react'
import { parseExcel } from '../lib/parseExcel'
import type { ProductoCartel } from '../types'

type Props = {
  onCargar: (productos: ProductoCartel[]) => void
}

const COLUMNAS_ESPERADAS = ['código de barras', 'producto', 'final']

export default function CargaExcel({ onCargar }: Props) {
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function procesarArchivo(file: File) {
    setProcesando(true)
    setError(null)
    try {
      const { productos, columnasFaltantes } = await parseExcel(file)

      if (columnasFaltantes.length > 0) {
        setError(
          `Faltan columnas en el Excel: ${columnasFaltantes.join(', ')}. ` +
            `Se esperan: ${COLUMNAS_ESPERADAS.join(', ')}.`,
        )
        return
      }
      if (productos.length === 0) {
        setError('No se encontraron productos válidos en el archivo.')
        return
      }
      onCargar(productos)
    } catch {
      setError('No se pudo leer el archivo. ¿Es un Excel válido (.xlsx / .xls)?')
    } finally {
      setProcesando(false)
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void procesarArchivo(file)
    e.target.value = ''
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void procesarArchivo(file)
  }

  return (
    <div className="carga">
      <h1 className="carga__titulo">nano-precios</h1>
      <p className="carga__subtitulo">Subí el Excel de la lista para empezar</p>

      <div
        className={`dropzone${dragActive ? ' dropzone--activa' : ''}${
          procesando ? ' dropzone--procesando' : ''
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="dropzone__input"
          onChange={onInputChange}
        />
        {procesando ? (
          <p className="dropzone__texto">Procesando archivo…</p>
        ) : (
          <>
            <p className="dropzone__texto">
              Arrastrá el Excel acá o <span className="dropzone__link">elegí un archivo</span>
            </p>
            <p className="dropzone__hint">Formatos: .xlsx, .xls</p>
          </>
        )}
      </div>

      {error && <p className="carga__error">{error}</p>}
    </div>
  )
}
