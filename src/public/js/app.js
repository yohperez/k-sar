// ============================================================
// K-asar dashboard — client logic (v2: real notebooks 00-05 pipeline)
// ============================================================

const CLUSTER_COLORS = ["#9163F5", "#E8B34D", "#4FD8E8"];
const CLUSTER_NAMES = {
  0: "Galaxia de alta confianza",
  1: "Candidato QSO — prioridad alta",
  2: "Mezcla galaxia/estrella — estándar",
};
const CLUSTER_ACTIONS = {
  0: "Prioridad ESTÁNDAR: la fotometría ya es suficientemente concluyente para una galaxia.",
  1: "Prioridad ALTA de espectroscopía: candidato a cuásar, el objeto científicamente más valioso y menos concluyente por fotometría sola.",
  2: "Prioridad MEDIA: mezcla galaxia/estrella, revisión rutinaria por lotes.",
};

let DATA = null;

// ---------------- Nav ----------------
function setupNav() {
  const links = document.querySelectorAll(".nav-links a");
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  toggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  links.forEach(l => l.addEventListener("click", () => navLinks.classList.remove("open")));

  const sections = Array.from(document.querySelectorAll("main .section, .hero"));
  const spy = () => {
    let current = "";
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120) current = sec.id;
    });
    links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  };
  window.addEventListener("scroll", spy, { passive: true });
  spy();
}

// ---------------- Charts ----------------
function chartDefaults() {
  Chart.defaults.color = "#8291A8";
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.borderColor = "rgba(231,235,240,0.08)";
}

function renderHistograms() {
  const ctx = document.getElementById("chartHistograms");
  const bands = ["u", "g", "r", "i", "z"];
  const colors = ["#4FD8E8", "#9163F5", "#E8B34D", "#E0637A", "#7FE0A8"];
  const datasets = bands.map((b, i) => {
    const h = DATA.eda.histograms[b];
    return {
      label: b,
      data: h.counts,
      borderColor: colors[i],
      backgroundColor: colors[i] + "22",
      tension: 0.35,
      pointRadius: 0,
      borderWidth: 2,
    };
  });
  const labels = DATA.eda.histograms.u.edges.slice(0, -1).map(v => v.toFixed(1));
  new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      interaction: { mode: "nearest", intersect: false },
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } },
      scales: {
        x: { ticks: { maxTicksLimit: 6 }, grid: { display: false } },
        y: { grid: { color: "rgba(231,235,240,0.06)" } },
      },
    },
  });
}

function renderCorrHeatmap() {
  const el = document.getElementById("corrHeatmap");
  const labels = DATA.eda.correlation.labels;
  const matrix = DATA.eda.correlation.matrix;
  let html = `<div class="cell label"></div>` + labels.map(l => `<div class="cell label">${l}</div>`).join("");
  labels.forEach((rowLabel, i) => {
    html += `<div class="cell label">${rowLabel}</div>`;
    labels.forEach((_, j) => {
      const v = matrix[i][j];
      const alpha = Math.abs(v);
      const color = v >= 0
        ? `rgba(145,99,245,${0.15 + alpha * 0.75})`
        : `rgba(224,99,122,${0.15 + alpha * 0.75})`;
      html += `<div class="cell" style="background:${color}">${v.toFixed(2)}</div>`;
    });
  });
  el.style.gridTemplateColumns = `repeat(${labels.length + 1}, 1fr)`;
  el.innerHTML = html;
}

function renderClassCounts() {
  const ctx = document.getElementById("chartClassCounts");
  const counts = DATA.meta.class_counts;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ["#9163F5", "#4FD8E8", "#E8B34D"],
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: "rgba(231,235,240,0.06)" } } },
    },
  });
}

function renderPipelineFlow() {
  const steps = [
    "18 columnas crudas", "→", "quitar class", "→", "quitar metadatos instrumento",
    "→", "eliminar magnitudes ≤ 0", "→", "+4 índices de color", "→", "RobustScaler", "→", "10 features finales",
  ];
  const el = document.getElementById("pipelineFlow");
  el.innerHTML = steps.map(s => s === "→"
    ? `<span class="arrow">→</span>`
    : `<span class="step">${s}</span>`).join("");
}

