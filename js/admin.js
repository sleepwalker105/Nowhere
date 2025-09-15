// Admin Panel for Project Management - Always English
let isAdminMode = false;
let currentEditingProject = null;

// Force English for admin panel (independent of site language)
const ADMIN_LANGUAGE = 'en';

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

// Create admin button with English tooltip
function createAdminButton() {
    const adminButton = document.createElement('button');
    adminButton.id = 'admin-toggle';
    adminButton.innerHTML = '<i class="fas fa-cog"></i>';
    adminButton.title = 'Open Admin Panel'; // Always English
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

// Create admin panel - Always in English
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
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    adminPanel.innerHTML = getAdminPanelHTML();
    document.body.appendChild(adminPanel);
    console.log('Admin panel created! 📋');
}

// Get admin panel HTML (always English)
function getAdminPanelHTML() {
    return `
        <div style="padding: 2rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                <h2 style="color: var(--primary-color); margin: 0;">
                    <i class="fas fa-tools"></i> Admin Panel
                </h2>
                <button onclick="closeAdminPanel()" 
                        style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-color);"
                        title="Close Admin Panel">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- User Info Section -->
            <div class="admin-section" style="margin-bottom: 2rem; padding: 1rem; background: var(--card-bg); border-radius: 10px; border-left: 4px solid var(--accent-color);">
                <h4 style="color: var(--accent-color); margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fab fa-github"></i> Welcome, sleepwalker105
                </h4>
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-color); opacity: 0.8;">
                    Admin access to Nordmaling AS project management
                </p>
            </div>
            
            <!-- Add Project Section -->
            <div class="admin-section">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-plus-circle"></i> Add New Project
                </h3>
                
                <form id="admin-project-form" onsubmit="handleProjectSubmit(event)">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Project Name *</label>
                        <input type="text" id="project-name" required 
                               placeholder="e.g. Villa Hansen Exterior Painting"
                               style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Category *</label>
                        <select id="project-category" required 
                                style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                            <option value="">Select Category</option>
                            <option value="exterior">Exterior Painting</option>
                            <option value="interior">Interior Painting</option>
                            <option value="roof-painting">Roof Painting</option>
                            <option value="roof-cleaning">Roof Cleaning</option>
                            <option value="waste">Waste Management</option>
                            <option value="other">Other Services</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Description *</label>
                        <textarea id="project-description" required rows="4" 
                                  placeholder="Describe the project in detail..."
                                  style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color); resize: vertical;"></textarea>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Location</label>
                        <input type="text" id="project-location" 
                               placeholder="e.g. Mo i Rana, Helgeland"
                               style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                    </div>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Duration</label>
                            <input type="text" id="project-duration" 
                                   placeholder="e.g. 5 days"
                                   style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Area</label>
                            <input type="text" id="project-area" 
                                   placeholder="e.g. 180 m²"
                                   style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Client</label>
                        <input type="text" id="project-client" 
                               placeholder="e.g. Hansen Family / Nordland Company AS"
                               style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Project Images</label>
                        <input type="file" id="project-images" multiple accept="image/*" 
                               style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                        <small style="color: var(--text-color); opacity: 0.7; display: block; margin-top: 0.3rem;">
                            <i class="fas fa-info-circle"></i> Select multiple images to showcase the project
                        </small>
                    </div>
                    
                    <button type="submit" 
                            style="width: 100%; padding: 1rem; background: var(--gradient); color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 1rem; transition: all 0.3s ease;">
                        <i class="fas fa-plus"></i> Add Project
                    </button>
                </form>
            </div>
            
            <!-- Existing Projects Section -->
            <div class="admin-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-list"></i> Existing Projects
                </h3>
                <div id="admin-projects-list" style="max-height: 300px; overflow-y: auto;">
                    <!-- Projects list will be populated here -->
                </div>
            </div>
            
            <!-- Management Tools Section -->
            <div class="admin-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-tools"></i> Management Tools
                </h3>
                <div style="display: grid; gap: 0.5rem;">
                    <button onclick="exportProjects()" 
                            style="width: 100%; padding: 0.8rem; background: var(--secondary-color); color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-download"></i> Export Projects (JSON)
                    </button>
                    <button onclick="importProjects()" 
                            style="width: 100%; padding: 0.8rem; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-upload"></i> Import Projects
                    </button>
                    <button onclick="clearAllProjects()" 
                            style="width: 100%; padding: 0.8rem; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-trash"></i> Delete All Projects
                    </button>
                </div>
                <input type="file" id="import-file" accept=".json" style="display: none;" onchange="handleImportFile(this)">
            </div>
            
            <!-- Statistics Section -->
            <div class="admin-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-chart-bar"></i> Project Statistics
                </h3>
                <div id="admin-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <!-- Stats will be populated here -->
                </div>
            </div>
            
            <!-- Quick Actions Section -->
            <div class="admin-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-bolt"></i> Quick Actions
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem;">
                    <button onclick="addSampleProjects()" 
                            style="padding: 0.6rem; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-magic"></i> Add Samples
                    </button>
                    <button onclick="toggleAdminHelp()" 
                            style="padding: 0.6rem; background: #17a2b8; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-question-circle"></i> Help
                    </button>
                </div>
                
                <!-- Help Section (hidden by default) -->
                <div id="admin-help" style="display: none; margin-top: 1rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; font-size: 0.9rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">Admin Panel Help</h4>
                    <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.5;">
                        <li><strong>Ctrl + Shift + A:</strong> Toggle admin panel</li>
                        <li><strong>Escape:</strong> Close admin panel</li>
                        <li><strong>Add Project:</strong> Fill required fields (*)</li>
                        <li><strong>Images:</strong> Select multiple files for project gallery</li>
                        <li><strong>Export/Import:</strong> Backup and restore projects</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
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
        showAdminNotification('Admin panel opened', 'info');
        console.log('Admin panel opened! 🔓');
    } else {
        panel.style.right = '-100%';
        showAdminNotification('Admin panel closed', 'info');
        console.log('Admin panel closed! 🔒');
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
            
            // Update admin list and stats
            updateAdminProjectsList();
            updateAdminStats();
            
            showAdminNotification(`Project "${newProject.name}" added successfully!`, 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Save project error:', error);
        hideLoadingOverlay();
        showAdminNotification('Error saving project. Please try again.', 'error');
    }
}

// Update projects list in admin panel
function updateAdminProjectsList() {
    const listContainer = document.getElementById('admin-projects-list');
    if (!listContainer) return;
    
    const currentProjects = typeof projects !== 'undefined' ? projects : [];
    
    if (currentProjects.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-color); opacity: 0.7;">
                <i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                <p style="margin: 0;">No projects yet</p>
                <small>Add your first project using the form above</small>
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = currentProjects.map(project => `
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--secondary-color);">${project.name}</h4>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-color); opacity: 0.8;">
                        ${getCategoryDisplayName(project.category)} • ${project.location || 'Location not specified'}
                    </p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem; color: var(--text-color); opacity: 0.6;">
                        <i class="fas fa-calendar"></i> ${formatDate(project.date)}
                        ${project.images && project.images.length > 0 ? ` • <i class="fas fa-images"></i> ${project.images.length} image${project.images.length > 1 ? 's' : ''}` : ''}
                    </p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="editProject(${project.id})" 
                            title="Edit Project"
                            style="background: var(--secondary-color); color: white; border: none; padding: 0.4rem 0.7rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProject(${project.id})" 
                            title="Delete Project"
                            style="background: #dc3545; color: white; border: none; padding: 0.4rem 0.7rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
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
    
    const projectsWithImages = currentProjects.filter(p => p.images && p.images.length > 0).length;
    
    statsContainer.innerHTML = `
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary-color);">${totalProjects}</div>
            <div style="font-size: 0.9rem; color: var(--text-color);">Total Projects</div>
        </div>
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.8rem; font-weight: bold; color: var(--secondary-color);">${recentProjects}</div>
            <div style="font-size: 0.9rem; color: var(--text-color);">This Month</div>
        </div>
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--accent-color);">${projectsWithImages}</div>
            <div style="font-size: 0.9rem; color: var(--text-color);">With Images</div>
        </div>
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1rem; font-weight: bold; color: var(--primary-color);">
                ${totalProjects > 0 ? getCategoryDisplayName(mostCommonCategory) : 'N/A'}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-color);">Popular Category</div>
        </div>
    `;
}

