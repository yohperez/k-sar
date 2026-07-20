# k-sar

![K-asar logo](assets/k-asar-logo.png)

K-asar: Stellar Data Clustering

## Descripción del Proyecto
Proyecto de segmentación no supervisada para análisis y agrupamiento de datos estelares (astronomía). El objetivo es identificar grupos naturales en el espacio de características espectrales y fotométricas mediante técnicas como PCA y K-means, y traducir esos resultados a insights de negocio.

## Dataset
Usamos el dataset "Stellar Classification Dataset (SDSS17)" disponible en Kaggle:
https://www.kaggle.com/datasets/fedesoriano/stellar-classification-dataset-sdss17

Ruta esperada en el repositorio (poner el CSV aquí después de descargarlo):

```
data/stellar_classification.csv
```

Instrucciones rápidas:
- Descarga el CSV desde Kaggle (enlace arriba).
- Guarda el archivo en `data/stellar_classification.csv` dentro del repo (puedes crear la carpeta `data/`).

## Equipo de Trabajo
- **Javi:** Contexto de Negocio y Análisis Exploratorio de Datos (EDA)
- **Luis:** Preprocesamiento de Datos
- **Isabella:** Reducción de Dimensionalidad (PCA) y Selección del K Óptimo
- **Josema:** Clustering y Modelo
- **Yohanna:** Traducción al Negocio, Demostración del Producto y Análisis Ético

## Flujo de trabajo (Pull Requests)
1. Cada colaborador crea una rama propia: `git checkout -b feature/nombre-tarea`.
2. Al finalizar, hace un `git push` de su rama.
3. Abre un **Pull Request** en GitHub dirigido a `main`.
4. El equipo revisa el código y aprueba el merge.
