# k-sar

![K-asar logo](assets/k-asar-logo.png)

**K-asar: Stellar Data Clustering** — Análisis no supervisado de datos estelares con dashboard interactivo

🚀 **[Ver la app en vivo](https://k-sar-production.up.railway.app/)**

## Descripción del Proyecto

Proyecto de segmentación no supervisada para análisis y agrupamiento de datos estelares (astronomía). El objetivo es identificar grupos naturales en el espacio de características espectrales del **Stellar Classification Dataset (SDSS17)**.

**Características principales:**
- 📊 **Pipeline completo** de ML: preprocesamiento, reducción de dimensionalidad (PCA), clustering (K-Means)
- 🎯 **Dashboard interactivo**: visualiza resultados del modelo en tiempo real en el navegador
- 🚀 **App desplegada**: alojada en Railway con actualización automática desde GitHub
- 📐 **Reproducibilidad**: todos los parámetros del modelo están documentados y exportados

## Dataset

Usamos el dataset **"Stellar Classification Dataset (SDSS17)"** disponible en Kaggle:  
https://www.kaggle.com/datasets/fedesoriano/stellar-classification-dataset-sdss17

### Configuración local

Ruta esperada en el repositorio:

```
data/stellar_classification.csv
```

**Instrucciones:**
1. Descarga el CSV desde Kaggle (enlace arriba)
2. Guarda el archivo en `data/stellar_classification.csv` dentro del repo (crea la carpeta `data/` si no existe)

## Estructura del Repositorio

```
k-sar/
├── notebooks/                      # Pipeline de ML (Jupyter Notebooks)
│   ├── 00_eda.ipynb               # Análisis Exploratorio de Datos
│   ├── 01_preprocessing.ipynb      # Preprocesamiento
│   ├── 02_dimensionality_reduction.ipynb  # PCA
│   ├── 03_optimal_k.ipynb         # Selección del K óptimo
│   ├── 04_clustering_model.ipynb   # Clustering y modelo
│   └── 05_business_translation_and_ethics.ipynb  # Traducción al negocio
├── src/                            # Dashboard interactivo (Node.js/Express)
│   ├── server.js
│   ├── package.json
│   ├── railway.json               # Configuración de Railway
│   └── public/
│       ├── index.html             # Dashboard
│       ├── css/style.css
│       ├── js/app.js
│       ├── data/dashboard_data.json  # Datos del modelo
│       └── assets/
├── data/                          # Datasets (descarga aquí el CSV)
├── assets/                        # Logos y recursos
└── README.md
```

## Dashboard Interactivo

La app está **completamente funcional** y desplegada en:  
🔗 https://k-sar-production.up.railway.app/

### Características del dashboard:
- 📊 Visualización interactiva de clusters en 2D (PCA)
- 📈 Gráficos de distribución y análisis de características
- 🎛️ Reproducción del modelo directamente en el navegador
- 📱 Responsive y sin dependencias externas (CDNs)

### Correr localmente

```bash
cd src
npm install
npm start
# Abrir http://localhost:3000
```

### Desplegar cambios en Railway

La app se redeploya automáticamente cuando hay cambios en `src/` en la rama `main`. El flujo es:

1. Haz cambios en cualquier archivo dentro de `src/`
2. Haz push a `main`
3. Railway detecta el cambio y redeploya automáticamente
4. En 1-2 minutos, los cambios están disponibles en https://k-sar-production.up.railway.app/

## Equipo de Trabajo

| Rol | Responsable |
|-----|------------|
| **Contexto de Negocio & EDA** | Javi |
| **Preprocesamiento de Datos** | Luis |
| **Reducción de Dimensionalidad (PCA) & K Óptimo** | Isabella |
| **Clustering y Modelo** | Josema |
| **Traducción al Negocio, Demo & Ética** | Yohanna |

## Flujo de Trabajo (Pull Requests)

1. Cada colaborador crea una rama propia:
   ```bash
   git checkout -b feature/nombre-tarea
   ```

2. Realiza sus cambios y hace push:
   ```bash
   git push origin feature/nombre-tarea
   ```

3. Abre un **Pull Request** en GitHub dirigido a `main`

4. El equipo revisa el código y aprueba el merge

5. ✅ Una vez merged a `main`:
   - Si hay cambios en `notebooks/`: se actualiza el análisis
   - Si hay cambios en `src/`: la app se redeploya automáticamente en Railway

## Tecnologías

- **Análisis de datos**: Python, Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn
- **Dashboard**: Node.js, Express, Chart.js, HTML5/CSS3
- **Deployment**: Railway (CI/CD automático)
- **Versionado**: Git & GitHub

## Mejoras Implementadas

✅ **App desplegada en producción** con actualizaciones automáticas  
✅ **Dashboard interactivo** con visualización de clusters en 2D  
✅ **Pipeline reproducible** con parámetros documentados  
✅ **Datos exportados** en JSON para consumo frontal  
✅ **Arquitectura modular** (notebooks + app separados)  
✅ **CI/CD automático** con Railway  

## Próximos Pasos

- [ ] Agregar más análisis ético en la traducción al negocio
- [ ] Comparar con otros algoritmos de clustering
- [ ] Mejorar visualizaciones 3D
- [ ] Agregar endpoints de API para integración
