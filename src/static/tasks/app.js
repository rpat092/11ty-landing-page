const STORAGE_KEY = 'tasks';

const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const empty = document.getElementById('empty');
const count = document.getElementById('count');

function load() {
  try {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(tasks) ? tasks : [];
  } catch (e) {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    // Storage unavailable (e.g. private mode); tasks last for this visit only.
  }
}

let tasks = load();

function render() {
  list.textContent = '';
  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = 'task';

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'delete';
    del.textContent = '×';
    del.setAttribute('aria-label', 'Delete "' + task.text + '"');
    del.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      save();
      render();
    });

    li.append(text, del);
    list.append(li);
  }
  empty.hidden = tasks.length > 0;
  count.textContent = tasks.length === 1 ? '1 task' : tasks.length + ' tasks';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), text });
  save();
  render();
  input.value = '';
  input.focus();
});

// Keep multiple open tabs in sync.
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) {
    tasks = load();
    render();
  }
});

render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/tasks/sw.js', { scope: '/tasks/' });
}