// Add sample projects
function addSampleProjects() {
    if (!confirm('Add 3 sample projects? This will help you see how the system works.')) return;
    
    const sampleProjects = [
        {
            id: Date.now() + 1,
            name: "Villa Nordland Exterior",
            category: "exterior",
            description: "Complete exterior painting of a traditional Norwegian villa. Included surface preparation and two coats of weather-resistant paint.",
            location: "Mo i Rana",
            duration: "5 days",
            area: "200 m²",
            client: "Nordland Family",
            date: "2024-08-15",
            images: ["https://via.placeholder.com/400x300/ff6b35/ffffff?text=Villa+Exterior"]
        },
        {
            id: Date.now() + 2,
            name: "Office Building Interior",
            category: "interior",
            description: "Modern interior painting for a commercial office space. Used neutral colors to create a professional work environment.",
            location: "Mosjøen",
            duration: "3 days",
            area: "150 m²",
            client: "Business Solutions AS",
            date: "2024-09-01",
            images: ["https://via.placeholder.com/400x300/004e89/ffffff?text=Office+Interior"]
        },
        {
            id: Date.now() + 3,
            name: "Roof Restoration Project",
            category: "roof-painting",
            description: "Professional roof painting and waterproofing. Applied high-quality coating to protect against Norwegian weather conditions.",
            location: "Sandnessjøen",
            duration: "4 days",
            area: "120 m²",
            client: "Coastal Properties",
            date: "2024-09-10",
            images: ["https://via.placeholder.com/400x300/ffd23f/333333?text=Roof+Project"]
        }
    ];
    
    // Add to projects
    if (typeof projects !== 'undefined') {
        projects.push(...sampleProjects);
    } else {
        window.projects = sampleProjects;
    }
    
    // Save and update
    localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
    
    if (typeof renderProjects === 'function') {
        renderProjects();
    }
    
    updateAdminProjectsList();
    updateAdminStats();
    
    showAdminNotification('3 sample projects added successfully!', 'success');
}

