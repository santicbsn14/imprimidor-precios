import BarraSeleccion from './components/BarraSeleccion'
import Buscador from './components/Buscador'
import CargaExcel from './components/CargaExcel'
import ListaProductos from './components/ListaProductos'
import VistaPrevia from './components/VistaPrevia'
import { usePrecios } from './hooks/usePrecios'

function App() {
  const p = usePrecios()

  if (p.paso === 'carga') {
    return (
      <main className="app app--carga">
        <CargaExcel onCargar={p.cargarProductos} />
      </main>
    )
  }

  if (p.paso === 'preview') {
    return (
      <main className="app app--preview">
        <button
          type="button"
          className="btn btn--volver no-print"
          onClick={p.volverASeleccion}
        >
          ← Volver
        </button>
        <VistaPrevia
          seleccionadosDetalle={p.seleccionadosDetalle}
          formato={p.formato}
          setFormato={p.setFormato}
        />
      </main>
    )
  }

  return (
    <main className="app app--seleccion">
      <header className="app__header">
        <div>
          <h1 className="app__titulo">nano-precios</h1>
          <p className="app__meta">{p.productos.length} productos en la lista</p>
        </div>
        <button type="button" className="btn btn--secundario" onClick={p.reset}>
          Cargar otro Excel
        </button>
      </header>

      <Buscador value={p.busqueda} onChange={p.setBusqueda} />

      <ListaProductos
        busqueda={p.busqueda}
        resultados={p.resultados}
        seleccionados={p.seleccionados}
        onToggle={p.toggleSeleccion}
        onSetCopias={p.setCopias}
      />

      <BarraSeleccion
        totalSeleccionados={p.totalSeleccionados}
        totalCarteles={p.totalCarteles}
        formato={p.formato}
        seleccionadosDetalle={p.seleccionadosDetalle}
        onSetFormato={p.setFormato}
        onVerImprimir={p.irAPreview}
        onQuitar={p.quitarSeleccion}
      />
    </main>
  )
}

export default App
