// Analytics Page Functionality

// Analytics data manager
class AnalyticsManager {
  constructor() {
    this.tasks = taskManager.getTasks();
  }

  // Get performance data for last N weeks
  getPerformanceData(weeks = 4) {
    const data = [];
    const labels = [];
    const today = new Date();
    
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - 6);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (i * 7));
      
      const weekTasks = this.tasks.filter(t => {
        const taskDate = new Date(t.createdAt);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });
      
      const completed = weekTasks.filter(t => t.completed).length;
      const total = weekTasks.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      data.push(percentage);
      labels.push(`Week ${weeks - i}`);
    }
    
    return { labels, data };
  }

  // Get time spent data by subject
  getTimeSpentBySubject() {
    const subjects = {};
    
    this.tasks.forEach(task => {
      const subject = task.subject || 'General';
      subjects[subject] = (subjects[subject] || 0) + 1;
    });
    
    const labels = Object.keys(subjects);
    const data = Object.values(subjects);
    
    return { labels, data };
  }

  // Get completion rate data
  getCompletionRateData() {
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = this.tasks.length - completed;
    
    return {
      labels: ['Completed', 'Pending'],
      data: [completed, pending]
    };
  }

  // Get daily activity data for last 7 days
  getDailyActivity() {
    const data = [];
    const labels = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTasks = this.tasks.filter(t => t.dueDate === dateStr);
      const completed = dayTasks.filter(t => t.completed).length;
      
      data.push(completed);
      
      if (i === 0) {
        labels.push('Today');
      } else if (i === 1) {
        labels.push('Yesterday');
      } else {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
    }
    
    return { labels, data };
  }

  // Get productivity stats
  getProductivityStats() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(t => t.completed).length;
    const overdueTasks = taskManager.getOverdueTasks().length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate
    };
  }
}

// Initialize analytics on page load
if (window.location.pathname.includes('analytics.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const analyticsManager = new AnalyticsManager();
    
    // Display stats
    displayStats(analyticsManager);
    
    // Initialize charts
    initializeCharts(analyticsManager);
  });
}

// Display productivity stats
function displayStats(analyticsManager) {
  const stats = analyticsManager.getProductivityStats();
  
  // Create stats section if it doesn't exist
  const analyticsMain = document.querySelector('.analytics');
  if (!analyticsMain) return;
  
  let statsSection = document.querySelector('.stats-overview');
  if (!statsSection) {
    statsSection = document.createElement('section');
    statsSection.className = 'stats-overview';
    analyticsMain.insertBefore(statsSection, analyticsMain.firstChild.nextSibling);
  }
  
  statsSection.innerHTML = `
    <h3>Productivity Overview</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-value">${stats.totalTasks}</div>
        <div class="stat-label">Total Tasks</div>
      </div>
      <div class="stat-card success">
        <div class="stat-icon">✅</div>
        <div class="stat-value">${stats.completedTasks}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card ${stats.overdueTasks > 0 ? 'warning' : ''}">
        <div class="stat-icon">⚠️</div>
        <div class="stat-value">${stats.overdueTasks}</div>
        <div class="stat-label">Overdue</div>
      </div>
      <div class="stat-card ${stats.completionRate >= 70 ? 'success' : stats.completionRate >= 40 ? 'warning' : 'danger'}">
        <div class="stat-icon">🎯</div>
        <div class="stat-value">${stats.completionRate}%</div>
        <div class="stat-label">Completion Rate</div>
      </div>
    </div>
  `;
}

// Initialize all charts
function initializeCharts(analyticsManager) {
  // Performance Chart
  const performanceData = analyticsManager.getPerformanceData();
  const performanceCtx = document.getElementById('performanceChart');
  if (performanceCtx) {
    new Chart(performanceCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: performanceData.labels,
        datasets: [{
          label: 'Task Completion Rate (%)',
          data: performanceData.data,
          borderColor: '#50fa7b',
          backgroundColor: 'rgba(80, 250, 123, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#f8f8f2',
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: '#f8f8f2',
              callback: function(value) {
                return value + '%';
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#f8f8f2'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }

  // Time Spent by Subject Chart
  const timeSpentData = analyticsManager.getTimeSpentBySubject();
  const timeSpentCtx = document.getElementById('timeSpentChart');
  if (timeSpentCtx) {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    new Chart(timeSpentCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: timeSpentData.labels,
        datasets: [{
          label: 'Tasks by Subject',
          data: timeSpentData.data,
          backgroundColor: colors.slice(0, timeSpentData.labels.length),
          borderColor: '#282a36',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#f8f8f2',
              padding: 15,
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  // Completion Rate Chart
  const completionData = analyticsManager.getCompletionRateData();
  const completionCtx = document.getElementById('completionRateChart');
  if (completionCtx) {
    new Chart(completionCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: completionData.labels,
        datasets: [{
          label: 'Number of Tasks',
          data: completionData.data,
          backgroundColor: ['#4CAF50', '#FF5733'],
          borderColor: ['#45a049', '#cc4629'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#f8f8f2',
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#f8f8f2',
              stepSize: 1
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#f8f8f2'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }

  // Daily Activity Chart (Additional chart)
  createDailyActivityChart(analyticsManager);
}

// Create daily activity chart
function createDailyActivityChart(analyticsManager) {
  const analyticsMain = document.querySelector('.analytics');
  if (!analyticsMain) return;
  
  // Check if section already exists
  let dailySection = document.querySelector('.daily-activity');
  if (!dailySection) {
    dailySection = document.createElement('section');
    dailySection.className = 'daily-activity';
    dailySection.innerHTML = `
      <h3>Daily Activity (Last 7 Days)</h3>
      <canvas id="dailyActivityChart"></canvas>
    `;
    analyticsMain.appendChild(dailySection);
  }
  
  const dailyData = analyticsManager.getDailyActivity();
  const dailyCtx = document.getElementById('dailyActivityChart');
  
  if (dailyCtx) {
    new Chart(dailyCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: dailyData.labels,
        datasets: [{
          label: 'Tasks Completed',
          data: dailyData.data,
          backgroundColor: '#50fa7b',
          borderColor: '#45d96b',
          borderWidth: 2,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#f8f8f2',
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#f8f8f2',
              stepSize: 1
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#f8f8f2'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}
