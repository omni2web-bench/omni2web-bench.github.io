"use strict";

for (const anchor of document.querySelectorAll("[data-resource]")) {
  const url = window.OMNI2WEB_LINKS?.[anchor.dataset.resource];
  if (!url) continue;
  anchor.href = url;
  anchor.removeAttribute("aria-disabled");
  anchor.querySelector(".availability")?.remove();
}

const data = window.OMNI2WEB_RESULTS;
let filter = "all";
let query = "";
let sort = "b";
let direction = -1;
const body = document.getElementById("results-body");
const maxima = data && Object.fromEntries(["a", "b", "c", "niu"].map(key => [key, Math.max(...data.models.map(model => model[key] ?? -Infinity))]));

function renderResults() {
  if (!data) return;
  const models = data.models.filter(model => (filter === "all" || model.modality === filter) && model.name.toLowerCase().includes(query));
  models.sort((a, b) => {
    if (a[sort] === null && b[sort] !== null) return 1;
    if (b[sort] === null && a[sort] !== null) return -1;
    return (a[sort] - b[sort]) * direction || a.name.localeCompare(b.name);
  });
  body.replaceChildren();
  for (const model of models) {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    name.className = "model-name";
    const logo = document.createElement("img");
    logo.src = `assets/logos/${model.logo}`;
    logo.alt = "";
    logo.className = "model-logo";
    logo.width = logo.height = 19;
    name.append(logo, document.createTextNode(model.name));
    row.append(name);
    const modality = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "modality";
    badge.textContent = model.modality;
    modality.append(badge);
    row.append(modality);
    for (const key of ["a", "b", "c", "niu"]) {
      const cell = document.createElement("td");
      cell.textContent = model[key] === null ? "—" : model[key].toFixed(2);
      if (model[key] === maxima[key]) cell.className = `best col-${key === "niu" ? "c" : key}`;
      row.append(cell);
    }
    body.append(row);
  }
  if (!models.length) {
    const row = body.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 6;
    cell.textContent = "No models match this search.";
  }
  document.getElementById("results-status").textContent = `Showing ${models.length} of ${data.models.length} models. Select a score column to sort.`;
  for (const button of document.querySelectorAll("[data-sort]")) {
    const active = button.dataset.sort === sort;
    button.parentElement.setAttribute("aria-sort", active ? (direction === -1 ? "descending" : "ascending") : "none");
    button.querySelector("span").textContent = active ? (direction === -1 ? "↓" : "↑") : "↕";
  }
}

for (const button of document.querySelectorAll("[data-filter]")) {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    for (const option of document.querySelectorAll("[data-filter]")) option.setAttribute("aria-pressed", String(option === button));
    renderResults();
  });
}
for (const button of document.querySelectorAll("[data-sort]")) {
  button.addEventListener("click", () => {
    direction = button.dataset.sort === sort ? -direction : -1;
    sort = button.dataset.sort;
    renderResults();
  });
}
document.getElementById("model-search").addEventListener("input", event => {
  query = event.target.value.trim().toLowerCase();
  renderResults();
});
renderResults();

const dialog = document.getElementById("figure-dialog");
for (const button of document.querySelectorAll("[data-zoom]")) {
  button.addEventListener("click", () => {
    const image = document.getElementById("enlarged-figure");
    image.src = button.dataset.zoom;
    image.alt = button.querySelector("img").alt;
    dialog.showModal();
  });
}
document.getElementById("close-figure").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

document.getElementById("copy-citation").addEventListener("click", async () => {
  const text = document.getElementById("bibtex").textContent;
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "BibTeX copied.";
    const button = document.getElementById("copy-citation");
    button.textContent = "Copied!";
    setTimeout(() => { button.textContent = "Copy BibTeX"; }, 1800);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById("bibtex"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    status.textContent = "Citation selected. Copy the selected text using your keyboard or device menu.";
  }
});
