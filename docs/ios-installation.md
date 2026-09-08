# Instalación en iPhone

## Pasos

1. Abrí la URL de GitHub Pages **en Safari**. iOS solo permite instalar apps web
   desde Safari: desde Chrome o Firefox la opción no aparece.
2. Tocá **Compartir** (el cuadrado con la flecha hacia arriba).
3. Deslizá y elegí **Añadir a pantalla de inicio**.
4. Confirmá el nombre (aparece "Cloze C2") y tocá **Añadir**.
5. Abrila desde el ícono nuevo.

Desde ese momento se comporta como una app: pantalla completa, sin barra de
direcciones, con su propio conmutador de tareas.

## Comprobar que funciona sin conexión

1. Abrí la app una vez con conexión y esperá cinco segundos: el service worker
   descarga los 27 archivos del banco completo.
2. Activá el **modo avión**.
3. Cerrala del todo (deslizando hacia arriba en el conmutador de apps) y volvé a
   abrirla.

Debe arrancar normal, con todos los textos disponibles. Si aparece la pantalla
de error de Safari, el service worker no llegó a registrarse: volvé a abrirla
con conexión y dejala unos segundos.

## Qué hace que funcione

| Pieza | Efecto |
|---|---|
| `manifest.webmanifest` con `display: standalone` | Sin barra de direcciones |
| `apple-mobile-web-app-capable` | Lo mismo, para versiones de iOS antiguas |
| `apple-mobile-web-app-status-bar-style: black-translucent` | El fondo se extiende bajo el reloj |
| `apple-touch-icon.png` de 180×180 y opaco | Ícono real en la pantalla de inicio |
| `viewport-fit=cover` + `env(safe-area-inset-*)` | Nada queda bajo el notch ni bajo la barra de gestos |
| `sw.js` con precaché completo | Funciona en modo avión |

## Límites reales de iOS

Merece la pena conocerlos antes de que sorprendan:

- **No hay notificaciones push** salvo que la app esté instalada en la pantalla
  de inicio y con iOS 16.4 o superior. Esta app no las usa.
- **El almacenamiento se puede borrar.** Safari puede purgar los datos de un
  sitio que no se visita durante unas semanas. Instalada en la pantalla de
  inicio el riesgo baja mucho, pero no es cero: por eso conviene activar
  **Ajustes → Sincronización**, que además mantiene una copia en la nube.
- **La vibración no existe.** `navigator.vibrate` no está implementado en iOS.
  El interruptor de vibración de Ajustes no hace nada en el iPhone; se mantiene
  porque sí funciona en Android.
- **Cada navegador tiene su almacén.** El progreso hecho en la pestaña de Safari
  y el de la app instalada pueden no ser el mismo. Conviene usar siempre el ícono.

## Actualizar la app

Al publicar una versión nueva, cambiá `CPE.BUILD` en `assets/js/version.js` y la
constante `BUILD` de `sw.js`. Eso invalida el caché anterior: la próxima vez que
la app se abra con conexión, descarga todo de nuevo y borra lo viejo. El progreso
no se toca, porque vive en `localStorage` y no en el caché.
