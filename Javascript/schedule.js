// Task Management System
class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();
  }

  // Load tasks from localStorage
  loadTasks() {
    const userId = auth.getCurrentUser()?.id;
    if (!userId) return [];
    
    const userTasks = localStorage.getItem(`tasks_${userId}`);
    return userTasks ? JSON.parse(userTasks) : [];
  }

  // Save tasks to localStorage
  saveTasks() {
    const userId = auth.getCurrentUser()?.id;
    if (!userId) return;
    
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(this.tasks));
    this.updateAnalytics();
  }

  // Add new task
  addTask(title, dueDate, priority, subject = 'General') {
    const task = {
      id: Date.now().toString(),
      title: title,
      dueDate: dueDate,
      priority: priority,
      subject: subject,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  // Update task
  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
      this.saveTasks();
      return this.tasks[taskIndex];
    }
    return null;
  }

  // Toggle task completion
  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      this.saveTasks();
      return task;
    }
    return null;
  }

  // Delete task
  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
  }

  // Get all tasks
  getTasks() {
    return this.tasks;
  }

  // Get tasks by date
  getTasksByDate(date) {
    return this.tasks.filter(t => t.dueDate === date);
  }

  // Get today's tasks
  getTodayTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => t.dueDate === today);
  }

  // Get upcoming tasks
  getUpcomingTasks(days = 7) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);
    
    return this.tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      return taskDate >= today && taskDate <= future;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  // Get overdue tasks
  getOverdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => t.dueDate < today && !t.completed);
  }

  // Get completion rate
  getCompletionRate() {
    if (this.tasks.length === 0) return 0;
    const completed = this.tasks.filter(t => t.completed).length;
    return Math.round((completed / this.tasks.length) * 100);
  }

  // Get today's progress
  getTodayProgress() {
    const todayTasks = this.getTodayTasks();
    if (todayTasks.length === 0) return 0;
    const completed = todayTasks.filter(t => t.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  }

  // Get tasks by subject
  getTasksBySubject() {
    const subjects = {};
    this.tasks.forEach(task => {
      const subject = task.subject || 'General';
      if (!subjects[subject]) {
        subjects[subject] = { total: 0, completed: 0 };
      }
      subjects[subject].total++;
      if (task.completed) subjects[subject].completed++;
    });
    return subjects;
  }

  // Update analytics data
  updateAnalytics() {
    const userId = auth.getCurrentUser()?.id;
    if (!userId) return;
    
    const analytics = {
      totalTasks: this.tasks.length,
      completedTasks: this.tasks.filter(t => t.completed).length,
      completionRate: this.getCompletionRate(),
      tasksBySubject: this.getTasksBySubject(),
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(`analytics_${userId}`, JSON.stringify(analytics));
  }
}

// Initialize task manager
const taskManager = new TaskManager();

// Schedule page functionality
if (window.location.pathname.includes('schedule.html')) {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');

  // Render tasks
  function renderTasks() {
    const tasks = taskManager.getTasks();
    
    if (tasks.length === 0) {
      taskList.innerHTML = '<li class="no-tasks">No tasks scheduled yet. Add one above!</li>';
      return;
    }
    
    // Sort tasks by date and priority
    const sortedTasks = tasks.sort((a, b) => {
      const dateCompare = new Date(a.dueDate) - new Date(b.dueDate);
      if (dateCompare !== 0) return dateCompare;
      
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    taskList.innerHTML = sortedTasks.map(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const isOverdue = dueDate < today && !task.completed;
      const isToday = dueDate.toDateString() === today.toDateString();
      
      return `
        <li class="task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
          <div class="task-checkbox">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="taskManager.toggleTask('${task.id}'); renderTasks(); updateDashboard();">
          </div>
          <div class="task-content">
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
              <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
              <span class="task-subject">${task.subject || 'General'}</span>
              <span class="task-date ${isToday ? 'today' : ''} ${isOverdue ? 'overdue' : ''}">
                ${isToday ? 'Today' : isOverdue ? 'Overdue' : formatDate(dueDate)}
              </span>
            </div>
          </div>
          <div class="task-actions">
            <button class="btn-edit" onclick="editTask('${task.id}')">✏️</button>
            <button class="btn-delete" onclick="taskManager.deleteTask('${task.id}'); renderTasks(); updateDashboard();">🗑️</button>
          </div>
        </li>
      `;
    }).join('');
  }

  // Format date
  function formatDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Edit task (simplified - inline editing could be added)
  window.editTask = function(taskId) {
    const task = taskManager.getTasks().find(t => t.id === taskId);
    if (task) {
      document.getElementById('task-title').value = task.title;
      document.getElementById('task-date').value = task.dueDate;
      document.getElementById('task-priority').value = task.priority;
      if (document.getElementById('task-subject')) {
        document.getElementById('task-subject').value = task.subject || 'General';
      }
      taskManager.deleteTask(taskId);
      renderTasks();
      document.getElementById('task-title').focus();
    }
  };

  // Update dashboard
  window.updateDashboard = function() {
    // Trigger dashboard update if on dashboard page
    if (typeof updateProgress === 'function') {
      updateProgress();
    }
  };

  // Add task form submission
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const dueDate = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;
    const subject = document.getElementById('task-subject')?.value || 'General';
    
    taskManager.addTask(title, dueDate, priority, subject);
    renderTasks();
    taskForm.reset();
    
    // Show success message
    showNotification('Task added successfully!', 'success');
  });

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Initial render
  renderTasks();
}
