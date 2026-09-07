# Modelo de contenido

## Dos formatos

### Texto de examen (`passage`)

Réplica de la Part 2: prosa continua de nivel C2 con ocho huecos numerados.

```js
{
  id: 'p37',
  title: 'The Nomad Question',
  source: 'Digital Nomads',            // texto original del que salen los patrones
  focus: 'Concesivas con HOWEVER…',    // etiqueta corta para la biblioteca
  brief: 'HOWEVER appealing · cite AS · take a toll ON · …',
  text: `{1} appealing the lifestyle may sound…`,   // marcadores {1}…{8}
  gaps: [
    {
      n: 1,
      a: 'HOWEVER',                    // respuesta canónica, siempre en mayúsculas
      alt: [],                         // alternativas aceptadas
      k: 'however-adjective-concessive-clause',    // clave de habilidad
      p: 'Concesiva con HOWEVER',      // etiqueta del patrón
      tip: 'HOWEVER appealing the lifestyle may sound = por muy atractivo que suene…'
    }
  ]
}
```

Los párrafos se separan con una línea en blanco dentro del literal de plantilla.
El primero recibe capitular naranja automáticamente.

### Ejercicio rápido (`drill`)

Una frase, un hueco `{1}`, la misma clave de habilidad.

```js
{
  id: 'd297', a: 'HOWEVER', k: 'however-adjective-concessive-clause',
  p: 'Concesiva con HOWEVER', src: 'Refuerzo',
  s: '{1} carefully the data is collected, some error is unavoidable.',
  tip: 'HOWEVER carefully = por muy cuidadosamente que.'
}
```

## Reglas

Las verifica `tests/content-integrity.test.mjs` y son de cumplimiento obligatorio:

1. Ocho huecos por texto, ni más ni menos.
2. Los marcadores `{n}` de la prosa coinciden en número y orden con `gaps[]`.
3. Los identificadores son únicos en todo el banco.
4. Toda respuesta es **una sola palabra** (el examen no admite otra cosa).
5. Toda respuesta va en mayúsculas.
6. Todo hueco declara `k`, `p` y un `tip` de más de 20 caracteres.
7. Ninguna alternativa repite la respuesta canónica.
8. La respuesta canónica siempre se acepta, en minúsculas y con espacios sobrantes.
9. Ninguna clave de habilidad queda registrada sin ejercicios que la practiquen.

## Cómo se corrige una respuesta

`CPE.util.norm()` normaliza antes de comparar: recorta, pasa a minúsculas,
descompone tildes, unifica apóstrofos tipográficos (`’` → `'`) y descarta
puntuación. Así `everyone's`, `EVERYONE’S` y `  Everyone's  ` son la misma
respuesta, pero `everyone` no lo es.

`alt` existe para los casos en que el examen acepta más de una palabra:
`THOUGH` / `ALTHOUGH` en una concesiva, `AFTER` / `FOLLOWING` en una secuencia
temporal. No se usa para tolerar errores.

## Cobertura actual

| Archivo | Contenido |
|---|---|
| `passages-01…03` | Colocaciones, phrasal verbs, preposiciones dependientes |
| `passages-04…05` | Pseudo-clefts, relativos formales, cuantificadores idiomáticos |
| `passages-06` | Referencia, sustitución y primeras inversiones |
| `passages-07…08` | El núcleo C2: inversión negativa, concesivas antepuestas, condicionales invertidos |
| `drills-01` | Fuentes sueltas + refuerzo de colocaciones y modismos |
| `drills-02` | Registros abstractos: relaciones, cognición, tercer sector, comida, lengua |
| `drills-03` | Material de Grade A: inversiones, concesivas, relativos con preposición |

## Añadir material

1. Escribí el texto o la frase en el archivo correspondiente de `assets/js/data/`.
2. Reutilizá una `k` existente si el patrón ya está en el banco: así el
   programador acumula evidencia en vez de dispersarla en claves casi idénticas.
3. Si creás un archivo nuevo, agregalo a `index.html` **y** a la lista `ASSETS`
   de `sw.js`, o no se cacheará.
4. `npm test`.
