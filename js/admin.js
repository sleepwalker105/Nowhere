// Admin Panel for Project Management - English Version
let isAdminMode = false;
let currentEditingProject = null;

// Check loading
console.log('Admin panel script loaded! 🔧');

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('projects.html')) {
        console.log('Projects page detected, setting up admin panel...');
        createAdminButton();
        createAdminPanel();
        setupAdminKeyboardShortcut();
    }
});

// Create admin button
function createAdminButton() {
    const adminButton = document.createElement('button');
    adminButton.id = 'admin-toggle';
    adminButton.innerHTML = '<i class="fas fa-cog"></i>';
    adminButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: var(--gradient);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        box-shadow: var(--shadow);
        z-index: 1000;
        transition: all 0.3s ease;
        opacity: 0.7;
    `;
    
    adminButton.addEventListener('click', toggleAdminPanel);
    adminButton.addEventListener('mouseenter', () => {
        adminButton.style.opacity = '1';
        adminButton.style.transform = 'scale(1.1)';
    });
    adminButton.addEventListener('mouseleave', () => {
        adminButton.style.opacity = '0.7';
        adminButton.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(adminButton);
    console.log('Admin button created! ⚙️');
}

// Create admin panel
function createAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';
    adminPanel.style.cssText = `
        position: fixed;
        top: 0;
        right: -100%;
        width: 500px;
        max-width: 90vw;
        height: 100vh;
        background: var(--bg-color);
        box-shadow: -5px 0 20px rgba(0,0,0,0.3);
        z-index: 10000;
        transition: right 0.3s ease;
        overflow-y: auto;
        border-left: 3px solid var(--primary-color);
    `;
    
    adminPanel.innerHTML = `
        <div style="padding: 2rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                <h2 style="color: var(--primary-color); margin: 0;">
                    <i class="fas fa-tools"></i> Admin Panel
                </h2>
                <button onclick="closeAdminPanel()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-color);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="admin-section">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-plus-circle"></i> Add New Project
                </h3>
                
                <form id="admin-project-form" onsubmit="handleProjectSubmit(event)">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Project Name *</label>
                        <input type="text" id="project-name" required style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Category *</label>
                        <select id="project-category" required style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                            <option value="">Select Category</option>
                            <option value="exterior">Exterior Painting</option>
                            <option value="interior">Interior Painting</option>
                            <option value="roof-painting">Roof Painting</option>
                            <option value="roof-cleaning">Roof Cleaning</option>
                            <option value="waste">Waste Management</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Description *</label>
                        <textarea id="project-description" required rows="4" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color); resize: vertical;"></textarea>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Location</label>
                        <input type="text" id="project-location" placeholder="e.g. Mo i Rana" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                    </div>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Duration</label>
                            <input type="text" id="project-duration" placeholder="e.g. 5 days" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Area</label>
                            <input type="text" id="project-area" placeholder="e.g. 180 m²" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Client</label>
                        <input type="text" id="project-client" placeholder="e.g. Hansen Family" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Images</label>
                        <input type="file" id="project-images" multiple accept="image/*" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                        <small style="color: var(--text-color); opacity: 0.7;">You can select multiple images</small>
                    </div>
                    
                    <button type="submit" style="width: 100%; padding: 1rem; background: var(--gradient); color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 1rem;">
                        <i class="fas fa-plus"></i> Add Project
                    </button>
                </form>
            </div>
            
            <div class="admin-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-list"></i> Existing Projects
                </h3>
                <div id="admin-projects-list" style="max-height: 300px; overflow-y: auto;">
                    <!-- Projects list will be populated here -->
                </div>
            </div>
            
            <div class="admin-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-tools"></i> Tools
                </h3>
                <button onclick="clearAllProjects()" style="width: 100%; padding: 0.8rem; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 0.5rem;">
                    <i class="fas fa-trash"></i> Delete All Projects
                </button>
                <button onclick="exportProjects()" style="width: 100%; padding: 0.8rem; background: var(--secondary-color); color: white; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 0.5rem;">
                    <i class="fas fa-download"></i> Export Projects
                </button>
                <button onclick="importProjects()" style="width: 100%; padding: 0.8rem; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-upload"></i> Import Projects
                </button>
                <input type="file" id="import-file" accept=".json" style="display: none;" onchange="handleImportFile(this)">
            </div>
            
            <div class="admin-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-info-circle"></i> Statistics
                </h3>
                <div id="admin-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <!-- Stats will be populated here -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(adminPanel);
    console.log('Admin panel created! 📋');
}

// Toggle admin panel
function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (!panel) {
        console.error('Admin panel not found!');
        return;
    }
    
    isAdminMode = !isAdminMode;
    
    if (isAdminMode) {
        panel.style.right = '0';
        updateAdminProjectsList();
        updateAdminStats();
        console.log('Admin panel opened! 🔓');
    } else {
        panel.style.right = '-100%';
        console.log('Admin panel closed! 🔒');
    }
}

// Close admin panel
function closeAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
        panel.style.right = '-100%';
        isAdminMode = false;
    }
}