// Toggle admin help
function toggleAdminHelp() {
    const helpSection = document.getElementById('admin-help');
    if (helpSection) {
        helpSection.style.display = helpSection.style.display === 'none' ? 'block' : 'none';
    }
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
    
    showAdminNotification(`Editing "${project.name}"`, 'info');
    
    // Scroll to form
    document.getElementById('project-name').scrollIntoView({ behavior: 'smooth' });
}

// Delete project
function deleteProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    if (!confirm(`Are you sure you want to delete "${project.name}"?\n\nThis action cannot be undone.`)) return;
    
    if (typeof projects !== 'undefined') {
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        
        if (typeof renderProjects === 'function') {
            renderProjects();
        }
        updateAdminProjectsList();
        updateAdminStats();
        
        showAdminNotification(`Project "${project.name}" deleted successfully`, 'success');
    }
}

// Clear all projects
function clearAllProjects() {
    if (!confirm('⚠️ DELETE ALL PROJECTS?\n\nThis will permanently delete all projects from the website.\nThis action CANNOT be undone!\n\nAre you absolutely sure?')) return;
    
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
    
    showAdminNotification('All projects deleted', 'success');
}

// Export projects
function exportProjects() {
    const currentProjects = typeof projects !== 'undefined' ? projects : [];
    
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
            
            // Handle different import formats
            if (importData.projects && Array.isArray(importData.projects)) {
                importedProjects = importData.projects; // New format
            } else if (Array.isArray(importData)) {
                importedProjects = importData; // Old format
            } else {
                throw new Error('Invalid file format');
            }
            
            // Validate projects structure
            const isValid = importedProjects.every(project => 
                project.name && project.category && project.description
            );
            
            if (!isValid) {
                throw new Error('Invalid project data structure');
            }
            
            // Add unique IDs to prevent conflicts
            importedProjects.forEach(project => {
                project.id = Date.now() + Math.random();
            });
            
            // Merge with existing projects
            if (typeof projects !== 'undefined') {
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
            
            showAdminNotification(`${importedProjects.length} projects imported successfully!`, 'success');
            
        } catch (error) {
            console.error('Import error:', error);
            showAdminNotification('Import failed. Please check file format.', 'error');
        }
    };
    
    reader.readAsText(file);
    input.value = ''; // Clear input
}

// Admin-specific notification system (always English)
function showAdminNotification(message, type = 'info', duration = 3000) {
    // Remove existing admin notifications
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
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.8rem;">
            <i class="${icons[type] || icons.info}"></i>
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: inherit; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-color);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 10001;
        border-left: 4px solid ${getNotificationColor(type)};
        min-width: 300px;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-size: 0.9rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
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

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
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

// Add admin-specific styles
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

    #admin-panel button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .admin-notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    @media (max-width: 768px) {
        #admin-panel {
            width: 100%;
            max-width: 100vw;
        }
        
        .admin-notification {
            top: 70px;
            right: 10px;
            left: 10px;
            min-width: auto;
        }
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
window.addSampleProjects = addSampleProjects;
window.toggleAdminHelp = toggleAdminHelp;

console.log('🔧 Admin panel loaded! Always in English for sleepwalker105 🚀');
console.log('📋 Available shortcuts: Ctrl+Shift+A (open), Escape (close)');
