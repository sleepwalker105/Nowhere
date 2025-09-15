// Admin Panel for Project Management - Working Version
let isAdminMode = false;
let currentEditingProject = null;

// Admin language is always English
const ADMIN_LANGUAGE = 'en';

console.log('🔧 Admin panel script loading...');

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('projects.html')) {
        console.log('✅ Projects page detected, setting up admin panel...');
        setTimeout(() => {
            createAdminButton();
            createAdminPanel();
            setupAdminKeyboardShortcut();
        }, 1000); // Wait for projects to load
    }
});

// Create floating admin button
function createAdminButton() {
    // Remove existing button if any
    const existingButton = document.getElementById('admin-toggle');
    if (existingButton) existingButton.remove();
    
    const adminButton = document.createElement('button');
    adminButton.id = 'admin-toggle';
    adminButton.innerHTML = '<i class="fas fa-cog"></i>';
    adminButton.title = 'Open Admin Panel (Ctrl+Shift+A)';
    adminButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(45deg, #ff6b35, #004e89);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        transition: all 0.3s ease;
        opacity: 0.8;
    `;
    
    adminButton.addEventListener('click', toggleAdminPanel);
    adminButton.addEventListener('mouseenter', () => {
        adminButton.style.opacity = '1';
        adminButton.style.transform = 'scale(1.1)';
        adminButton.style.boxShadow = '0 6px 25px rgba(0,0,0,0.4)';
    });
    adminButton.addEventListener('mouseleave', () => {
        adminButton.style.opacity = '0.8';
        adminButton.style.transform = 'scale(1)';
        adminButton.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    });
    
    document.body.appendChild(adminButton);
    console.log('⚙️ Admin button created');
}

// Create admin panel
function createAdminPanel() {
    // Remove existing panel if any
    const existingPanel = document.getElementById('admin-panel');
    if (existingPanel) existingPanel.remove();
    
    const adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';
    adminPanel.style.cssText = `
        position: fixed;
        top: 0;
        right: -100%;
        width: 500px;
        max-width: 90vw;
        height: 100vh;
        background: #ffffff;
        box-shadow: -5px 0 25px rgba(0,0,0,0.3);
        z-index: 10000;
        transition: right 0.3s ease;
        overflow-y: auto;
        border-left: 4px solid #ff6b35;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    adminPanel.innerHTML = getAdminPanelHTML();
    document.body.appendChild(adminPanel);
    console.log('📋 Admin panel created');
}

// Get admin panel HTML
function getAdminPanelHTML() {
    return `
        <div style="padding: 2rem; height: 100%; overflow-y: auto;">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0;">
                <h2 style="color: #ff6b35; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-tools"></i> Admin Panel
                </h2>
                <button onclick="closeAdminPanel()" 
                        style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666; padding: 0.5rem; border-radius: 50%; transition: all 0.2s;"
                        onmouseover="this.style.background='#f0f0f0'"
                        onmouseout="this.style.background='none'"
                        title="Close Admin Panel">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- User Info -->
            <div style="background: linear-gradient(45deg, #17a2b8, #6f42c1); color: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
                <h4 style="margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fab fa-github"></i> Welcome, sleepwalker105
                </h4>
                <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">
                    Admin access to Nordmaling AS project management system
                </p>
            </div>
            
            <!-- Statistics -->
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
                <h3 style="color: #004e89; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-chart-bar"></i> Project Statistics
                </h3>
                <div id="admin-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <!-- Stats will be populated here -->
                </div>
            </div>
            
            <!-- Add Project Form -->
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
                <h3 style="color: #28a745; margin: 0 0 1.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-plus-circle"></i> Add New Project
                </h3>
                
                <form id="admin-project-form" onsubmit="handleProjectSubmit(event)">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">Project Name *</label>
                        <input type="text" id="project-name" required 
                               placeholder="e.g. Villa Hansen Exterior Painting"
                               style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">Category *</label>
                        <select id="project-category" required 
                                style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                            <option value="">Select Category</option>
                            <option value="exterior">Exterior Painting</option>
                            <option value="interior">Interior Painting</option>
                            <option value="roof-painting">Roof Painting</option>
                            <option value="roof-cleaning">Roof Cleaning</option>
                            <option value="waste">Waste Management</option>
                            <option value="other">Other Services</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">Description *</label>
                        <textarea id="project-description" required rows="3" 
                                  placeholder="Describe the project in detail..."
                                  style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; resize: vertical; box-sizing: border-box;"></textarea>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">Location</label>
                            <input type="text" id="project-location" 
                                   placeholder="e.g. Mo i Rana"
                                   style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">Duration</label>
                            <input type="text" id="project-duration" 
                                   placeholder="e.g. 5 days"
                                   style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">Area</label>
                            <input type="text" id="project-area" 
                                   placeholder="e.g. 180 m²"
                                   style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">Client</label>
                            <input type="text" id="project-client" 
                                   placeholder="e.g. Hansen Family"
                                   style="width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
                        </div>
                    </div>
                    
                    <button type="submit" id="submit-btn"
                            style="width: 100%; padding: 1rem; background: linear-gradient(45deg, #28a745, #20c997); color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 1rem; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'"
                            onmouseout="this.style.transform='translateY(0)'">
                        <i class="fas fa-plus"></i> Add Project
                    </button>
                </form>
            </div>
            
            <!-- Project List -->
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
                <h3 style="color: #6f42c1; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-list"></i> Manage Projects
                </h3>
                <div id="admin-projects-list" style="max-height: 400px; overflow-y: auto;">
                    <!-- Projects list will be populated here -->
                </div>
            </div>
            
            <!-- Management Tools -->
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px;">
                <h3 style="color: #dc3545; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-tools"></i> Management Tools
                </h3>
                <div style="display: grid; gap: 0.8rem;">
                    <button onclick="exportProjects()" 
                            style="width: 100%; padding: 0.8rem; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.background='#0056b3'"
                            onmouseout="this.style.background='#007bff'">
                        <i class="fas fa-download"></i> Export Projects (JSON)
                    </button>
                    <button onclick="importProjects()" 
                            style="width: 100%; padding: 0.8rem; background: #17a2b8; color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.background='#117a8b'"
                            onmouseout="this.style.background='#17a2b8'">
                        <i class="fas fa-upload"></i> Import Projects
                    </button>
                    <button onclick="addSampleProjects()" 
                            style="width: 100%; padding: 0.8rem; background: #ffc107; color: #333; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.background='#e0a800'"
                            onmouseout="this.style.background='#ffc107'">
                        <i class="fas fa-magic"></i> Add Sample Projects
                    </button>
                    <button onclick="clearAllProjects()" 
                            style="width: 100%; padding: 0.8rem; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;"
                            onmouseover="this.style.background='#c82333'"
                            onmouseout="this.style.background='#dc3545'">
                        <i class="fas fa-trash"></i> Delete All Projects
                    </button>
                </div>
                <input type="file" id="import-file" accept=".json" style="display: none;" onchange="handleImportFile(this)">
            </div>
        </div>
    `;
}

// Toggle admin panel
function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (!panel) {
        console.error('❌ Admin panel not found!');
        return;
    }
    
    isAdminMode = !isAdminMode;
    
    if (isAdminMode) {
        panel.style.right = '0';
        updateAdminProjectsList();
        updateAdminStats();
        showAdminNotification('Admin panel opened', 'info');
        console.log('🔓 Admin panel opened');
    } else {
        panel.style.right = '-100%';
        showAdminNotification('Admin panel closed', 'info');
        console.log('🔒 Admin panel closed');
    }
}

