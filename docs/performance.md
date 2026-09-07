# Rendimiento

## Presupuesto real

Medido sobre los archivos que sirve el repositorio, sin comprimir:

| Recurso | Tamaño |
|---|---|
| `index.html` | 6 KB |
| CSS (5 archivos) | 35 KB |
| Núcleo JS (`version` + `core/`) | 18 KB |
| Interfaz (`ui/` + `app.js`) | 40 KB |
| **Banco de contenido** (`data/`) | **212 KB** |
| Iconos PNG (4) | 79 KB |
| **Total precacheado** | **~390 KB** |

Servido por GitHub Pages con gzip, el JavaScript y el CSS bajan a algo más de
80 KB en la red. Es una descarga única: a partir de la instalación, la app no
vuelve a pedir nada.

## Dónde está el peso

El 68% del código son datos: 48 textos, 300 frases y 555 explicaciones. Eso es
exactamente lo que debería pesar en una app de estudio. No hay ni una línea de
framework, ni polyfills, ni fuentes descargadas: la tipografía es la del
sistema.

## Estrategia de caché

`sw.js` precachea los 27 archivos en el evento `install`. Cada uno se añade con
su propio `catch`, de modo que un recurso ausente no aborta el precaché entero
—el fallo silencioso de un `cache.addAll()` es la causa habitual de una PWA que
"a veces" no funciona offline.

En `fetch` la estrategia es **cache-first** sin revalidación. Se puede sostener
porque el contenido es estático y está versionado con el build: no hay nada que
pueda cambiar en el servidor sin cambiar también `CPE.BUILD`, que es el nombre
del caché. Ventaja práctica: cero latencia y cero consumo de datos móviles.

Al activarse una versión nueva, `activate` borra todos los cachés cuyo nombre no
coincida con el actual.

## Coste de renderizado

Cada pantalla se redibuja desde cero al entrar. El árbol más pesado es un texto
de examen: unos 60 nodos, incluidos los ocho `<input>`. Reconstruirlo cuesta
menos de un milisegundo y elimina toda una clase de errores de estado obsoleto.

La lista de la biblioteca (48 filas) y la tabla de patrones de Progreso (hasta
555 filas) son las únicas listas largas. La tabla se limita con
`max-height: 460px` y desplazamiento propio, en lugar de virtualizarse: a este
tamaño, el DOM es más barato que la maquinaria de virtualización.

## Detalles que se notan en el teléfono

- Las manchas del fondo usan `filter: blur(70px)` y solo animan `transform`, lo
  que las mantiene en el compositor y fuera del hilo principal.
- `-webkit-overflow-scrolling: touch` en los contenedores desplazables.
- `overscroll-behavior-y: none` en `body`: no aparece el rebote de la página
  detrás de la app.
- `touch-action: manipulation` elimina el retardo de 300 ms del doble toque.
- Las escrituras en `localStorage` se agrupan cada 220 ms, porque corregir un
  texto genera ocho actualizaciones seguidas del estado.

## Cómo medirlo

```bash
npm run serve
```

Luego, en las herramientas de desarrollo: pestaña Network con *Disable cache*
para la primera carga, y Application → Service Workers para confirmar que el
precaché terminó. En el iPhone, la prueba definitiva sigue siendo el modo avión.