function renderPcaVariance() {
  const ctx = document.getElementById("chartPcaVariance");
  const cum = DATA.pca.cumulative_variance;
  new Chart(ctx, {
    type: "line",
    data: {
      labels: cum.map((_, i) => "PC" + (i + 1)),
      datasets: [{
        data: cum.map(v => v * 100),
        borderColor: "#4FD8E8",
        backgroundColor: "rgba(79,216,232,0.12)",
        fill: true, tension: 0.25, pointRadius: 3,
        pointBackgroundColor: "#4FD8E8",
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + "%" }, grid: { color: "rgba(231,235,240,0.06)" } },
        x: { grid: { display: false } },
      },
    },
  });
  document.getElementById("pcaVarText").textContent =
    `Notebook 03: ${DATA.meta.n_components_90} componentes retienen ${(DATA.meta.var_90 * 100).toFixed(1)}% de varianza. Modelo de producción (Notebook 04): ${DATA.meta.n_components_95} componentes, ${(DATA.meta.var_95 * 100).toFixed(1)}%.`;
}

function renderElbowSilhouette() {
  const kr = DATA.k_selection.k_range;
  new Chart(document.getElementById("chartElbow"), {
    type: "line",
    data: {
      labels: kr,
      datasets: [{ data: DATA.k_selection.inertias, borderColor: "#E8B34D", backgroundColor: "rgba(232,179,77,0.12)", fill: true, tension: 0.3, pointRadius: 3, pointBackgroundColor: "#E8B34D" }],
    },
    options: { responsive: true, plugins: { legend: { display: false } },
      scales: { x: { title: { display: true, text: "K", color: "#8291A8" }, grid: { display: false } }, y: { grid: { color: "rgba(231,235,240,0.06)" } } } },
  });
  new Chart(document.getElementById("chartSilhouette"), {
    type: "line",
    data: {
      labels: kr,
      datasets: [{ data: DATA.k_selection.silhouettes, borderColor: "#9163F5", backgroundColor: "rgba(145,99,245,0.12)", fill: true, tension: 0.3, pointRadius: 3, pointBackgroundColor: "#9163F5" }],
    },
    options: { responsive: true, plugins: { legend: { display: false } },
      scales: { x: { title: { display: true, text: "K", color: "#8291A8" }, grid: { display: false } }, y: { grid: { color: "rgba(231,235,240,0.06)" } } } },
  });
}

function renderScatter() {
  const ctx = document.getElementById("chartScatter");
  const byCluster = { 0: [], 1: [], 2: [] };
  DATA.scatter_sample.forEach(p => byCluster[p.c].push({ x: p.x, y: p.y }));
  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: Object.keys(byCluster).map(c => ({
        label: "Cluster " + c,
        data: byCluster[c],
        backgroundColor: CLUSTER_COLORS[c] + "AA",
        pointRadius: 2,
      })),
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } },
      scales: {
        x: { title: { display: true, text: "PC1", color: "#8291A8" }, grid: { color: "rgba(231,235,240,0.05)" } },
        y: { title: { display: true, text: "PC2", color: "#8291A8" }, grid: { color: "rgba(231,235,240,0.05)" } },
      },
    },
  });
}

function renderClusterSizes() {
  const sizes = DATA.clustering.sizes;
  new Chart(document.getElementById("chartClusterSizes"), {
    type: "doughnut",
    data: {
      labels: Object.keys(sizes).map(k => "Cluster " + k),
      datasets: [{ data: Object.values(sizes), backgroundColor: CLUSTER_COLORS, borderColor: "#0E1730", borderWidth: 3 }],
    },
    options: { responsive: true, plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } } },
  });
}

