// Dashboard functionality

// Update progress bar
function updateProgress() {
  const progress = taskManager.getTodayProgress();
  const progressBar = document.getElementById('today-progress');
  const progressText = document.getElementById('progress-text');
  
  if (progressBar) {
    progressBar.style.width = progress + '%';
    progressBar.textContent = progress + '%';
  }
  
  if (progressText) {
    const todayTasks = taskManager.getTodayTasks();
    const completed = todayTasks.filter(t => t.completed).length;
    const total = todayTasks.length;
    
    if (total === 0) {
      progressText.textContent = 'No tasks scheduled for today. Go to Schedule Task to add some!';
    } else if (completed === total) {
      progressText.textContent = `🎉 Congratulations! You've completed all ${total} tasks for today!`;
    } else {
      progressText.textContent = `${completed} of ${total} tasks completed. Keep going!`;
    }
  }
}

// Render dashboard tasks
function renderDashboardTasks() {
  const dashboardTasks = document.getElementById('dashboard-tasks');
  if (!dashboardTasks) return;
  
  const todayTasks = taskManager.getTodayTasks();
  const upcomingTasks = taskManager.getUpcomingTasks(3);
  const overdueTasks = taskManager.getOverdueTasks();
  
  let tasksHTML = '';
  
  // Show overdue tasks first
  if (overdueTasks.length > 0) {
    tasksHTML += '<li class="task-header overdue-header">⚠️ Overdue Tasks</li>';
    overdueTasks.slice(0, 3).forEach(task => {
      tasksHTML += `
        <li class="task-item-dashboard ${task.completed ? 'completed' : 'overdue'}">
          <input type="checkbox" ${task.completed ? 'checked' : ''} 
                 onchange="taskManager.toggleTask('${task.id}'); updateDashboard();">
          <span class="task-title">${task.title}</span>
          <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
        </li>
      `;
    });
  }
  
  // Show today's tasks
  if (todayTasks.length > 0) {
    tasksHTML += '<li class="task-header today-header">📅 Today</li>';
    todayTasks.slice(0, 5).forEach(task => {
      tasksHTML += `
        <li class="task-item-dashboard ${task.completed ? 'completed' : ''}">
          <input type="checkbox" ${task.completed ? 'checked' : ''} 
                 onchange="taskManager.toggleTask('${task.id}'); updateDashboard();">
          <span class="task-title">${task.title}</span>
          <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
        </li>
      `;
    });
  }
  
  // Show upcoming tasks
  if (upcomingTasks.length > 0) {
    tasksHTML += '<li class="task-header upcoming-header">📆 Upcoming</li>';
    upcomingTasks.slice(0, 3).forEach(task => {
      const dueDate = new Date(task.dueDate);
      const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
      tasksHTML += `
        <li class="task-item-dashboard ${task.completed ? 'completed' : ''}">
          <input type="checkbox" ${task.completed ? 'checked' : ''} 
                 onchange="taskManager.toggleTask('${task.id}'); updateDashboard();">
          <span class="task-title">${task.title}</span>
          <span class="task-date">in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}</span>
        </li>
      `;
    });
  }
  
  if (tasksHTML === '') {
    tasksHTML = '<li class="no-tasks">No tasks yet! <a href="schedule.html">Add your first task</a></li>';
  }
  
  dashboardTasks.innerHTML = tasksHTML;
}

// Update dashboard
function updateDashboard() {
  updateProgress();
  renderDashboardTasks();
}

// Initialize dashboard
if (window.location.pathname.includes('dashboard.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    
    // Update every minute
    setInterval(updateDashboard, 60000);
  });
}