// Close admin panel
function closeAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
        panel.style.right = '-100%';
        isAdminMode = false;
        showAdminNotification('Admin panel closed', 'info');
    }
}

// Handle form submission
function handleProjectSubmit(event) {
    event.preventDefault();
    
    console.log('📝 Processing form submission...');
    
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
        showAdminNotification('Please fill in all required fields (marked with *)', 'error');
        return;
    }
    
    console.log('✅ Form data validated:', formData);
    
    if (currentEditingProject) {
        updateExistingProject(currentEditingProject, formData);
    } else {
        addNewProject(formData);
    }
}

// Add new project
function addNewProject(projectData) {
    console.log('➕ Adding new project...');
    
    try {
        const newProject = {
            id: Date.now(),
            ...projectData
        };
        
        // Add to global projects array
        if (typeof window.projects !== 'undefined') {
            window.projects.push(newProject);
            console.log('📦 Added to window.projects, total:', window.projects.length);
        } else {
            window.projects = [newProject];
            console.log('📦 Created window.projects array');
        }
        
        // Save to localStorage
        localStorage.setItem('nordmaling_projects', JSON.stringify(window.projects));
        console.log('💾 Saved to localStorage');
        
        // Trigger re-render of projects
        if (typeof window.initProjects === 'function') {
            window.initProjects();
        } else {
            // Fallback: reload page
            console.log('🔄 Reloading page to show new project...');
            setTimeout(() => location.reload(), 500);
        }
        
        // Clear form
        document.getElementById('admin-project-form').reset();
        currentEditingProject = null;
        
        // Update admin panel
        updateAdminProjectsList();
        updateAdminStats();
        
        showAdminNotification(`Project "${newProject.name}" added successfully!`, 'success');
        
    } catch (error) {
        console.error('❌ Error adding project:', error);
        showAdminNotification('Error adding project. Please try again.', 'error');
    }
}

