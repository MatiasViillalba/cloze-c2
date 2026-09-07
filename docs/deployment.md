# Publicación

## GitHub Pages

El proyecto es estático: no hay build, así que Pages puede servir la raíz del
repositorio tal cual.

1. Creá un repositorio vacío en <https://github.com/new>.
2. Subí el historial completo con un solo comando:

   ```powershell
   .\scripts\publish.ps1 -RemoteUrl https://github.com/TU-USUARIO/cloze-c2.git
   ```

3. En el repo: **Settings → Pages → Build and deployment**.
   - Source: `Deploy from a branch`
   - Branch: `main`, carpeta `/ (root)`
4. Esperá un minuto. La URL queda en
   `https://TU-USUARIO.github.io/cloze-c2/`.

También se incluye `.github/workflows/deploy-pages.yml`, que publica con
GitHub Actions en cada push a `main`. Si preferís ese camino, elegí
`GitHub Actions` como *Source* en lugar de `Deploy from a branch`.

## Por qué todas las rutas son relativas

Pages sirve los repos de proyecto desde un subdirectorio
(`/cloze-c2/`, no `/`). Cualquier ruta absoluta rompería la app en producción
aunque funcione en local. Por eso:

- `index.html` referencia `assets/…`, `icons/…`, `manifest.webmanifest`.
- El manifest declara `"start_url": "./"` y `"scope": "./"`.
- El registro del service worker usa `navigator.serviceWorker.register('./sw.js')`.
- La lista `ASSETS` de `sw.js` empieza por `./`.

## HTTPS

Los service workers exigen un origen seguro. `https://usuario.github.io` lo es, y
`http://localhost` también, que es lo que permite probar en local con
`npm run serve`. Sobre `file://` no hay service worker ni modo offline.

## Cambiar de nombre o de dominio

Si renombrás el repositorio, la URL cambia y iOS trata la nueva dirección como
otra app: hay que volver a añadirla a la pantalla de inicio y **el progreso
anterior no viaja**. Exportalo antes desde Ajustes.

## Verificación posterior al despliegue

```bash
curl -I https://TU-USUARIO.github.io/cloze-c2/            # 200
curl -I https://TU-USUARIO.github.io/cloze-c2/sw.js       # 200, text/javascript
curl -I https://TU-USUARIO.github.io/cloze-c2/manifest.webmanifest
```

En el iPhone, la comprobación de verdad es la del modo avión descrita en
[ios-installation.md](ios-installation.md).
