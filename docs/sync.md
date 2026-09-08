# Sincronización entre dispositivos

Sin esto, el progreso vive en `localStorage`, que es **por navegador y por
dispositivo**: lo que estudiás en el celular no existe para la notebook. Este
documento explica cómo conectar la app a una base de datos en la nube para que
los dos vean lo mismo.

Son cinco minutos y se hace **una sola vez**.

---

## Por qué no sirve Postgres en tu máquina

Aunque tengas PostgreSQL o MySQL instalados, no alcanzan para esto:

1. **El navegador no habla el protocolo de una base de datos.** Postgres y MySQL
   usan su propio protocolo binario sobre TCP; el JavaScript de una página solo
   puede hacer HTTP. Siempre hace falta un servidor intermedio que traduzca.
2. **`localhost` es local.** Tu celular con datos móviles no llega a tu notebook.
   Habría que exponer la base a internet con IP pública y puertos abiertos: malo
   por seguridad y frágil porque la IP hogareña cambia sola.
3. **La notebook tendría que estar prendida siempre**, incluso mientras estudiás
   en el colectivo.

**Supabase es PostgreSQL** — la misma base, alojada, con una capa HTTP encima
(PostgREST). Todo lo que sabés de Postgres sigue valiendo: tablas, funciones,
índices y un editor SQL. La única diferencia es dónde corre.

---

## Puesta en marcha

### 1. Crear el proyecto

1. Entrá a <https://supabase.com> y creá una cuenta (el plan gratuito sobra:
   este proyecto guarda una fila de unos pocos cientos de KB).
2. **New project**. Elegí un nombre, una contraseña para la base — guardala,
   aunque la app no la usa — y la región más cercana (São Paulo).
3. Esperá a que termine de aprovisionar, un par de minutos.

### 2. Crear las tablas y funciones

1. En el panel del proyecto, abrí **SQL Editor** → **New query**.
2. Pegá el contenido completo de [`scripts/supabase-setup.sql`](../scripts/supabase-setup.sql)
   y ejecutalo (**Run**).
3. Tiene que decir *Success*. El script es idempotente: se puede volver a
   ejecutar sin romper nada.

### 3. Conectar la app

1. En el panel, **Project Settings** → **API**. Copiá dos valores:
   - **Project URL**, del tipo `https://abcdefghijklm.supabase.co`
   - **anon public**, una clave larga que empieza con `eyJ...`
2. Pegalos en [`assets/js/core/sync-config.js`](../assets/js/core/sync-config.js):

   ```js
   window.CPE.SYNC_CONFIG = {
     url: 'https://abcdefghijklm.supabase.co',
     anonKey: 'eyJhbGciOi...'
   };
   ```

3. Subí el cambio y esperá a que GitHub Pages lo publique:

   ```powershell
   git add -A
   git commit -m "feat(sync): conectar el proyecto de Supabase"
   git push
   ```

> **Importante:** cada vez que cambie algún archivo hay que subir también el
> `BUILD` de `assets/js/version.js` y de `sw.js`. El service worker cachea todo
> de forma agresiva y ese número es lo que invalida el caché viejo.

### 4. Vincular los dispositivos

Empezá **por el dispositivo que tiene el progreso al día** — normalmente el
celular.

1. **En el celular:** Ajustes → Sincronización → **Activar** → *Crear un código
   nuevo*. Aparece un código de 16 caracteres tipo `K7M2-9QX4-BD3F-8VTR`.
   Copialo o anotalo.
2. **En la notebook:** Ajustes → Sincronización → **Activar** → *Ya tengo un
   código* → pegalo → **Vincular**.

Listo. La notebook se queda con todo lo del celular, y de ahí en más los dos se
mantienen al día solos.

---

## Cómo se comporta

**Cuándo sincroniza.** Al abrir la app, unos segundos después de cada respuesta
corregida, al volver a la pestaña, al recuperar la conexión y al cerrar la app.
También a mano, desde el botón *Sincronizar* de Ajustes.

