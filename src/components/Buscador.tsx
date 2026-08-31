import { useEffect, useRef } from 'react'

type Props = {
  value: string
  onChange: (valor: string) => void
}

export default function Buscador({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="buscador">
      <input
        ref={inputRef}
        className="buscador__input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o código de barra..."
      />
      {value !== '' && (
        <button
          type="button"
          className="buscador__limpiar"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >
          ×
        </button>
      )}
    </div>
  )
}
