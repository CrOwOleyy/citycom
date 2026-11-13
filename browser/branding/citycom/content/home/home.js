"use strict";

const ENGINES = {
  google: { label: "Google", url: "https://www.google.com/search?q=" },
  duckduckgo: { label: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  bing: { label: "Bing", url: "https://www.bing.com/search?q=" },
  qwant: { label: "Qwant", url: "https://www.qwant.com/?q=" },
};

const DEFAULT_SHORTCUTS = [
  { name: "YouTube", url: "https://www.youtube.com/" },
  { name: "Gmail", url: "https://mail.google.com/" },
  { name: "Wikipédia", url: "https://fr.wikipedia.org/" },
  { name: "GitHub", url: "https://github.com/" },
];

const MAX_SHORTCUTS = 16;

// about:home has no localStorage, so settings live in IndexedDB with an
// in-memory copy loaded once at startup.
const store = {
  cache: new Map(),
  db: null,

  async load() {
    try {
      this.db = await new Promise((resolve, reject) => {
        const request = indexedDB.open("citycom-home", 1);
        request.onupgradeneeded = () => request.result.createObjectStore("settings");
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      await new Promise((resolve, reject) => {
        const request = this.db.transaction("settings").objectStore("settings").openCursor();
        request.onsuccess = () => {
          const cursor = request.result;
          if (!cursor) {
            resolve();
            return;
          }
          this.cache.set(cursor.key, cursor.value);
          cursor.continue();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error("CityCom: settings unavailable", e);
    }
  },

  get(key, fallback) {
    return this.cache.has(key) ? structuredClone(this.cache.get(key)) : fallback;
  },

  set(key, value) {
    this.cache.set(key, structuredClone(value));
    try {
      this.db?.transaction("settings", "readwrite").objectStore("settings").put(value, key);
    } catch (e) {
      console.error("CityCom: could not save setting", e);
    }
  },
};

const timeFormat = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const barFormat = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });

function tick() {
  const now = new Date();
  document.getElementById("clock").textContent = timeFormat.format(now);
  document.getElementById("date").textContent = dateFormat.format(now);
  const h = now.getHours();
  document.getElementById("greeting").textContent =
    h < 5 ? "Bonne nuit, runner" : h < 18 ? "Bonjour, runner" : "Bonsoir, runner";
  document.getElementById("bar-time").textContent = barFormat.format(now);
}

function setupSearch() {
  const select = document.getElementById("engine");
  for (const [id, { label }] of Object.entries(ENGINES)) {
    select.append(new Option(label, id));
  }
  select.value = store.get("engine", "google");
  select.addEventListener("change", () => {
    store.set("engine", select.value);
    updateStatus();
  });

  document.getElementById("search").addEventListener("submit", event => {
    event.preventDefault();
    const query = document.getElementById("query").value.trim();
    if (!query) {
      return;
    }
    const engine = ENGINES[select.value] ?? ENGINES.google;
    location.assign(engine.url + encodeURIComponent(query));
  });
}

function normalizeUrl(raw) {
  const value = raw.trim();
  const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("unsupported protocol");
  }
  return url.href;
}

function span(className, text) {
  const element = document.createElement("span");
  element.className = className;
  element.textContent = text;
  return element;
}

function updateStatus() {
  const select = document.getElementById("engine");
  document.getElementById("status-engine").textContent =
    select.options[select.selectedIndex]?.text ?? "";
  document.getElementById("status-slots").textContent =
    `${store.get("shortcuts", DEFAULT_SHORTCUTS).length}/${MAX_SHORTCUTS}`;
}

function renderShortcuts() {
  const shortcuts = store.get("shortcuts", DEFAULT_SHORTCUTS);
  const container = document.getElementById("shortcuts");
  container.replaceChildren();

  shortcuts.forEach((shortcut, index) => {
    const slot = document.createElement("a");
    slot.className = "slot frame";
    slot.href = shortcut.url;
    slot.title = shortcut.url;

    const remove = document.createElement("button");
    remove.className = "remove";
    remove.textContent = "✕";
    remove.title = `Retirer ${shortcut.name}`;
    remove.addEventListener("click", event => {
      event.preventDefault();
      shortcuts.splice(index, 1);
      store.set("shortcuts", shortcuts);
      renderShortcuts();
    });

    slot.append(
      span("glyph", shortcut.name.charAt(0).toUpperCase()),
      span("name", shortcut.name),
      span("index", `${index + 1}.`),
      remove
    );
    container.append(slot);
  });

  if (shortcuts.length < MAX_SHORTCUTS) {
    const add = document.createElement("button");
    add.className = "slot frame add";
    add.append(span("glyph", "+"), span("name", "Ajouter"));
    add.addEventListener("click", () => {
      document.getElementById("editor-form").reset();
      document.getElementById("editor").showModal();
    });
    container.append(add);
  }
  updateStatus();
}

function setupHotkeys() {
  document.addEventListener("keydown", event => {
    if (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.target.closest("input, select, textarea, dialog")
    ) {
      return;
    }
    const n = Number(event.key);
    if (Number.isInteger(n) && n >= 1 && n <= 9) {
      const shortcut = store.get("shortcuts", DEFAULT_SHORTCUTS)[n - 1];
      if (shortcut) {
        location.assign(shortcut.url);
      }
    }
  });
}

function setupEditor() {
  const dialog = document.getElementById("editor");
  const urlInput = document.getElementById("edit-url");
  urlInput.addEventListener("input", () => urlInput.setCustomValidity(""));

  dialog.addEventListener("close", () => {
    if (dialog.returnValue !== "save") {
      return;
    }
    const shortcuts = store.get("shortcuts", DEFAULT_SHORTCUTS);
    shortcuts.push({
      name: document.getElementById("edit-name").value.trim(),
      url: normalizeUrl(urlInput.value),
    });
    store.set("shortcuts", shortcuts);
    renderShortcuts();
  });

  document.getElementById("editor-form").addEventListener("submit", event => {
    if (event.submitter?.value !== "save") {
      return;
    }
    try {
      normalizeUrl(urlInput.value);
    } catch {
      event.preventDefault();
      urlInput.setCustomValidity("Adresse invalide");
      urlInput.reportValidity();
    }
  });
}

tick();
setInterval(tick, 1000);
store.load().then(() => {
  setupSearch();
  renderShortcuts();
  setupEditor();
  setupHotkeys();
});
