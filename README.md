# 🌠 K-asar

<div align="center">

**Herramienta de análisis no supervisado y segmentación de datos estelares basada en Machine Learning**

![K-asar logo](assets/k-asar-logo.png)

Proyecto · Bootcamp IA & Big Data · 2026

[![Railway App](https://img.shields.io/badge/Railway-Demo--en--vivo-222222?logo=railway&logoColor=white)](https://k-sar-production.up.railway.app/)
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)
![scikit--learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikitlearn&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/Licencia-MIT-green)
</div>

## 📋 Descripción del proyecto

**K-asar** es una herramienta de Business Intelligence y Machine Learning no supervisado orientada al análisis espectral y clasificación astronómica.

El proyecto procesa datos espectroscópicos de observatorios (basados en el catálogo SDSS17) mediante algoritmos de reducción de dimensionalidad (PCA) y modelos de agrupación (clustering) para responder preguntas clave:

* ¿Podemos identificar agrupaciones naturales de objetos celestes (estrellas, galaxias y cuásares) sin usar jamás la etiqueta real durante el entrenamiento?
* ¿Qué combinación de componentes principales retiene la mayor cantidad de varianza espectral reduciendo el ruido?
* ¿Cómo varían los clusters según el algoritmo utilizado (K-Means, DBSCAN, GMM, Jerárquico)?
* ¿Se pueden reproducir los agrupamientos espectrales directamente en una interfaz interactiva 2D/3D sin depender de un motor pesado de inferencia en servidor?

---

## 🖥️ Demo

[![Ver Demo en Vivo](https://img.shields.io/badge/VER_DEMO_EN_VIVO-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=00C7B7&labelColor=18181B)](https://k-sar-production.up.railway.app)

La web incluye una presentación inicial con métricas en tiempo real, recorrido navegable por el pipeline de datos, visualizador 2D/3D (Plotly.js) de componentes principales y comparativa de modelos.

---

## 📊 Datasets

| Campo | Detalle |
| :--- | :--- |
| **Fuente&nbsp;principal** | [Kaggle · Stellar Classification Dataset (SDSS17)](https://www.kaggle.com/datasets/fedesoriano/stellar-classification-dataset-sdss17) |
| **Registros&nbsp;totales** | 100.000 objetos astronómicos (99.999 limpios procesados) |
| **Características** | 10 features (incluyendo magnitudes fotométricas u, g, r, i, z y redshift) |
| **Distribución&nbsp;de&nbsp;clases** | Galaxias (59.445) · Estrellas (21.593) · Cuásares/QSO (18.961) |
| **Licencia** | Uso educativo y de investigación (SDSS Open Data) |
> **Nota:** Descargar el archivo `stellar_classification.csv` desde Kaggle y colocarlo en `data/` para la ejecución local de notebooks.

---

## 🏗️ Estructura del proyecto

```
k-sar/
├── notebooks/                                         # Pipeline completo de ML (Jupyter Notebooks)
│   ├── 00_business_case.ipynb                         # Caso de negocio y contexto del análisis
│   ├── 01_exploratory_data_analysis.ipynb             # Análisis Exploratorio de Datos (EDA)
│   ├── 02_data_preprocessing.ipynb                    # Preprocesamiento y limpieza de datos
│   ├── 03_dimensionality_reduction.ipynb              # Reducción de dimensionalidad con PCA
│   ├── 04_modeling.ipynb                              # Clustering con K-Means y selección de K óptimo
│   ├── 04_modeling_test_nopca.ipynb                   # Análisis alternativo sin PCA
│   ├── 05_business_translation_and_ethics.ipynb       # Traducción al negocio, interpretabilidad y ética
│   └── data/                                          # Datos intermedios del pipeline
├── src/                                               # Dashboard interactivo (Node.js/Express)
│   ├── server.js
│   ├── package.json
│   ├── railway.json                                   # Configuración de Railway
│   └── public/
│       ├── index.html                                 # Dashboard
│       ├── css/style.css
│       ├── js/app.js
│       ├── data/dashboard_data.json                   # Datos del modelo (usados en producción)
│       └── assets/
├── data/                                              # Datasets (descarga aquí el CSV)
├── assets/                                            # Logos y recursos
└── README.md
```

---

## 🛠️ Tecnologías utilizadas
| Tecnología | Uso | Justificación |
| :--- | :--- | :--- |
| **Python&nbsp;+&nbsp;pandas** | Análisis y procesamiento | Estándar analítico de procesamiento tabular astronómico |
| **scikit-learn** | PCA, K-Means, DBSCAN, GMM | Permite probar y comparar múltiples algoritmos de agrupamiento de forma estandarizada |
| **Plotly.js&nbsp;+&nbsp;Chart.js** | Visualización 2D y 3D interactiva | Renderizado fluido en cliente sin recargar el servidor |
| **Node.js&nbsp;+&nbsp;Express** | Servidor de producción | Ligero, rápido y óptimo para servir archivos estáticos y datos en JSON |
| **Railway** | Despliegue CI/CD | Integración directa desde GitHub con despliegues automáticos al fusionar a `main` |

---

## 🚀 Instalación y ejecución local
```bash
# 1. Clonar el repositorio
git clone https://github.com/yohperez/k-sar.git
cd k-sar

# 2. Crear entorno virtual de Python (para ejecutar Notebooks)
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate # Mac/Linux

# 3. Instalar dependencias de Python
pip install -r requirements.txt

# 4. Servir la aplicación web localmente
cd src
npm install
npm start
```

---
## 📈 Navegación de la web

| Sección | Descripción |
| :--- | :--- |
| **🚀&nbsp;Inicio&nbsp;(Hero)** | Presentación del proyecto K-asar con métricas globales (99,999 objetos limpios, 10 features, 4 algoritmos comparados, 3 clusters ganadores). |
| **💼&nbsp;00&nbsp;NEGOCIO** | Planteamiento del problema: fotometría barata frente a espectroscopía cara, y cómo priorizar recursos de observación con aprendizaje no supervisado. |
| **📊&nbsp;01&nbsp;DATOS** | Análisis de las 6 variables continuas de entrada, matriz de correlación entre bandas, eliminación de errores de sensor y distribución real de clases. |
| **🧹&nbsp;02&nbsp;PREPROCESO** | Pipeline de limpieza (de 18 columnas crudas a 10 features), descarte de metadatos/coordenadas, ingeniería de 4 índices de color y escalado con `RobustScaler`. |
| **📉&nbsp;03&nbsp;PCA&nbsp;&&nbsp;K** | Reducción de dimensionalidad (retención de varianza del 90.4% al 96.9%), evaluación del método del codo y del coeficiente de silueta para justificar $K=3$. |
| **🤖&nbsp;04&nbsp;MODELO** | Comparativa de los 4 algoritmos (K-Means, DBSCAN, GMM, Jerárquico), métricas contra la clase real y visualizaciones 2D/3D con el *redshift* ponderado ($\times 44$). |
| **🏷️&nbsp;05&nbsp;NEGOCIO** | Traducción de los clusters a un sistema de *triage* (prioridades alta, media y estándar) según la pureza de cada grupo astronómico. |
| **🎛️&nbsp;DEMO** | Simulador interactivo en tiempo real para predecir la prioridad y cluster de un objeto mediante *sliders* de magnitudes y *redshift*. |
| **⚖️&nbsp;ÉTICA** | Análisis de sesgos (de descubrimiento e instrumental), salvaguardas científicas y extrapolación del patrón de *triage* a otros sectores (salud, banca, manufactura). |
| **👥&nbsp;EQUIPO** | Integrantes del proyecto y desglose de responsabilidades por cada notebook y módulo. |

---

## 🔍 Hallazgos principales

* **PCA:** Con 4 componentes principales se retiene aproximadamente el **90.36% de la varianza total** del dataset.
* **Variable clave:** El parámetro `redshift` (desplazamiento al rojo) resulta ser la variable con mayor peso explicativo para separar los objetos celestes (especialmente para aislar Cuásares/QSO de estrellas cercanas).
* **Modelo final:** **K-Means con $K=3$** resulta el modelo ganador al mostrar la mejor correspondencia con las tres clases físicas reales (Galaxias, Estrellas y Cuásares).

---

## ⚠️ Sesgos y limitaciones documentados

| Sesgo / Limitación | Nivel | Impacto |
| :--- | :---: | :--- |
| **Sesgo&nbsp;de&nbsp;selección&nbsp;instrumental&nbsp;SDSS17** | 🔴&nbsp;Alto | El catálogo prioriza ciertos rangos de magnitud y regiones del firmamento. |
| **Desbalance&nbsp;de&nbsp;clases&nbsp;(~59%&nbsp;Galaxias&nbsp;vs&nbsp;~19%&nbsp;QSO)** | 🟡&nbsp;Medio | Algoritmos basados en densidad o distancia pueden sobre-representar el grupo dominante. |
| **Pérdida&nbsp;residual&nbsp;de&nbsp;varianza&nbsp;por&nbsp;PCA&nbsp;(~10%)** | 🟢&nbsp;Bajo | Aceptable para exploración general, pero crítico si se buscan anomalías astronómicas muy raras. |
---

## 🩺 Marco ético y científico

* **Propósito:** K-asar se plantea como una herramienta de exploración de datos e investigación didáctica.
* **Transparencia en la reducción:** La simplificación dimensional mediante PCA puede ocultar eventos raros o supernovas extremas. Los resultados deben cruzarse siempre con las muestras espectroscópicas completas.
* **Uso de datos abiertos:** Todo el proyecto hace uso riguroso de fuentes públicas del **SDSS** (*Sloan Digital Sky Survey*), respetando los términos de atribución y licencia abierta científico-educativa.

---

## 👩‍💻 Equipo de trabajo

| Integrante | Rol / Área de trabajo |
| :--- | :--- |
| **@yohperez** | Contexto de Negocio & Coordinación |
| **@JCRbit** | Análisis Exploratorio de Datos (EDA) |
| **@luiselallali18-hub** | Preprocesamiento y Limpieza de Datos |
| **@Isabela-Tellez** | Reducción de Dimensionalidad (PCA) |
| **@SiR0N** | Modelado de Clustering & Evaluaciones |

---

## Mejoras Implementadas

✅ **App desplegada en producción** con actualizaciones automáticas  
✅ **Dashboard interactivo** con visualización de clusters en 2D y 3D  
✅ **Pipeline reproducible** con parámetros documentados  
✅ **Datos exportados** en JSON para consumo frontal  
✅ **Arquitectura modular** (notebooks + app separados)  
✅ **CI/CD automático** con Railway

---

## Próximos Pasos

- [ ] Agregar más análisis ético en la traducción al negocio
- [ ] Comparar con otros algoritmos de clustering
- [ ] Agregar endpoints de API para integración

---

## 📄 Licencia

* **Dataset:** El dataset utilizado forma parte del proyecto público SDSS.
* **Código:** El código de este repositorio está disponible bajo la **licencia MIT**.
