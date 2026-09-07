# Sistema de diseño — "Ember"

## Intención

Negro profundo con un naranja de alta energía. La app tiene que dar ganas de
abrirse a las siete de la mañana y no parecer un formulario. La regla operativa:
el naranja se gana, no se reparte. Aparece en lo que hay que tocar, en lo que
mide progreso y en la respuesta correcta; nunca como decoración de fondo.

## Tokens

Todo vive en `assets/css/tokens.css`. Ningún componente inventa un color.

### Superficies

| Token | Valor | Uso |
|---|---|---|
| `--ink-1000` | `#050507` | Lienzo de la app |
| `--ink-900` | `#08080B` | Barras, `theme-color` |
| `--surface` | `rgba(255,255,255,.045)` | Tarjetas y filas |
| `--line` | `rgba(255,255,255,.09)` | Bordes de un píxel |

### Marca

| Token | Valor |
|---|---|
| `--ember-500` | `#FF6A00` |
| `--ember-400` | `#FF9A3D` |
| `--ember-grad` | `linear-gradient(135deg, #FF9A3D, #FF6A00 45%, #EE4A00)` |

### Semántica

`--good #35D07F` para acierto, `--bad #FF4D5E` para fallo, `--warn #FFC531` para
avisos. Nunca se usa solo el color para comunicar: siempre va acompañado de la
respuesta correcta escrita, de un icono o de una etiqueta.

## Tipografía

Dos familias, con propósitos separados:

- **Interfaz** — la pila del sistema (`-apple-system`, o sea SF Pro en iOS).
  Se ve nativa porque lo es, y no cuesta ni un byte de descarga.
- **Lectura** — `New York` / `Iowan Old Style` / Georgia, serif, para los textos
  de examen. La prosa de examen se lee en serif; un texto de Cambridge en
  interfaz de sistema se siente como una notificación, no como una lectura.

El tamaño del cuerpo de lectura es ajustable (`--read-size`: 17 / 18.5 / 21 px)
desde Ajustes, aplicado con `data-textsize` en `:root`.

## Espacio y forma

Radios de 8 a 32 px; las tarjetas usan 24, los botones 18, los chips píldora.
El padding base es 20 px, que coincide con el margen cómodo del iPhone 15 en
vertical.

## Movimiento

- `--ease-out: cubic-bezier(.22,1,.36,1)` para entradas y transiciones.
- `--ease-spring: cubic-bezier(.34,1.56,.64,1)` para lo que debe sentirse físico
  (el interruptor, el botón central, la nota de resultado).
- Duraciones de 140 / 260 / 460 ms. Nada supera el medio segundo.
- `.stagger` escalona la entrada de las tarjetas 45 ms por elemento.
- El fondo tiene tres manchas naranjas que derivan lentamente (26–38 s) con
  `filter: blur(70px)`. Da profundidad sin pedir nada al hilo principal.

Con `prefers-reduced-motion: reduce`, todas las duraciones caen a 0.001 ms y las
manchas se detienen.

## El hueco

El componente central de la app. Un `<input>` en línea dentro de la prosa, con
subrayado naranja de 2 px, número de hueco flotante y ancho fijo de 108 px para
que no revele la longitud de la respuesta.

Detalles que importan en iOS:

- `font-size: 16px` como mínimo, o Safari hace zoom al enfocar.
- `autocapitalize="characters"`, `autocorrect="off"`, `spellcheck="false"`:
  el autocorrector de iOS convierte respuestas válidas en otras palabras.
- `enterkeyhint="next"` y salto al hueco siguiente con Enter.
- Al corregir: verde o rojo, la respuesta correcta añadida al lado en una píldora
  y `readOnly` para que el estado no se pueda alterar después.