// Handle form submission
function handleProjectSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('project-name').value.trim(),
        category: document.getElementById('project-category').value,
        description: document.getElementById('project-description').value.trim(),
        location: document.getElementById('project-location').value.trim(),
        duration: document.getElementById('project-duration').value.trim(),
        area: document.getElementById('project-area').value.trim(),
        client: document.getElementById('project-client').value.trim(),
        date: new Date().toISOString().split('T')[0]
    };
    
    // Validation
    if (!formData.name || !formData.category || !formData.description) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    const imageFiles = document.getElementById('project-images').files;
    
    // Save project
    saveProject(formData, imageFiles);
}

// Save project (updated version)
async function saveProject(projectData, imageFiles) {
    try {
        showLoadingOverlay('Adding project...');
        
        const imageUrls = [];
        
        // Process images
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            
            // Create local image URL
            const localUrl = URL.createObjectURL(file);
            imageUrls.push(localUrl);
            
            updateLoadingProgress(`Processing image ${i + 1} of ${imageFiles.length}...`, 
                                ((i + 1) / imageFiles.length) * 80);
        }
        
        // Create project
        const newProject = {
            id: Date.now(),
            ...projectData,
            images: imageUrls
        };
        
        updateLoadingProgress('Saving project...', 90);
        
        // Add to projects list
        if (typeof projects !== 'undefined') {
            projects.push(newProject);
        } else {
            window.projects = [newProject];
        }
        
        // Save to localStorage
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        
        updateLoadingProgress('Done!', 100);
        
        setTimeout(() => {
            hideLoadingOverlay();
            
            // Update display
            if (typeof renderProjects === 'function') {
                renderProjects();
            }
            
            // Clear form
            document.getElementById('admin-project-form').reset();
            
            // Update admin list
            updateAdminProjectsList();
            updateAdminStats();
            
            showNotification('Project added successfully!', 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Save project error:', error);
        hideLoadingOverlay();
        showNotification('Error saving project!', 'error');
    }
}

// Update projects list in admin panel
function updateAdminProjectsList() {
    const listContainer = document.getElementById('admin-projects-list');
    if (!listContainer) return;
    
    const currentProjects = typeof projects !== 'undefined' ? projects : [];
    
    if (currentProjects.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: var(--text-color); opacity: 0.7;">No projects yet</p>';
        return;
    }
    
    listContainer.innerHTML = currentProjects.map(project => `
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--secondary-color);">${project.name}</h4>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-color); opacity: 0.8;">${getCategoryDisplayName(project.category)} • ${project.location || 'Unknown location'}</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem; color: var(--text-color); opacity: 0.6;">
                        <i class="fas fa-calendar"></i> ${formatDate(project.date)}
                    </p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="editProject(${project.id})" style="background: var(--secondary-color); color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProject(${project.id})" style="background: #dc3545; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update admin statistics
function updateAdminStats() {
    const statsContainer = document.getElementById('admin-stats');
    if (!statsContainer) return;
    
    const currentProjects = typeof projects !== 'undefined' ? projects : [];
    
    // Calculate stats
    const totalProjects = currentProjects.length;
    const categories = {};
    currentProjects.forEach(project => {
        categories[project.category] = (categories[project.category] || 0) + 1;
    });
    
    const mostCommonCategory = Object.keys(categories).reduce((a, b) => 
        categories[a] > categories[b] ? a : b, 'none');
    
    const recentProjects = currentProjects.filter(project => {
        const projectDate = new Date(project.date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return projectDate > monthAgo;
    }).length;
    
    statsContainer.innerHTML = `
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">${totalProjects}</div>
            <div style="font-size: 0.9rem; color: var(--text-color);">Total Projects</div>
        </div>
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--secondary-color);">${recentProjects}</div>
            <div style="font-size: 0.9rem; color: var(--text-color);">This Month</div>
        </div>
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; text-align: center; grid-column: 1 / -1;">
            <div style="font-size: 1rem; font-weight: bold; color: var(--accent-color);">${getCategoryDisplayName(mostCommonCategory)}</div>
            <div style="font-size: 0.9rem; color: var(--text-color);">Most Common Category</div>
        </div>
    `;
}

// Edit project
function editProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Fill form with project data
    document.getElementById('project-name').value = project.name || '';
    document.getElementById('project-category').value = project.category || '';
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-location').value = project.location || '';
    document.getElementById('project-duration').value = project.duration || '';
    document.getElementById('project-area').value = project.area || '';
    document.getElementById('project-client').value = project.client || '';
    
    // Store current editing project
    currentEditingProject = projectId;
    
    // Update submit button
    const submitBtn = document.querySelector('#admin-project-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Project';
        submitBtn.style.background = 'var(--secondary-color)';
    }
    
    showNotification('Project loaded for editing', 'info');
    
    // Scroll to form
    document.getElementById('project-name').scrollIntoView({ behavior: 'smooth' });
}

// Delete project
function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    if (typeof projects !== 'undefined') {
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        
        if (typeof renderProjects === 'function') {
            renderProjects();
        }
        updateAdminProjectsList();
        updateAdminStats();
        
        showNotification('Project deleted!', 'success');
    }
}

// Clear all projects
function clearAllProjects() {
    if (!confirm('Are you sure you want to delete ALL projects? This cannot be undone!')) return;
    
    if (typeof projects !== 'undefined') {
        projects.length = 0;
    } else {
        window.projects = [];
    }
    
    localStorage.removeItem('nordmaling_projects');
    
    if (typeof renderProjects === 'function') {
        renderProjects();
    }
    updateAdminProjectsList();
    updateAdminStats();
    
    showNotification('All projects deleted!', 'success');
}

// Export projects
function exportProjects() {
    const currentProjects = typeof projects !== 'undefined' ? projects : [];
    
    if (currentProjects.length === 0) {
        showNotification('No projects to export!', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(currentProjects, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `nordmaling-projects-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Projects exported!', 'success');
}

// Import projects
function importProjects() {
    document.getElementById('import-file').click();
}

// Handle import file
function handleImportFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedProjects = JSON.parse(e.target.result);
            
            if (!Array.isArray(importedProjects)) {
                throw new Error('Invalid file format');
            }
            
            // Validate projects structure
            const isValid = importedProjects.every(project => 
                project.name && project.category && project.description
            );
            
            if (!isValid) {
                throw new Error('Invalid project data structure');
            }
            
            // Merge with existing projects
            if (typeof projects !== 'undefined') {
                // Add unique IDs to prevent conflicts
                importedProjects.forEach(project => {
                    project.id = Date.now() + Math.random();
                });
                
                projects.push(...importedProjects);
            } else {
                window.projects = importedProjects;
            }
            
            // Save to localStorage
            localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
            
            // Update display
            if (typeof renderProjects === 'function') {
                renderProjects();
            }
            updateAdminProjectsList();
            updateAdminStats();
            
            showNotification(`${importedProjects.length} projects imported successfully!`, 'success');
            
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Error importing projects. Please check file format.', 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Clear input
    input.value = '';
}

// Get category display name
function getCategoryDisplayName(category) {
    const names = {
        'exterior': 'Exterior Painting',
        'interior': 'Interior Painting',
        'roof-painting': 'Roof Painting',
        'roof-cleaning': 'Roof Cleaning',
        'waste': 'Waste Management',
        'other': 'Other'
    };
    return names[category] || 'Other';
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    
    try {
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return dateString;
    }
}

// Keyboard shortcuts
function setupAdminKeyboardShortcut() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + Shift + A to open admin panel
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            toggleAdminPanel();
        }
        
        // Escape to close admin panel
        if (e.key === 'Escape' && isAdminMode) {
            closeAdminPanel();
        }
    });
}