function renderModelComparison() {
  const rm = DATA.clustering.reported_metrics;
  const models = Object.keys(rm);
  new Chart(document.getElementById("chartModelComparison"), {
    type: "bar",
    data: {
      labels: models,
      datasets: [
        { label: "ARI", data: models.map(m => rm[m].ari), backgroundColor: "#9163F5" },
        { label: "Accuracy", data: models.map(m => rm[m].accuracy), backgroundColor: "#4FD8E8" },
        { label: "F1 ponderado", data: models.map(m => rm[m].f1_weighted), backgroundColor: "#E8B34D" },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } },
      scales: { x: { grid: { display: false } }, y: { min: 0, max: 1, grid: { color: "rgba(231,235,240,0.06)" } } },
    },
  });
}

function renderCrosstab() {
  const pct = DATA.validation.crosstab_pct;
  const clusterIds = ["0", "1", "2"];
  const classes = Object.keys(pct);
  const colors = { GALAXY: "#9163F5", QSO: "#E8B34D", STAR: "#4FD8E8" };
  new Chart(document.getElementById("chartCrosstab"), {
    type: "bar",
    data: {
      labels: clusterIds.map(c => "Cluster " + c),
      datasets: classes.map(cls => ({
        label: cls,
        data: clusterIds.map(c => (pct[cls][c] || 0) * 100),
        backgroundColor: colors[cls],
      })),
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, max: 100, ticks: { callback: v => v + "%" }, grid: { color: "rgba(231,235,240,0.06)" } },
      },
    },
  });
  document.getElementById("ariText").textContent = DATA.clustering.reported_metrics["K-Means"].ari.toFixed(4);
}

function renderPersonas() {
  const sizes = DATA.profiles.sizes;
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  const personas = [
    { id: "0", name: "Galaxia de alta confianza", meta: "Cluster 0 · prioridad estándar", desc: "82.2% de pureza real hacia galaxias — la fotometría sola ya da confianza suficiente.", action: CLUSTER_ACTIONS[0] },
    { id: "1", name: "Candidato QSO", meta: "Cluster 1 · prioridad alta", desc: "Mayor concentración relativa de cuásares del dataset (73.9%), aunque mezclado con galaxias y estrellas.", action: CLUSTER_ACTIONS[1] },
    { id: "2", name: "Mezcla galaxia/estrella", meta: "Cluster 2 · prioridad media", desc: "Composición intermedia (58.2% galaxia, 39.2% estrella) — útil para lotes de seguimiento rutinario.", action: CLUSTER_ACTIONS[2] },
  ];
  const el = document.getElementById("personaGrid");
  el.innerHTML = personas.map(p => `
    <div class="persona-card" style="border-top:3px solid ${CLUSTER_COLORS[p.id]}">
      <span class="p-name">${p.name}</span>
      <span class="p-meta">${p.meta} · ${sizes[p.id].toLocaleString("es-ES")} objetos (${((sizes[p.id]/total)*100).toFixed(1)}%)</span>
      <span class="p-desc">${p.desc}</span>
      <span class="p-action">${p.action}</span>
    </div>
  `).join("");
}

