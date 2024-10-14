// Utility functions to update and save data to Chrome's storage
function saveData(key, data) {
  chrome.storage.local.set({ [key]: data });
}

function getData(key, callback) {
  chrome.storage.local.get([key], (result) => {
    callback(result[key] || []);
  });
}

// Function to render lists dynamically
function renderList(elementId, items) {
  const listElement = document.getElementById(elementId);
  listElement.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => removeItem(elementId, index));
    listElement.appendChild(li);
  });
}

// Add and remove item functions
function addItem(elementId, inputId, key) {
  const input = document.getElementById(inputId);
  const value = input.value.trim();
  if (value) {
    getData(key, (items) => {
      items.push(value);
      saveData(key, items);
      renderList(elementId, items);
    });
    input.value = "";
  }
}

function removeItem(elementId, index) {
  const key = elementId.replace("-list", "");
  getData(key, (items) => {
    items.splice(index, 1);
    saveData(key, items);
    renderList(elementId, items);
  });
}

// Event listeners for adding new items
document.getElementById("add-deadline").addEventListener("click", () =>
  addItem("deadlines-list", "deadline-input", "deadlines")
);

document.getElementById("add-todo").addEventListener("click", () =>
  addItem("todo-list", "todo-input", "todos")
);

document.getElementById("add-link").addEventListener("click", () =>
  addItem("links-list", "link-input", "links")
);

// Load data on popup open
document.addEventListener("DOMContentLoaded", () => {
  getData("deadlines", (items) => renderList("deadlines-list", items));
  getData("todos", (items) => renderList("todo-list", items));
  getData("links", (items) => renderList("links-list", items));
});
