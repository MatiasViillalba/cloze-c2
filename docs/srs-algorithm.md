# El programador de repaso

## Qué se programa

No palabras: **patrones**. Cada hueco declara una clave de habilidad (`k`):

```js
{ n: 3, a: 'WHAT', k: 'what-pseudo-cleft-subject',      p: 'Pseudo-cleft' }
{ n: 1, a: 'WHAT', k: 'what-nominal-relative-subject',  p: 'Nominal relative clause' }
```

Misma palabra, dos habilidades distintas, programadas por separado. Se puede
tener automatizado `What I need is…` y seguir fallando
`with what are described as…`.

El banco actual tiene 555 claves.

## Cajas de Leitner

| Caja | Intervalo | Significado |
|---|---|---|
| 0 | mismo día | Sin ver, o recién fallado |
| 1 | 1 día | Reconocido con esfuerzo |
| 2 | 2 días | Empieza a asentarse |
| 3 | 4 días | Fiable en contexto conocido |
| 4 | 9 días | **Dominado** |
| 5 | 21 días | Automático |

```js
if (correct) box = Math.min(5, box + 1);
else         box = Math.max(0, box - 2);
due = Date.now() + INTERVALS[box] * DAY;
```

La asimetría es deliberada: subir cuesta un acierto, bajar cuesta dos cajas. Un
patrón que parecía asentado y se cae vuelve al circuito corto de inmediato.

## La cola de lapsus

Los intervalos por día no alcanzan: un fallo a las nueve de la noche que
reaparece "mañana" se olvida antes. Por eso, dentro de una sesión de ejercicios
rápidos, un fallo se reinserta **tres tarjetas más adelante**, una sola vez
(`assets/js/ui/drill.js`). El error se corrige mientras todavía está fresco, y
además queda reprogramado a días vista.

## Urgencia y selección

`CPE.srs.urgency(key)` puntúa cada patrón; cuanto más bajo, más urgente:

```
urgency = box − min(4, díasDeRetraso) × 0.6 + precisión × 1.2
```

Los patrones nunca vistos reciben 1.5: justo detrás de los fallos vencidos y por
delante de lo que ya funciona.

- **Ejercicios rápidos** — se ordenan las claves por urgencia y se toma una frase
  al azar de cada una, como máximo una por patrón para que la sesión no se atasque.
- **Textos de examen** — se puntúa cada texto por la urgencia acumulada de sus
  ocho patrones, con penalización por intentos previos, bonificación por días de
  descanso y una pizca de azar para que dos sesiones seguidas no se sientan
  mecánicas.

## Preparación e indicador de Grade A

```
readiness = patronesEnCaja≥4 / patronesTotales
```

Es una medida de cobertura, no de aciertos: acertar cien veces el mismo patrón
no mueve la aguja. El objetivo declarado es 90%.

## Bandas

Se reportan bandas Cambridge en vez de porcentajes crudos, porque un 6/8 y un
7/8 significan cosas distintas en la práctica:

| Puntaje | Banda |
|---|---|
| ≥ 90% | Grade A |
| ≥ 78% | Grade B |
| ≥ 65% | Grade C |
| ≥ 50% | Nivel C1 |
| < 50% | Sin banda |

## Racha

Una racha sobrevive a varias sesiones el mismo día y a una vuelta al día
siguiente; cualquier hueco mayor la reinicia a 1. El contador que se muestra en
la barra superior es la racha *viva*: si hace dos días que no aparecés, muestra
cero aunque el récord siga guardado.
