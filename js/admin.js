// Админ-панель для управления проектами
let isAdminMode = false;
let currentEditingProject = null;

// Проверяем загрузку
console.log('Admin panel script loaded! 🔧');

// Инициализация админ-панели
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('projects.html')) {
        console.log('Projects page detected, setting up admin panel...');
        createAdminButton();
        createAdminPanel();
        setupAdminKeyboardShortcut();
    }
});

// Создаем кнопку админки
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

// Создаем панель админки
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
                    <i class="fas fa-plus-circle"></i> Legg til nytt prosjekt
                </h3>
                
                <form id="admin-project-form" onsubmit="handleProjectSubmit(event)">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Prosjektnavn *</label>
                        <input type="text" id="project-name" required style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Kategori *</label>
                        <select id="project-category" required style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                            <option value="">Velg kategori</option>
                            <option value="exterior">Utendørs maling</option>
                            <option value="interior">Innendørs maling</option>
                            <option value="roof-painting">Takmaling</option>
                            <option value="roof-cleaning">Takrensing</option>
                            <option value="waste">Avfallshåndtering</option>
                            <option value="other">Annet</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Beskrivelse *</label>
                        <textarea id="project-description" required rows="4" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color); resize: vertical;"></textarea>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Lokasjon</label>
                        <input type="text" id="project-location" placeholder="f.eks. Mo i Rana" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                    </div>
                    
                    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Varighet</label>
                            <input type="text" id="project-duration" placeholder="f.eks. 5 dager" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Område</label>
                            <input type="text" id="project-area" placeholder="f.eks. 180 m²" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Klient</label>
                        <input type="text" id="project-client" placeholder="f.eks. Familie Hansen" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Bilder</label>
                        <input type="file" id="project-images" multiple accept="image/*" style="width: 100%; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--card-bg); color: var(--text-color);">
                        <small style="color: var(--text-color); opacity: 0.7;">Du kan velge flere bilder</small>
                    </div>
                    
                    <button type="submit" style="width: 100%; padding: 1rem; background: var(--gradient); color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 1rem;">
                        <i class="fas fa-plus"></i> Legg til prosjekt
                    </button>
                </form>
            </div>
            
            <div class="admin-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-list"></i> Eksisterende prosjekter
                </h3>
                <div id="admin-projects-list" style="max-height: 300px; overflow-y: auto;">
                    <!-- Projects list will be populated here -->
                </div>
            </div>
            
            <div class="admin-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">
                    <i class="fas fa-tools"></i> Verktøy
                </h3>
                <button onclick="clearAllProjects()" style="width: 100%; padding: 0.8rem; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 0.5rem;">
                    <i class="fas fa-trash"></i> Slett alle prosjekter
                </button>
                <button onclick="exportProjects()" style="width: 100%; padding: 0.8rem; background: var(--secondary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-download"></i> Eksporter prosjekter
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(adminPanel);
    console.log('Admin panel created! 📋');
}

// Переключение админ-панели
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
        console.log('Admin panel opened! 🔓');
    } else {
        panel.style.right = '-100%';
        console.log('Admin panel closed! 🔒');
    }
}

// Закрытие админ-панели
function closeAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
        panel.style.right = '-100%';
        isAdminMode = false;
    }
}

// Обработка отправки формы
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
    
    // Валидация
    if (!formData.name || !formData.category || !formData.description) {
        showNotification('Fyll ut alle obligatoriske felt!', 'error');
        return;
    }
    
    const imageFiles = document.getElementById('project-images').files;
    
    // Сохраняем проект
    saveProject(formData, imageFiles);
}

// Сохранение проекта (обновленная версия)
async function saveProject(projectData, imageFiles) {
    try {
        showLoadingOverlay('Legger til prosjekt...');
        
        const imageUrls = [];
        
        // Обрабатываем изображения
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            
            // Создаем локальную ссылку на изображение
            const localUrl = URL.createObjectURL(file);
            imageUrls.push(localUrl);
            
            updateLoadingProgress(`Behandler bilde ${i + 1} av ${imageFiles.length}...`, 
                                ((i + 1) / imageFiles.length) * 80);
        }
        
        // Создаем проект
        const newProject = {
            id: Date.now(),
            ...projectData,
            images: imageUrls
        };
        
        updateLoadingProgress('Lagrer prosjekt...', 90);
        
        // Добавляем к списку проектов
        if (typeof projects !== 'undefined') {
            projects.push(newProject);
        } else {
            window.projects = [newProject];
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        
        updateLoadingProgress('Ferdig!', 100);
        
        setTimeout(() => {
            hideLoadingOverlay();
            
            // Обновляем отображение
            if (typeof renderProjects === 'function') {
                renderProjects();
            }
            
            // Очищаем форму
            document.getElementById('admin-project-form').reset();
            
            // Обновляем список в админке
            updateAdminProjectsList();
            
            showNotification('Prosjekt lagt til!', 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Save project error:', error);
        hideLoadingOverlay();
        showNotification('Feil ved lagring av prosjekt!', 'error');
    }
}

// Обновление списка проектов в админке
function updateAdminProjectsList() {
    const listContainer = document.getElementById('admin-projects-list');
    if (!listContainer) return;
    
    const currentProjects = typeof projects !== 'undefined' ? projects : [];
    
    if (currentProjects.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: var(--text-color); opacity: 0.7;">Ingen prosjekter ennå</p>';
        return;
    }
    
    listContainer.innerHTML = currentProjects.map(project => `
        <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
            <div style="display: flex; justify-content: between; align-items: start;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--secondary-color);">${project.name}</h4>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-color); opacity: 0.8;">${project.category} • ${project.location || 'Ukjent lokasjon'}</p>
                </div>
                <button onclick="deleteProject(${project.id})" style="background: #dc3545; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Удаление проекта
function deleteProject(projectId) {
    if (!confirm('Er du sikker på at du vil slette dette prosjektet?')) return;
    
    if (typeof projects !== 'undefined') {
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        
        if (typeof renderProjects === 'function') {
            renderProjects();
        }
        updateAdminProjectsList();
        
        showNotification('Prosjekt slettet!', 'success');
    }
}

// Очистка всех проектов
function clearAllProjects() {
    if (!confirm('Er du sikker på at du vil slette ALLE prosjekter? Dette kan ikke angres!')) return;
    
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
    
    showNotification('Alle prosjekter slettet!', 'success');
}

// Экспорт проектов
function exportProjects() {
    const currentProjects = typeof projects !== 'undefined' ? projects : [];
    
    if (currentProjects.length === 0) {
        showNotification('Ingen prosjekter å eksportere!', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(currentProjects, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `nordmaling-projects-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Prosjekter eksportert!', 'success');
}

// Клавиатурные сокращения
function setupAdminKeyboardShortcut() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + Shift + A для открытия админки
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            toggleAdminPanel();
        }
        
        // Escape для закрытия админки
        if (e.key === 'Escape' && isAdminMode) {
            closeAdminPanel();
        }
    });
}

// Утилиты для загрузки
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

// Добавляем стили для spinner
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
`;
document.head.appendChild(adminStyles);

// Экспортируем функции
window.toggleAdminPanel = toggleAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.handleProjectSubmit = handleProjectSubmit;
window.deleteProject = deleteProject;
window.clearAllProjects = clearAllProjects;
window.exportProjects = exportProjects;

console.log('Admin panel fully loaded! Ready to manage projects! 🚀');