function renderScatter3D() {
  const container = document.getElementById("plot3d");
  if (!container || typeof Plotly === "undefined") return;

  const points = DATA.scatter_sample_3d;
  const CLASS_COLORS = { GALAXY: "#9163F5", QSO: "#E8B34D", STAR: "#4FD8E8" };
  const CLASS_NAMES_ES = { GALAXY: "Galaxia", QSO: "Cuásar (QSO)", STAR: "Estrella" };

  function tracesFor(colorBy) {
    if (colorBy === "cluster") {
      return [0, 1, 2].map(c => {
        const pts = points.filter(p => p.c === c);
        return {
          x: pts.map(p => p.x), y: pts.map(p => p.y), z: pts.map(p => p.z),
          mode: "markers", type: "scatter3d", name: "Cluster " + c,
          marker: { size: 2.2, color: CLUSTER_COLORS[c], opacity: 0.75 },
          hovertemplate: "Cluster " + c + "<extra></extra>",
        };
      });
    }
    return ["GALAXY", "QSO", "STAR"].map(cls => {
      const pts = points.filter(p => p.real === cls);
      return {
        x: pts.map(p => p.x), y: pts.map(p => p.y), z: pts.map(p => p.z),
        mode: "markers", type: "scatter3d", name: CLASS_NAMES_ES[cls],
        marker: { size: 2.2, color: CLASS_COLORS[cls], opacity: 0.75 },
        hovertemplate: CLASS_NAMES_ES[cls] + "<extra></extra>",
      };
    });
  }

  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { color: "#8291A8", family: "Inter, sans-serif", size: 11 },
    margin: { l: 0, r: 0, t: 10, b: 0 },
    legend: { orientation: "h", y: -0.02, font: { color: "#E7EBF0" } },
    scene: {
      xaxis: { title: "PC1", gridcolor: "rgba(231,235,240,0.12)", zerolinecolor: "rgba(231,235,240,0.2)", backgroundcolor: "rgba(0,0,0,0)" },
      yaxis: { title: "PC2", gridcolor: "rgba(231,235,240,0.12)", zerolinecolor: "rgba(231,235,240,0.2)", backgroundcolor: "rgba(0,0,0,0)" },
      zaxis: { title: "PC3", gridcolor: "rgba(231,235,240,0.12)", zerolinecolor: "rgba(231,235,240,0.2)", backgroundcolor: "rgba(0,0,0,0)" },
      camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } },
    },
  };

  Plotly.newPlot(container, tracesFor("cluster"), layout, { responsive: true, displayModeBar: false });

  document.querySelectorAll(".viz3d-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".viz3d-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      Plotly.react(container, tracesFor(btn.dataset.color), layout, { responsive: true, displayModeBar: false });
    });
  });
}

async function renderExpandedScatter3D() {
  const container = document.getElementById("plot3dAmpliado");
  if (!container || typeof Plotly === "undefined") return;

  let traces;
  try {
    const res = await fetch("data/comparativa3d_ampliada.json");
    traces = await res.json();
  } catch (e) {
    console.error("No se pudo cargar comparativa3d_ampliada.json", e);
    container.innerHTML = '<p class="cap" style="padding:2em;">No se pudo cargar la visualización ampliada.</p>';
    return;
  }

  const axisStyle = (title) => ({
    title: { text: title, font: { size: 10, color: "#8291A8" } },
    gridcolor: "rgba(231,235,240,0.12)",
    zerolinecolor: "rgba(231,235,240,0.2)",
    backgroundcolor: "rgba(0,0,0,0)",
    tickfont: { size: 8, color: "#8291A8" },
  });
  const sceneStyle = (domainX, domainY) => ({
    domain: { x: domainX, y: domainY },
    xaxis: axisStyle("PC1"), yaxis: axisStyle("PC2"), zaxis: axisStyle("PC3"),
    camera: { eye: { x: 1.4, y: 1.4, z: 1.1 } },
  });

  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { color: "#8291A8", family: "Inter, sans-serif", size: 11 },
    margin: { l: 0, r: 0, t: 40, b: 0 },
    showlegend: false,
    scene: sceneStyle([0.0, 0.485], [0.54, 1.0]),
    scene2: sceneStyle([0.515, 1.0], [0.54, 1.0]),
    scene3: sceneStyle([0.0, 0.485], [0.0, 0.46]),
    scene4: sceneStyle([0.515, 1.0], [0.0, 0.46]),
    annotations: [
      { font: { size: 13, color: "#E7EBF0" }, showarrow: false, text: "<b>Datos reales (clases SDSS)</b>", x: 0.2425, xanchor: "center", xref: "paper", y: 1.0, yanchor: "bottom", yref: "paper" },
      { font: { size: 13, color: "#E7EBF0" }, showarrow: false, text: "<b>GMM</b>", x: 0.7575, xanchor: "center", xref: "paper", y: 1.0, yanchor: "bottom", yref: "paper" },
      { font: { size: 13, color: "#E7EBF0" }, showarrow: false, text: "<b>K-Means (ganador)</b>", x: 0.2425, xanchor: "center", xref: "paper", y: 0.46, yanchor: "bottom", yref: "paper" },
      { font: { size: 13, color: "#E7EBF0" }, showarrow: false, text: "<b>Jerárquico (Ward)</b>", x: 0.7575, xanchor: "center", xref: "paper", y: 0.46, yanchor: "bottom", yref: "paper" },
    ],
  };

  Plotly.newPlot(container, traces, layout, { responsive: true, displayModeBar: false });
}

