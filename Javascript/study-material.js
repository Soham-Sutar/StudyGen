// Study Material Management System

class MaterialManager {
  constructor() {
    this.materials = this.loadMaterials();
  }

  // Load materials from localStorage
  loadMaterials() {
    const userId = auth.getCurrentUser()?.id;
    if (!userId) return [];
    
    const userMaterials = localStorage.getItem(`materials_${userId}`);
    return userMaterials ? JSON.parse(userMaterials) : this.getDefaultMaterials();
  }

  // Get default materials
  getDefaultMaterials() {
    return [
      {
        id: '1',
        title: 'Physics Notes - Mechanics',
        subject: 'Physics',
        description: 'Comprehensive notes covering Newton\'s laws, motion, and forces.',
        link: '#',
        createdAt: new Date('2025-11-01').toISOString()
      },
      {
        id: '2',
        title: 'Algebra Practice Sheets',
        subject: 'Mathematics',
        description: 'Practice problems for quadratic equations, polynomials, and functions.',
        link: '#',
        createdAt: new Date('2025-11-05').toISOString()
      },
      {
        id: '3',
        title: 'World History Timeline',
        subject: 'History',
        description: 'Key historical events from ancient civilizations to modern times.',
        link: '#',
        createdAt: new Date('2025-11-10').toISOString()
      }
    ];
  }

  // Save materials to localStorage
  saveMaterials() {
    const userId = auth.getCurrentUser()?.id;
    if (!userId) return;
    
    localStorage.setItem(`materials_${userId}`, JSON.stringify(this.materials));
  }

  // Add new material
  addMaterial(title, subject, description, link) {
    const material = {
      id: Date.now().toString(),
      title: title,
      subject: subject,
      description: description,
      link: link || '#',
      createdAt: new Date().toISOString()
    };
    
    this.materials.push(material);
    this.saveMaterials();
    return material;
  }

  // Delete material
  deleteMaterial(materialId) {
    this.materials = this.materials.filter(m => m.id !== materialId);
    this.saveMaterials();
  }

  // Get all materials
  getMaterials() {
    return this.materials;
  }

  // Get materials by subject
  getMaterialsBySubject(subject) {
    if (subject === 'all') return this.materials;
    return this.materials.filter(m => m.subject === subject);
  }

  // Search materials
  searchMaterials(query) {
    const lowerQuery = query.toLowerCase();
    return this.materials.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) ||
      m.description.toLowerCase().includes(lowerQuery) ||
      m.subject.toLowerCase().includes(lowerQuery)
    );
  }
}

// Initialize material manager
const materialManager = new MaterialManager();

// Study Material page functionality
if (window.location.pathname.includes('study-material.html')) {
  const materialForm = document.getElementById('material-form');
  const materialList = document.getElementById('material-list');
  const searchInput = document.getElementById('search-materials');
  const filterSelect = document.getElementById('filter-subject');

  // Render materials
  function renderMaterials(materials = null) {
    const materialsToRender = materials || materialManager.getMaterials();
    
    if (materialsToRender.length === 0) {
      materialList.innerHTML = `
        <div class="no-materials">
          <p>No study materials found.</p>
          <p>Add your first material using the form above!</p>
        </div>
      `;
      return;
    }
    
    // Sort by creation date (newest first)
    const sortedMaterials = materialsToRender.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    materialList.innerHTML = sortedMaterials.map(material => `
      <div class="material-item" data-material-id="${material.id}">
        <div class="material-header">
          <h4>${material.title}</h4>
          <span class="material-subject-badge">${material.subject}</span>
        </div>
        <p class="material-description">${material.description}</p>
        <div class="material-footer">
          <span class="material-date">Added: ${formatDate(new Date(material.createdAt))}</span>
          <div class="material-actions">
            ${material.link !== '#' ? 
              `<a href="${material.link}" target="_blank" class="btn-view" rel="noopener noreferrer">🔗 Open</a>` : 
              '<span class="btn-view disabled">No link</span>'
            }
            <button class="btn-delete" onclick="deleteMaterial('${material.id}')">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Format date
  function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Delete material
  window.deleteMaterial = function(materialId) {
    if (confirm('Are you sure you want to delete this material?')) {
      materialManager.deleteMaterial(materialId);
      applyFilters();
      showNotification('Material deleted successfully!', 'success');
    }
  };

  // Apply filters
  function applyFilters() {
    const searchQuery = searchInput.value.trim();
    const selectedSubject = filterSelect.value;
    
    let filteredMaterials = materialManager.getMaterials();
    
    // Apply subject filter
    if (selectedSubject !== 'all') {
      filteredMaterials = filteredMaterials.filter(m => m.subject === selectedSubject);
    }
    
    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filteredMaterials = filteredMaterials.filter(m =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery) ||
        m.subject.toLowerCase().includes(lowerQuery)
      );
    }
    
    renderMaterials(filteredMaterials);
  }

  // Add material form submission
  materialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('material-title').value;
    const subject = document.getElementById('material-subject').value;
    const description = document.getElementById('material-description').value;
    const link = document.getElementById('material-link').value;
    
    materialManager.addMaterial(title, subject, description, link);
    applyFilters();
    materialForm.reset();
    
    showNotification('Material added successfully!', 'success');
  });

  // Search input listener
  searchInput.addEventListener('input', applyFilters);

  // Filter select listener
  filterSelect.addEventListener('change', applyFilters);

  // Show notification
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Initial render
  renderMaterials();
}
