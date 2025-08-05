const addButton = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const taskTimeInput = document.getElementById('task-time');
const tasklist = document.getElementById('task-list');

// Load tasks from localStorage on page load
window.addEventListener('load', loadTasksFromStorage);

addButton.addEventListener('click', function () {
    const taskText = taskInput.value.trim();
    const taskTime = taskTimeInput.value;

    if (taskText === '') {
        alert("Please enter a task.");
        return;
    }

    addTaskToDOM(taskText, taskTime, false); // Add to UI
    saveTask(taskText, taskTime); // Save to localStorage

    taskInput.value = '';
    taskTimeInput.value = '';
});

// Add task to the UI
function addTaskToDOM(taskText, taskTime, isCompleted) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (isCompleted) {
        li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.innerHTML = `<strong>${taskText}</strong> <br><small>${formatTime(taskTime)}</small>`;

    // Mark Complete Button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = '✔';
    completeBtn.className = 'complete-btn';
    completeBtn.onclick = function () {
        li.classList.toggle('completed');
        updateStorage();
    };

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function () {
        tasklist.removeChild(li);
        updateStorage();
    };

    const btnGroup = document.createElement('div');
    btnGroup.className = 'task-buttons';
    btnGroup.appendChild(completeBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btnGroup);

    tasklist.appendChild(li);
}

// Save task to localStorage
function saveTask(taskText, taskTime) {
    const tasks = getTasksFromStorage();
    tasks.push({ text: taskText, time: taskTime, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get tasks from localStorage
function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Load tasks and display
function loadTasksFromStorage() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.time, task.completed);
    });
}

// Update localStorage when complete/delete happens
function updateStorage() {
    const taskElements = document.querySelectorAll('.task-item');
    const updatedTasks = [];

    taskElements.forEach(li => {
        const rawHTML = li.querySelector('span').innerHTML;
        const textMatch = rawHTML.match(/<strong>(.*?)<\/strong>/);
        const timeMatch = rawHTML.match(/<small>(.*?)<\/small>/);

        const text = textMatch ? textMatch[1] : '';
        const time = timeMatch ? unformatTime(timeMatch[1]) : '';
        const completed = li.classList.contains('completed');
        updatedTasks.push({ text, time, completed });
    });

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Helper: Convert 24hr time to 12hr AM/PM
function formatTime(timeStr) {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
}

// Helper: Convert back to 24hr format for localStorage
function unformatTime(timeDisplay) {
    const [time, period] = timeDisplay.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}
