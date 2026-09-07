# Accesibilidad

Una app de estudio se usa cansado, con poca luz y a veces con una sola mano. Lo
que sigue no es una lista de cumplimiento: es lo que hace que se pueda seguir
usando a las once de la noche.

## Contraste

Sobre el lienzo `#050507`:

| Combinación | Ratio | Nivel |
|---|---|---|
| `--fg` `#F6F6F8` sobre lienzo | 18.9:1 | AAA |
| `--fg-soft` `#C9C9D2` (prosa de examen) | 12.4:1 | AAA |
| `--fg-dim` `#8B8B98` (texto secundario) | 6.2:1 | AA |
| `--ember-400` `#FF9A3D` (acentos) | 9.7:1 | AAA |
| `#1A0800` sobre botón naranja | 8.9:1 | AAA |

`--fg-mute` `#61616E` (3.2:1) queda por debajo de AA y se reserva para
etiquetas decorativas que nunca portan información única.

## El color nunca va solo

Acierto y error se distinguen por color, **y además** por: el texto de la
respuesta correcta añadido junto al hueco, una etiqueta ("Correcto" / "Pusiste:
X"), el borde izquierdo de la tarjeta de explicación y la animación de sacudida
en el fallo. Alguien con daltonismo rojo-verde pierde el color y conserva todo
lo demás.

## Objetivos táctiles

Ningún control interactivo baja de 44×44 px, el mínimo de las guías de Apple.
Los botones principales miden 52 px de alto. Los huecos de la prosa miden 38 px
de alto pero 108 de ancho, con área efectiva suficiente porque el texto que los
rodea no es interactivo.

## Teclado y foco

- Enter salta al hueco siguiente dentro de un texto; en el último, cierra el teclado.
- En los ejercicios rápidos, Enter corrige y el foco pasa al botón de avance, de
  modo que se puede hacer una ronda entera sin tocar la pantalla.
- Todos los controles son `<button>` o `<input>` reales: se pueden recorrer con
  teclado externo y VoiceOver los anuncia como lo que son.

## Lectores de pantalla

- Cada hueco lleva `aria-label="Hueco N"`.
- El fondo animado es `aria-hidden`.
- Los avisos usan `aria-live="polite"` en el contenedor de toasts.
- Los iconos decorativos llevan `aria-hidden="true"`; los que actúan solos
  (volver, sesión inteligente) llevan `aria-label`.

## Movimiento

Con `prefers-reduced-motion: reduce`, todas las animaciones caen a 0.001 ms y
las manchas del fondo se detienen. No se pierde ninguna información: el
movimiento nunca comunica nada por sí mismo.

## Tamaño de texto

Ajustes ofrece tres tamaños de lectura (17 / 18.5 / 21 px) con interlineado
proporcional. Se aplica solo a la prosa de examen, que es donde importa; la
interfaz mantiene su escala para que nada se rompa.

## Pendiente

- Recorrido de foco explícito al cambiar de pantalla (hoy el foco queda en el
  documento tras un `go()`).
- Anuncio del resultado por `aria-live` al corregir un texto completo.
