import { useCallback, useMemo, useState } from 'react'
import { filtrarProductos } from '../lib/filtrarProductos'
import type { Formato, ProductoCartel } from '../types'

export type Paso = 'carga' | 'seleccion' | 'preview'

export type SeleccionadoDetalle = { producto: ProductoCartel; copias: number }

/** Estado central de la app, todo en memoria. */
export function usePrecios() {
  const [paso, setPaso] = useState<Paso>('carga')
  const [productos, setProductos] = useState<ProductoCartel[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [formato, setFormato] = useState<Formato>('grande')
  // Map<codigo, copias>. Independiente del filtro actual: la selección persiste
  // aunque cambie la búsqueda.
  const [seleccionados, setSeleccionados] = useState<Map<string, number>>(new Map())

  const resultados = useMemo(
    () => filtrarProductos(productos, busqueda),
    [productos, busqueda],
  )

  const porCodigo = useMemo(() => {
    const m = new Map<string, ProductoCartel>()
    for (const p of productos) m.set(p.codigo, p)
    return m
  }, [productos])

  const seleccionadosDetalle = useMemo<SeleccionadoDetalle[]>(() => {
    const detalle: SeleccionadoDetalle[] = []
    for (const [codigo, copias] of seleccionados) {
      const producto = porCodigo.get(codigo)
      if (producto) detalle.push({ producto, copias })
    }
    return detalle
  }, [seleccionados, porCodigo])

  const totalSeleccionados = seleccionados.size
  const totalCarteles = useMemo(() => {
    let n = 0
    for (const copias of seleccionados.values()) n += copias
    return n
  }, [seleccionados])

  const cargarProductos = useCallback((nuevos: ProductoCartel[]) => {
    setProductos(nuevos)
    setBusqueda('')
    setSeleccionados(new Map())
    setPaso('seleccion')
  }, [])

  const toggleSeleccion = useCallback((codigo: string) => {
    setSeleccionados((prev) => {
      const next = new Map(prev)
      if (next.has(codigo)) next.delete(codigo)
      else next.set(codigo, 1)
      return next
    })
  }, [])

  const setCopias = useCallback((codigo: string, n: number) => {
    const copias = Math.max(1, Math.floor(Number.isFinite(n) ? n : 1))
    setSeleccionados((prev) => {
      if (!prev.has(codigo)) return prev
      const next = new Map(prev)
      next.set(codigo, copias)
      return next
    })
  }, [])

  const quitarSeleccion = useCallback((codigo: string) => {
    setSeleccionados((prev) => {
      if (!prev.has(codigo)) return prev
      const next = new Map(prev)
      next.delete(codigo)
      return next
    })
  }, [])

  const irAPreview = useCallback(() => setPaso('preview'), [])
  const volverASeleccion = useCallback(() => setPaso('seleccion'), [])

  const reset = useCallback(() => {
    setProductos([])
    setBusqueda('')
    setSeleccionados(new Map())
    setFormato('grande')
    setPaso('carga')
  }, [])

  return {
    paso,
    productos,
    busqueda,
    formato,
    resultados,
    seleccionados,
    totalSeleccionados,
    totalCarteles,
    seleccionadosDetalle,
    cargarProductos,
    setBusqueda,
    toggleSeleccion,
    setCopias,
    quitarSeleccion,
    setFormato,
    irAPreview,
    volverASeleccion,
    reset,
  }
}

export type UsePrecios = ReturnType<typeof usePrecios>
