const STORAGE_KEY = 'rakshak-tasks';

const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const emptyTitle = document.querySelector('#empty-title');
const emptyMessage = document.querySelector('#empty-message');
const clearCompletedButton = document.querySelector('#clear-completed');
const filterButtons = document.querySelectorAll('.filter-button');

let tasks = loadTasks();
let currentFilter = 'all';

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(title) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    title,
    completed: false,
  };
}

function visibleTasks() {
  if (currentFilter === 'active') return tasks.filter((task) => !task.completed);
  if (currentFilter === 'completed') return tasks.filter((task) => task.completed);
  return tasks;
}

function render() {
  const filteredTasks = visibleTasks();
  taskList.replaceChildren();

  filteredTasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark "${task.title}" as complete`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.title;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.setAttribute('aria-label', `Delete "${task.title}"`);
    deleteButton.innerHTML = '&times;';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    item.append(checkbox, text, deleteButton);
    taskList.append(item);
  });

  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} left`;
  clearCompletedButton.disabled = !tasks.some((task) => task.completed);
  clearCompletedButton.style.opacity = clearCompletedButton.disabled ? '0.45' : '1';

  const hasVisibleTasks = filteredTasks.length > 0;
  emptyState.hidden = hasVisibleTasks;
  if (!hasVisibleTasks) {
    const emptyCopy = {
      all: ['Nothing here yet', 'Add your first task above to get started.'],
      active: ['You are all caught up', 'Completed tasks are waiting in the Completed filter.'],
      completed: ['No completed tasks', 'Finish a task and it will appear here.'],
    }[currentFilter];
    emptyTitle.textContent = emptyCopy[0];
    emptyMessage.textContent = emptyCopy[1];
  }
}

function addTask(event) {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  tasks.unshift(createTask(title));
  saveTasks();
  taskInput.value = '';
  render();
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

taskForm.addEventListener('submit', addTask);
clearCompletedButton.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });
    render();
  });
});

render();
