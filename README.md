# nano-precios

Herramienta web interna para imprimir carteles de precios.

- **Standalone y 100% client-side.** No tiene backend, no usa Sanity, no persiste datos
  (todo vive en memoria mientras la pestaña está abierta).
- **Stack:** React + TypeScript + Vite.
- **Única dependencia de runtime:** [`xlsx`](https://sheetjs.com) (SheetJS), instalada desde
  el CDN oficial de SheetJS (`xlsx-0.20.3`) para evitar las versiones vulnerables del
  registro público de npm.

## Scripts

| Comando              | Qué hace                                  |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Servidor de desarrollo de Vite            |
| `npm run build`      | Type-check + build de producción          |
| `npm test`           | Corre los tests con Vitest (una vez)      |
| `npm run test:watch` | Vitest en modo watch                      |
| `npm run lint`       | oxlint                                    |

## Estado actual

Fase 1: scaffold + lógica pura con tests. La UI todavía no está construida
(`src/App.tsx` es un placeholder).

### Módulos de lógica (`src/lib/`)

- **`precioContado.ts`** — aplica el 7% de descuento por pago en efectivo y redondea hacia
  abajo según el tramo de precio (fórmula confirmada con el cliente, no modificar).
- **`limpiarPrecio.ts`** — normaliza un precio en formato argentino (`"3.093,30"`) a un
  entero. Devuelve `null` si el valor es inválido o vacío.
- **`parseExcel.ts`** — lee la primera hoja de un `.xlsx` y devuelve solo las columnas que
  usa el cartel (`código de barras`, `producto`, `final`). El resto de las columnas se
  ignora. Si falta alguna requerida, devuelve `productos: []` y la lista en
  `columnasFaltantes`.
