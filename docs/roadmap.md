# Qué falta

La versión 1.0 cubre el objetivo declarado: practicar Open Cloze sin conexión,
sobre una lista concreta de patrones, con repaso que insiste en los fallos.
Lo que sigue es lo que mejoraría de verdad el resultado en el examen.

## Próximo

- **Modo contrarreloj.** La Part 2 se hace en unos ocho minutos. Un temporizador
  opcional por texto, con el reparto de tiempo por hueco al terminar, revelaría
  dónde se pierde el tiempo real.
- **Repaso solo de errores por texto.** Hoy se puede repetir un texto entero o
  practicar los patrones fallados sueltos. Falta el punto medio: el mismo texto
  con únicamente los huecos que se fallaron.
- **Anuncio del resultado por lector de pantalla** al corregir
  (ver [accessibility.md](accessibility.md)).
- **Foco explícito al cambiar de pantalla**, hoy queda en el documento.

## Contenido

- Segundo banco de textos sobre las mismas 555 claves. Cuanto más contextos
  distintos vea un patrón, más se transfiere al examen real.
- Marcar los textos con dificultad estimada a partir de la tasa de acierto
  observada, y usarla en la selección.
- Notas de registro: distinguir explícitamente lo que es formal, literario o
  neutro, que es donde el C2 separa bandas.

## Motor

- **Intervalos adaptativos.** Hoy las cajas son fijas. Ajustar el intervalo según
  la latencia de respuesta (SM-2 ligero) daría repasos más ajustados, a costa de
  bastante complejidad. Merece un experimento antes que una implementación.
- **Previsión de examen.** Con fecha de examen y ritmo actual, estimar si se
  llega al 90% de patrones dominados, y cuántos huecos diarios harían falta.

## Fuera de alcance deliberadamente

- **Cuentas y sincronización.** Obligarían a un servidor, una política de
  privacidad y una conexión. El progreso se lleva con exportar/importar.
- **Las otras partes del examen.** Esta app hace una cosa. Un entrenador de Key
  Word Transformation sería otra app, no una pestaña más.
- **Anuncios o compras.** No.
