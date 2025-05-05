document.addEventListener('DOMContentLoaded', loadTasks);
const form = document.getElementById('task-form');
const incompleteList = document.getElementById('incomplete-tasks');
const completedList = document.getElementById('completed-tasks');
const toast = document.getElementById('toast');

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('task-title').value.trim();
  const desc = document.getElementById('task-desc').value.trim();
  if (!title) return;
  const task = { id: Date.now(), title, desc, completed: false };
  addTask(task);
  saveTask(task);
  showToast('✅ Task Created');
  form.reset();
});

function addTask(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.draggable = true;
  li.dataset.id = task.id;
  li.innerHTML = `
    <span>${task.title}${task.desc ? ' - ' + task.desc : ''}</span>
    <div>
      <button class="edit">✏️</button>
      <button class="delete">🗑️</button>
    </div>
  `;
  li.addEventListener('dragstart', dragStart);
  li.querySelector('.edit').addEventListener('click', () => editTask(task, li));
  li.querySelector('.delete').addEventListener('click', () => deleteTask(task, li));
  (task.completed ? completedList : incompleteList).appendChild(li);
}

function editTask(task, li) {
  const newTitle = prompt('Edit Title', task.title);
  const newDesc = prompt('Edit Description', task.desc);
  if (newTitle !== null) {
    task.title = newTitle.trim() || task.title;
    task.desc = newDesc.trim();
    li.querySelector('span').textContent = `${task.title}${task.desc ? ' - ' + task.desc : ''}`;
    updateTask(task);
    showToast('✏️ Task Updated');
  }
}

function deleteTask(task, li) {
  li.remove();
  removeTask(task.id);
  showToast('🗑️ Task Deleted');
}

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const li = document.querySelector(`[data-id='${id}']`);
  const task = getTask(id);
  const targetList = e.target.closest('.task-list');
  targetList.appendChild(li);
  task.completed = targetList.id === 'completed-tasks';
  updateTask(task);
  showToast(task.completed ? '🔄 Task Moved to Completed' : '🔄 Task Moved to Incomplete');
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(updatedTask) {
  const tasks = getTasks().map(t => (t.id === updatedTask.id ? updatedTask : t));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(id) {
  const tasks = getTasks().filter(t => t.id != id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTask(id) {
  return getTasks().find(t => t.id == id);
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
  getTasks().forEach(addTask);
}

function showToast(message) {
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => (toast.style.display = 'none'), 2000);
}