// Update existing project
function updateExistingProject(projectId, projectData) {
    console.log('✏️ Updating project:', projectId);
    
    try {
        if (typeof window.projects !== 'undefined') {
            const index = window.projects.findIndex(p => p.id === projectId);
            if (index !== -1) {
                window.projects[index] = { ...window.projects[index], ...projectData };
                
                // Save to localStorage
                localStorage.setItem('nordmaling_projects', JSON.stringify(window.projects));
                
                // Trigger re-render
                if (typeof window.initProjects === 'function') {
                    window.initProjects();
                } else {
                    setTimeout(() => location.reload(), 500);
                }
                
                // Reset form
                document.getElementById('admin-project-form').reset();
                document.getElementById('submit-btn').innerHTML = '<i class="fas fa-plus"></i> Add Project';
                currentEditingProject = null;
                
                updateAdminProjectsList();
                updateAdminStats();
                
                showAdminNotification('Project updated successfully!', 'success');
            }
        }
    } catch (error) {
        console.error('❌ Error updating project:', error);
        showAdminNotification('Error updating project.', 'error');
    }
}

// Update projects list in admin panel
function updateAdminProjectsList() {
    const listContainer = document.getElementById('admin-projects-list');
    if (!listContainer) return;
    
    const currentProjects = window.projects || [];
    console.log('📋 Updating admin list with', currentProjects.length, 'projects');
    
    if (currentProjects.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666; background: white; border-radius: 8px;">
                <i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
                <p style="margin: 0;">No projects yet</p>
                <small>Add your first project using the form above</small>
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = currentProjects.map(project => `
        <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid ${getCategoryColor(project.category)}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #333; font-size: 1.1rem;">${project.name}</h4>
                    <p style="margin: 0; font-size: 0.9rem; color: #666;">
                        <i class="fas fa-tag"></i> ${getCategoryDisplayName(project.category)} • 
                        <i class="fas fa-map-marker-alt"></i> ${project.location || 'Location not specified'}
                    </p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem; color: #999;">
                        <i class="fas fa-calendar"></i> ${formatDate(project.date)}
                        ${project.duration ? ` • <i class="fas fa-clock"></i> ${project.duration}` : ''}
                        ${project.area ? ` • <i class="fas fa-ruler"></i> ${project.area}` : ''}
                    </p>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-left: 1rem;">
                    <button onclick="editProject(${project.id})" 
                            title="Edit Project"
                            style="background: #007bff; color: white; border: none; padding: 0.4rem 0.7rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s;"
                            onmouseover="this.style.background='#0056b3'"
                            onmouseout="this.style.background='#007bff'">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProject(${project.id})" 
                            title="Delete Project"
                            style="background: #dc3545; color: white; border: none; padding: 0.4rem 0.7rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s;"
                            onmouseover="this.style.background='#c82333'"
                            onmouseout="this.style.background='#dc3545'">
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
    
    const currentProjects = window.projects || [];
    const totalProjects = currentProjects.length;
    
    // Calculate category stats
    const categories = {};
    currentProjects.forEach(project => {
        categories[project.category] = (categories[project.category] || 0) + 1;
    });
    
    const mostCommonCategory = Object.keys(categories).reduce((a, b) => 
        categories[a] > categories[b] ? a : b, 'none');
    
    // Recent projects (last 30 days)
    const recentProjects = currentProjects.filter(project => {
        const projectDate = new Date(project.date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return projectDate > monthAgo;
    }).length;
    
    statsContainer.innerHTML = `
        <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-size: 1.8rem; font-weight: bold; color: #ff6b35;">${totalProjects}</div>
            <div style="font-size: 0.9rem; color: #666;">Total Projects</div>
        </div>
        <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-size: 1.8rem; font-weight: bold; color: #28a745;">${recentProjects}</div>
            <div style="font-size: 0.9rem; color: #666;">This Month</div>
        </div>
    `;
}

// Edit project
function editProject(projectId) {
    console.log('✏️ Editing project:', projectId);
    
    const currentProjects = window.projects || [];
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) {
        showAdminNotification('Project not found', 'error');
        return;
    }
    
    // Fill form with project data
    document.getElementById('project-name').value = project.name || '';
    document.getElementById('project-category').value = project.category || '';
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-location').value = project.location || '';
    document.getElementById('project-duration').value = project.duration || '';
    document.getElementById('project-area').value = project.area || '';
    document.getElementById('project-client').value = project.client || '';
    
    // Update submit button
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Project';
        submitBtn.style.background = 'linear-gradient(45deg, #007bff, #0056b3)';
    }
    
    // Store current editing project
    currentEditingProject = projectId;
    
    showAdminNotification(`Editing "${project.name}"`, 'info');
    
    // Scroll to form
    document.getElementById('project-name').scrollIntoView({ behavior: 'smooth' });
}

// Delete project
function deleteProject(projectId) {
    console.log('🗑️ Deleting project:', projectId);
    
    const currentProjects = window.projects || [];
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) return;
    
    if (!confirm(`Are you sure you want to delete "${project.name}"?\n\nThis action cannot be undone.`)) return;
    
    try {
        // Remove from array
        window.projects = currentProjects.filter(p => p.id !== projectId);
        
        // Save to localStorage
        localStorage.setItem('nordmaling_projects', JSON.stringify(window.projects));
        
        // Trigger re-render
        if (typeof window.initProjects === 'function') {
            window.initProjects();
        } else {
            setTimeout(() => location.reload(), 500);
        }
        
        updateAdminProjectsList();
        updateAdminStats();
        
        showAdminNotification(`Project "${project.name}" deleted successfully`, 'success');
        
    } catch (error) {
        console.error('❌ Error deleting project:', error);
        showAdminNotification('Error deleting project', 'error');
    }
}

// Clear all projects
function clearAllProjects() {
    if (!confirm('⚠️ DELETE ALL PROJECTS?\n\nThis will permanently delete all projects from the website.\nThis action CANNOT be undone!\n\nAre you absolutely sure?')) return;
    
    try {
        window.projects = [];
        localStorage.removeItem('nordmaling_projects');
        
        if (typeof window.initProjects === 'function') {
            window.initProjects();
        } else {
            setTimeout(() => location.reload(), 500);
        }
        
        updateAdminProjectsList();
        updateAdminStats();
        
        showAdminNotification('All projects deleted', 'success');
        
    } catch (error) {
        console.error('❌ Error clearing projects:', error);
        showAdminNotification('Error clearing projects', 'error');
    }
}

// Add sample projects
function addSampleProjects() {
    if (!confirm('Add 3 sample projects? This will help you see how the system works.')) return;
    
    const sampleProjects = [
        {
            id: Date.now() + 1,
            name: "Sample Villa Exterior",
            category: "exterior",
            description: "Complete exterior painting of a traditional Norwegian villa. Included surface preparation and two coats of weather-resistant paint.",
            location: "Mo i Rana",
            duration: "5 days",
            area: "200 m²",
            client: "Nordland Family",
            date: "2024-08-15"
        },
        {
            id: Date.now() + 2,
            name: "Sample Office Interior",
            category: "interior",
            description: "Modern interior painting for a commercial office space. Used neutral colors to create a professional work environment.",
            location: "Mosjøen",
            duration: "3 days",
            area: "150 m²",
            client: "Business Solutions AS",
            date: "2024-09-01"
        },
        {
            id: Date.now() + 3,
            name: "Sample Roof Project",
            category: "roof-painting",
            description: "Professional roof painting and waterproofing. Applied high-quality coating to protect against Norwegian weather conditions.",
            location: "Sandnessjøen",
            duration: "4 days",
            area: "120 m²",
            client: "Coastal Properties",
            date: "2024-09-10"
        }
    ];
    
    try {
        if (!window.projects) window.projects = [];
        window.projects.push(...sampleProjects);
        
        localStorage.setItem('nordmaling_projects', JSON.stringify(window.projects));
        
        if (typeof window.initProjects === 'function') {
            window.initProjects();
        } else {
            setTimeout(() => location.reload(), 500);
        }
        
        updateAdminProjectsList();
        updateAdminStats();
        
        showAdminNotification('3 sample projects added successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error adding samples:', error);
        showAdminNotification('Error adding sample projects', 'error');
    }
}

// Export projects
function exportProjects() {
    const currentProjects = window.projects || [];
    
    if (currentProjects.length === 0) {
        showAdminNotification('No projects to export', 'warning');
        return;
    }
    
    const exportData = {
        version: "1.0",
        exported: new Date().toISOString(),
        exportedBy: "sleepwalker105",
        projectCount: currentProjects.length,
        projects: currentProjects
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `nordmaling-projects-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showAdminNotification(`${currentProjects.length} projects exported successfully!`, 'success');
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
            const importData = JSON.parse(e.target.result);
            let importedProjects = [];
            
            if (importData.projects && Array.isArray(importData.projects)) {
                importedProjects = importData.projects;
            } else if (Array.isArray(importData)) {
                importedProjects = importData;
            } else {
                throw new Error('Invalid file format');
            }
            
            // Validate projects
            const isValid = importedProjects.every(project => 
                project.name && project.category && project.description
            );
            
            if (!isValid) {
                throw new Error('Invalid project data structure');
            }
            
            // Add unique IDs
            importedProjects.forEach(project => {
                project.id = Date.now() + Math.random();
            });
            
            // Merge with existing
            if (!window.projects) window.projects = [];
            window.projects.push(...importedProjects);
            
            localStorage.setItem('nordmaling_projects', JSON.stringify(window.projects));
            
            if (typeof window.initProjects === 'function') {
                window.initProjects();
            } else {
                setTimeout(() => location.reload(), 500);
            }
            
            updateAdminProjectsList();
            updateAdminStats();
            
            showAdminNotification(`${importedProjects.length} projects imported successfully!`, 'success');
            
        } catch (error) {
            console.error('❌ Import error:', error);
            showAdminNotification('Import failed. Please check file format.', 'error');
        }
    };
    
    reader.readAsText(file);
    input.value = '';
}

