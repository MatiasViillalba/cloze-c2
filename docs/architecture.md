# Arquitectura

## Principio

La app tiene que abrirse desde el ícono de la pantalla de inicio, en modo avión,
en menos de un segundo. Todo lo demás se subordina a eso.

No hay framework, ni bundler, ni paso de build. Los archivos que escribís son
exactamente los que ejecuta el teléfono. Eso elimina una clase entera de
problemas (versiones de dependencias, source maps, hidratación) a cambio de
disciplina en el código.

## Capas

```
index.html          Shell: topbar, 7 pantallas vacías, tab bar, sheet
  ├─ assets/css/    5 hojas en cascada: tokens → base → components → screens → animations
  ├─ assets/js/
  │   ├─ version.js       Identidad de build (namespace del caché del SW)
  │   ├─ core/util.js     Hyperscript el(), normalización de respuestas, PRNG, fechas
  │   ├─ core/sync-config.js  Credenciales publicables del endpoint de sync
  │   ├─ core/store.js    Estado persistente en localStorage + racha
  │   ├─ core/sync.js     Fusión de estados y sincronización con la nube
  │   ├─ core/srs.js      Cajas de Leitner, vencimientos, bandas Cambridge
  │   ├─ core/content.js  Registro, índice por patrón y selección de ejercicios
  │   ├─ data/*.js        11 archivos de contenido que se auto-registran
  │   ├─ ui/*.js          Una pantalla por archivo, sin estado compartido
  │   └─ app.js           Router, sesiones y arranque
  └─ sw.js            Precaché completo, cache-first
```

Cada archivo es un IIFE que recibe `window.CPE` y le cuelga su parte. El orden
de los `<script>` en `index.html` es la única dependencia: núcleo, datos,
pantallas, router.

## Flujo de arranque

1. `version.js` crea el namespace `CPE`.
2. El núcleo registra `util`, `store`, `srs` y `content`.
3. Los 11 archivos de datos llaman a `CPE.content.registerPassages` /
   `registerDrills`, que además construye el índice `skills`
   (patrón → ejercicios que lo practican).
4. Las pantallas se registran en `CPE.ui`.
5. `app.js` corre `boot()`: carga el estado, inyecta el degradado del anillo,
   aplica el tamaño de texto, cablea la navegación, va a Inicio y registra el
   service worker.

## Enrutado

`CPE.app.go(name, params)` desactiva todas las pantallas, activa
`#screen-<name>` y llama a `CPE.ui[name].render(host, params)`. Cada pantalla
redibuja desde cero: no hay diffing ni estado retenido entre visitas, lo cual es
viable porque el árbol más pesado (un texto de examen) son unos 60 nodos.

Las pantallas de examen declaran `immersive: true`, lo que oculta la tab bar
mediante `data-immersive` en `#app`.

## Por qué scripts clásicos y no módulos ES

Los módulos exigen resolución por red o por sistema de archivos con CORS. Bajo
`file://` fallan, y bajo un service worker añaden peticiones que hay que cachear
individualmente. Un script clásico ya está en el caché o no está.

## Estado

Todo vive en un único registro de `localStorage` (`cpe.cloze.state.v1`), con
escrituras agrupadas cada 220 ms porque la pantalla de examen corrige ocho
huecos de golpe. Si el navegador prohíbe el almacenamiento (modo privado), el
estado cae a memoria y la pantalla de Ajustes lo advierte en vez de fallar en
silencio.

## Sincronización

`localStorage` es por dispositivo, así que ese mismo registro se sube tal cual a
una fila de Postgres identificada por un código de 16 caracteres. `sync.js` no
tiene servidor propio: habla por HTTP con dos funciones SQL y nada más.

El punto delicado es la fusión, y se resuelve sin coordinador: `mergeStates` es
idempotente y conmutativa (máximo sobre contadores, gana-el-más-reciente sobre
decisiones), de modo que dos dispositivos convergen al mismo estado sin importar
el orden ni cuántas veces se sincronicen. La escritura usa control optimista por
revisión, así que dos subidas simultáneas no se pisan. Detalle completo en
[sync.md](sync.md).

Nada de esto está en el camino crítico del arranque: si la red falla o el
endpoint no está configurado, la app es exactamente la de antes.