// Loading utilities
function showLoadingOverlay(message, progress = 0) {
    let overlay = document.getElementById('upload-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'upload-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
        `;
        document.body.appendChild(overlay);
    }
    
    overlay.innerHTML = `
        <div style="text-align: center; max-width: 400px;">
            <div class="loading-spinner" style="margin: 0 auto 2rem; width: 60px; height: 60px; border-width: 6px;"></div>
            <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">${message}</h3>
            <div style="width: 100%; background: rgba(255,255,255,0.2); border-radius: 15px; padding: 3px;">
                <div id="upload-progress" style="width: ${progress}%; height: 20px; background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); border-radius: 12px; transition: width 0.3s ease;"></div>
            </div>
            <p id="upload-status" style="margin-top: 1rem; opacity: 0.8;">${Math.round(progress)}%</p>
        </div>
    `;
}

function updateLoadingProgress(message, percent) {
    const progressBar = document.getElementById('upload-progress');
    const status = document.getElementById('upload-status');
    const overlay = document.getElementById('upload-overlay');
    const messageEl = overlay ? overlay.querySelector('h3') : null;
    
    if (progressBar) progressBar.style.width = percent + '%';
    if (status) status.textContent = Math.round(percent) + '%';
    if (messageEl) messageEl.textContent = message;
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('upload-overlay');
    if (overlay) overlay.remove();
}

// Add spinner styles
const adminStyles = document.createElement('style');
adminStyles.textContent = `
    .loading-spinner {
        display: inline-block;
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: var(--primary-color);
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    #admin-panel::-webkit-scrollbar {
        width: 8px;
    }

    #admin-panel::-webkit-scrollbar-track {
        background: var(--bg-color);
    }

    #admin-panel::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 4px;
    }

    #admin-panel::-webkit-scrollbar-thumb:hover {
        background: var(--secondary-color);
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        border-color: var(--primary-color);
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    .admin-section {
        margin-bottom: 1rem;
    }

    .admin-section h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(adminStyles);

// Export functions
window.toggleAdminPanel = toggleAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.handleProjectSubmit = handleProjectSubmit;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.clearAllProjects = clearAllProjects;
window.exportProjects = exportProjects;
window.importProjects = importProjects;
window.handleImportFile = handleImportFile;

console.log('English Admin panel fully loaded! Ready to manage projects! 🚀');