// Utility functions
function getCategoryDisplayName(category) {
    const names = {
        'exterior': 'Exterior Painting',
        'interior': 'Interior Painting',
        'roof-painting': 'Roof Painting',
        'roof-cleaning': 'Roof Cleaning',
        'waste': 'Waste Management',
        'other': 'Other Services'
    };
    return names[category] || 'Other';
}

function getCategoryColor(category) {
    const colors = {
        'exterior': '#ff6b35',
        'interior': '#004e89',
        'roof-painting': '#ffd23f',
        'roof-cleaning': '#28a745',
        'waste': '#6c757d',
        'other': '#17a2b8'
    };
    return colors[category] || '#ff6b35';
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (error) {
        return dateString;
    }
}

// Admin notification system
function showAdminNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.admin-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.8rem;">
            <i class="${icons[type]}" style="color: ${colors[type]};"></i>
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: inherit; cursor: pointer; opacity: 0.7; padding: 0.2rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10001;
        border-left: 4px solid ${colors[type]};
        min-width: 300px;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-size: 0.9rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

// Keyboard shortcuts
function setupAdminKeyboardShortcut() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            toggleAdminPanel();
        }
        
        if (e.key === 'Escape' && isAdminMode) {
            closeAdminPanel();
        }
    });
}

// Export functions for global use
window.toggleAdminPanel = toggleAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.handleProjectSubmit = handleProjectSubmit;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.clearAllProjects = clearAllProjects;
window.exportProjects = exportProjects;
window.importProjects = importProjects;
window.handleImportFile = handleImportFile;
window.addSampleProjects = addSampleProjects;

console.log('🔧 Admin panel loaded and ready! Always in English for sleepwalker105 🚀');
