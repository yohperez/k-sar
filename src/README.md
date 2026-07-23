# K-asar — App (src/)

Dashboard interactivo del proyecto **K-asar** (PatternFinder, Módulo III):
clustering no supervisado sobre el [Stellar Classification Dataset — SDSS17](https://www.kaggle.com/datasets/fedesoriano/stellar-classification-dataset-sdss17),
con los textos, gráficos y modelo reales de los notebooks `00`–`05` de este
repositorio.

Este `src/` es una app Node.js/Express **autocontenida**: todos sus assets
(fuentes, Chart.js, datos, logo) están vendorizados dentro de `public/`, así
que no depende de nada fuera de esta carpeta ni de CDNs externos.

## Estructura

```
src/
├── server.js            # servidor Express (sirve /public)
├── package.json
├── railway.json          # config de despliegue para Railway
└── public/
    ├── index.html
    ├── css/style.css
    ├── js/app.js
    ├── js/vendor/chart.umd.min.js   # Chart.js autoalojado
    ├── fonts/             # Space Grotesk, Inter, JetBrains Mono autoalojadas
    ├── assets/
    │   ├── logo-transparent.png     # logo K-asar con fondo transparente
    │   └── favicon.png
    └── data/dashboard_data.json     # datos reales exportados del pipeline (00-05)
```

## Correr localmente

```bash
cd src
npm install
npm start
# abrir http://localhost:3000
```

## Desplegar en Railway

Como este repositorio tiene el código de la app dentro de `src/` (junto a
`notebooks/`, `data/` y `assets/` en la raíz), hay que decirle a Railway que
la raíz del proyecto a construir es `src/`:

1. En [railway.app](https://railway.app): **New Project → Deploy from GitHub repo** → elegí `yohperez/k-sar`.
2. En **Settings → General → Root Directory**, poné `src`.
3. Railway detecta Node.js automáticamente (Nixpacks) y corre `npm install && npm start` **dentro de `src/`**.
4. En **Settings → Networking**, generá el dominio público.

No hace falta configurar variables de entorno: el servidor toma el puerto de
`process.env.PORT`, que Railway inyecta automáticamente.

## Actualizar los datos del dashboard

Todos los números y gráficos de `index.html` salen de
`public/data/dashboard_data.json`, generado a partir del pipeline real de
los notebooks `01`–`04` (ver `notebooks/05_business_translation_and_ethics.ipynb`
para el detalle completo del pipeline reproducido). Si el modelo o los datos
cambian, hay que regenerar ese JSON con el mismo preprocesamiento
(RobustScaler + PCA al 95% + K-Means K=3) y sus parámetros ajustados
(`scaler_center`, `scaler_scale`, `pca_mean`, `pca_components`,
`cluster_centers`), que son los que la demo en vivo usa para reproducir el
modelo directamente en el navegador.

## El logo transparente

`public/assets/logo-transparent.png` fue generado a partir del logo original
(fondo espacial oscuro) mediante un recorte por luminosidad: los píxeles
oscuros del fondo se vuelven transparentes de forma gradual, preservando
intacto el brillo del cuásar, los diamantes de circuito y el texto "K-asar".
Una copia en resolución completa vive en `/assets/k-asar-logo-transparent.png`,
en la raíz del repositorio, junto al logo original.