// ---------------- Live demo (real model reproduced in JS) ----------------
function predictCluster(u, g, r, i, z, redshift) {
  const mp = DATA.model_params;
  const color_ug = u - g, color_gr = g - r, color_ri = r - i, color_iz = i - z;
  // feature_order = [u, g, r, i, z, redshift, color_ug, color_gr, color_ri, color_iz]
  const raw = [u, g, r, i, z, redshift, color_ug, color_gr, color_ri, color_iz];

  // RobustScaler: (x - center) / scale
  const scaled = raw.map((v, idx) => (v - mp.scaler_center[idx]) / mp.scaler_scale[idx]);

  // PCA transform: (x - pca_mean) @ components.T
  const centered = scaled.map((v, idx) => v - mp.pca_mean[idx]);
  const pcaCoords = mp.pca_components.map(component =>
    component.reduce((sum, w, idx) => sum + w * centered[idx], 0)
  );

  // Nearest cluster center (Euclidean)
  let bestC = 0, bestDist = Infinity;
  mp.cluster_centers.forEach((center, c) => {
    const dist = center.reduce((s, v, idx) => s + (v - pcaCoords[idx]) ** 2, 0);
    if (dist < bestDist) { bestDist = dist; bestC = c; }
  });
  return bestC;
}

function setupDemo() {
  const rows = document.querySelectorAll(".slider-row");
  const drCluster = document.getElementById("drCluster");
  const drAction = document.getElementById("drAction");

  function readValues() {
    const vals = {};
    rows.forEach(r => { vals[r.dataset.feat] = parseFloat(r.querySelector("input").value); });
    return vals;
  }

  function run() {
    const v = readValues();
    rows.forEach(r => { r.querySelector(".sval").textContent = r.querySelector("input").value; });
    const c = predictCluster(v.u, v.g, v.r, v.i, v.z, v.redshift);
    drCluster.textContent = CLUSTER_NAMES[c];
    drCluster.style.color = CLUSTER_COLORS[c];
    drAction.textContent = CLUSTER_ACTIONS[c];
  }

  rows.forEach(r => r.querySelector("input").addEventListener("input", run));

  const presets = {
    galaxy: { u: 24.0, g: 22.1, r: 20.5, i: 19.5, z: 19.0, redshift: 0.15 },
    qso: { u: 22.0, g: 21.2, r: 20.9, i: 20.7, z: 20.6, redshift: 1.8 },
    star: { u: 19.6, g: 18.1, r: 17.3, i: 16.9, z: 16.7, redshift: 0.0 },
  };
  document.querySelectorAll(".demo-presets button").forEach(btn => {
    btn.addEventListener("click", () => {
      const preset = presets[btn.dataset.preset];
      rows.forEach(r => { r.querySelector("input").value = preset[r.dataset.feat]; });
      run();
    });
  });

  run();
}

// ---------------- Boot ----------------
async function boot() {
  setupNav();
  renderPipelineFlow();
  chartDefaults();
  try {
    const res = await fetch("data/dashboard_data.json");
    DATA = await res.json();
  } catch (e) {
    console.error("No se pudo cargar dashboard_data.json", e);
    return;
  }
  renderHistograms();
  renderCorrHeatmap();
  renderClassCounts();
  renderPcaVariance();
  renderElbowSilhouette();
  renderScatter();
  renderScatter3D();
  renderExpandedScatter3D();
  renderClusterSizes();
  renderModelComparison();
  renderCrosstab();
  renderPersonas();
  setupDemo();
}

document.addEventListener("DOMContentLoaded", boot);
