// Authentication System
class Auth {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Check if user is logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  // Register new user
  register(username, email, password) {
    // Get existing users
    const users = this.getUsers();
    
    // Check if username already exists
    if (users.find(user => user.username === username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    // Check if email already exists
    if (users.find(user => user.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username: username,
      email: email,
      password: password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
      profile: {
        name: username,
        studyGoal: 'Not set',
        dailyGoal: 4
      }
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Registration successful!' };
  }

  // Login user
  login(username, password, remember = false) {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      if (remember) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      return { success: true, message: 'Login successful!' };
    }
    
    return { success: false, message: 'Invalid username or password' };
  }

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    
    if (!localStorage.getItem('rememberMe')) {
      // Clear session data but keep users
      const users = localStorage.getItem('users');
      localStorage.clear();
      if (users) {
        localStorage.setItem('users', users);
      }
    }
    
    window.location.href = 'login.html';
  }

  // Get all users
  getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Update user profile
  updateProfile(updates) {
    if (!this.currentUser) return { success: false, message: 'No user logged in' };
    
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === this.currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex].profile = { ...users[userIndex].profile, ...updates };
      this.currentUser.profile = users[userIndex].profile;
      
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      return { success: true, message: 'Profile updated successfully!' };
    }
    
    return { success: false, message: 'User not found' };
  }
}

// Initialize auth
const auth = new Auth();

// Login page functionality
if (window.location.pathname.includes('login.html')) {
  // Check if already logged in
  if (auth.isLoggedIn()) {
    window.location.href = 'dashboard.html';
  }

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const registerModal = document.getElementById('register-modal');
  const registerLink = document.getElementById('register-link');
  const closeModal = document.querySelector('.close');
  const errorMessage = document.getElementById('error-message');
  const registerErrorMessage = document.getElementById('register-error-message');

  // Show error message
  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }

  // Show success message
  function showSuccess(element, message) {
    element.textContent = message;
    element.className = 'success-message';
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
      element.className = 'error-message';
    }, 3000);
  }

  // Login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    const result = auth.login(username, password, remember);
    
    if (result.success) {
      showSuccess(errorMessage, result.message);
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showError(errorMessage, result.message);
    }
  });

  // Open register modal
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'flex';
  });

  // Close register modal
  closeModal.addEventListener('click', () => {
    registerModal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
      registerModal.style.display = 'none';
    }
  });

  // Register form submission
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      showError(registerErrorMessage, 'Passwords do not match');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      showError(registerErrorMessage, 'Password must be at least 6 characters');
      return;
    }
    
    const result = auth.register(username, email, password);
    
    if (result.success) {
      showSuccess(registerErrorMessage, result.message);
      setTimeout(() => {
        registerModal.style.display = 'none';
        registerForm.reset();
        // Auto-fill username in login form
        document.getElementById('username').value = username;
      }, 1500);
    } else {
      showError(registerErrorMessage, result.message);
    }
  });
}

// Check authentication on protected pages
if (!window.location.pathname.includes('login.html')) {
  if (!auth.isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Handle logout on all pages
document.addEventListener('DOMContentLoaded', () => {
  const logoutLinks = document.querySelectorAll('a[href="#logout"]');
  logoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to logout?')) {
        auth.logout();
      }
    });
  });
  
  // Update welcome message on dashboard
  if (auth.isLoggedIn() && window.location.pathname.includes('dashboard.html')) {
    const user = auth.getCurrentUser();
    const welcomeElement = document.querySelector('.dashboard-header h2');
    if (welcomeElement) {
      welcomeElement.textContent = `Welcome, ${user.profile.name || user.username}!`;
    }
  }
});