**Sin conexión.** Nada se bloquea nunca. Si no hay señal, la sesión queda
marcada como pendiente y sube sola en cuanto vuelve. El modo avión sigue siendo
un modo de uso normal, no un problema.

**Qué pasa si estudiaste en los dos lados.** Cada sincronización es
*bajar → fusionar → subir*, y la fusión es una unión de verdad:

| Dato | Regla | Por qué |
|---|---|---|
| Ejercicios hechos, aciertos, fallos | el máximo de los dos | monotónico: fusionar dos veces no duplica |
| Caja de Leitner, vencimiento, racha del patrón | gana el más reciente | describe una decisión tomada en un momento |
| "Aprendido" / "Aún no" | gana el más reciente | es la última palabra del alumno |
| Mejor puntaje de un texto | el máximo | un récord no se pierde |
| Calendario de días | el máximo por día | un día repetido sigue siendo un día |
| Racha de días | la del día más tardío; el récord nunca baja | |
| Ajustes | los del dispositivo tocado último | son una preferencia, no un logro |

La fusión es **idempotente y conmutativa**: fusionar dos veces da lo mismo que
una, y da igual qué dispositivo se considere primero. Eso es lo que permite que
dos aparatos converjan sin que ninguno mande. `tests/sync.test.mjs` lo verifica.

Consecuencia del uso de máximos: si hacés 10 huecos en el celular y 4 en la
notebook **el mismo día y sin sincronizar en el medio**, el día queda en 10, no
en 14. Es el precio de que una re-sincronización no infle los números, y es el
lado del error que preferís tener.

**Escrituras simultáneas.** Cada fila lleva un número de revisión. Si dos
dispositivos suben a la vez, el segundo recibe un conflicto, vuelve a bajar,
fusiona sobre lo que escribió el otro y reintenta. Nadie pisa a nadie.

---

## Seguridad

**El código es la única llave.** No hay usuario ni contraseña: quien tenga esos
16 caracteres ve y modifica tu progreso. No lo publiques. Son 80 bits al azar,
así que adivinarlo no es una posibilidad práctica.

**La clave `anon` es pública a propósito.** Va dentro del código de la app, así
que hay que asumirla conocida. Por eso el SQL:

- revoca todo acceso de `anon` a la tabla `sync_state`, y activa RLS sin ninguna
  política, de modo que ninguna fila es visible por la vía normal;
- expone únicamente dos funciones `security definer`, y ambas exigen el código.

Con la clave sola no se puede listar, leer ni escribir nada.

**Qué se sube.** Solo tu registro de estudio: patrones vistos, aciertos, fallos,
palabras marcadas, calendario y ajustes. No hay datos personales, ni correo, ni
nombre, ni ubicación. Los textos y ejercicios no viajan: ya están en la app.

**Para desconectarte.** Ajustes → Sincronización → *Desvincular*. Deja de subir
y bajar; no borra nada, ni en el dispositivo ni en la nube. Para borrar la copia
de la nube, en el SQL Editor:

```sql
delete from public.sync_state where code = 'TUCODIGO16CHARS';
```

---

## Si algo no anda

**"Sincronización sin configurar"** — `sync-config.js` está vacío o el commit
todavía no se publicó. Revisá que la URL no termine en `/`.

**La notebook sigue vacía después de vincular** — mirá el renglón *Estado* en
Ajustes. Si dice *Sin conexión*, es red; si dice `HTTP 404`, el SQL no se
ejecutó en ese proyecto; si dice `HTTP 401`, la clave `anon` está mal copiada.

**Los cambios no aparecen tras un `git push`** — es el service worker sirviendo
la versión vieja. Subí el `BUILD` en `version.js` y en `sw.js`, o cerrá y volvé
a abrir la app dos veces.

**`HTTP 404` en `sync_pull`** — PostgREST cachea el esquema. En el panel:
**Database** → **Reload schema cache**, o esperá un minuto.
