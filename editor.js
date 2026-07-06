(function () {
  const nodes = [...document.querySelectorAll("[data-editable='true']")];
  if (!nodes.length) return;

  const storageKey = "portfolio-editable-content";
  const modeKey = "portfolio-edit-mode";
  const defaults = Object.fromEntries(nodes.map((node) => [node.dataset.key, node.textContent]));

  let button = document.querySelector("[data-edit-toggle='true']");
  if (!button) {
    const host = document.querySelector(".nav-right") || document.querySelector(".nav");
    if (host) {
      button = document.createElement("button");
      button.className = "edit-toggle";
      button.type = "button";
      button.setAttribute("aria-pressed", "false");
      button.dataset.editToggle = "true";
      button.textContent = "编辑模式";
      host.appendChild(button);
    }
  }

  const readSaved = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  };

  const loadContent = () => {
    const saved = readSaved();
    nodes.forEach((node) => {
      const key = node.dataset.key;
      if (!key) return;
      node.textContent = Object.prototype.hasOwnProperty.call(saved, key) ? saved[key] : defaults[key];
    });
  };

  const saveContent = () => {
    const payload = {};
    nodes.forEach((node) => {
      const key = node.dataset.key;
      if (key) payload[key] = node.textContent;
    });
    localStorage.setItem(storageKey, JSON.stringify(payload));
  };

  const setEditMode = (enabled) => {
    document.body.classList.toggle("edit-mode", enabled);
    if (button) {
      button.setAttribute("aria-pressed", String(enabled));
      button.textContent = enabled ? "编辑中" : "编辑模式";
    }
    nodes.forEach((node) => {
      node.setAttribute("contenteditable", enabled ? "true" : "false");
      node.setAttribute("spellcheck", "false");
    });
    localStorage.setItem(modeKey, enabled ? "1" : "0");
  };

  loadContent();
  setEditMode(localStorage.getItem(modeKey) === "1");

  if (button) {
    button.addEventListener("click", () => {
      setEditMode(localStorage.getItem(modeKey) !== "1");
    });
  }

  nodes.forEach((node) => {
    node.addEventListener("input", saveContent);
    node.addEventListener("blur", saveContent);
  });
})();
