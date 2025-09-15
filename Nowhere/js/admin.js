// Обновленная админ-панель с GitHub интеграцией

// Загружаем проекты при старте
let projects = [];

async function initializeProjects() {
    showLoadingOverlay('Загружаем проекты из GitHub...');
    try {
        projects = await githubStorage.loadProjects();
        console.log(`Loaded ${projects.length} projects from GitHub`);
        renderProjects();
    } catch (error) {
        console.error('Failed to load projects:', error);
        // Fallback к локальному хранилищу
        const localProjects = localStorage.getItem('nordmaling_projects');
        if (localProjects) {
            projects = JSON.parse(localProjects);
        }
    }
    hideLoadingOverlay();
}

// Обновленная функция сохранения проекта
async function saveProject(projectData, imageFiles) {
    if (!githubStorage.config.token || githubStorage.config.token === 'ВАШ_GITHUB_TOKEN_ЗДЕСЬ') {
        showNotification('GitHub токен не настроен. Проект сохранен локально.', 'warning');
        saveProjectLocally(projectData, imageFiles);
        return;
    }

    showLoadingOverlay('Загружаем изображения на GitHub...');
    
    try {
        const imageUrls = [];
        
        // Загружаем все изображения
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const filename = githubStorage.generateFilename(file.name);
            
            updateLoadingProgress(`Загружаем изображение ${i + 1} из ${imageFiles.length}...`, 
                                (i / imageFiles.length) * 80); // 80% на изображения
            
            const imageUrl = await githubStorage.uploadImage(file, filename);
            if (imageUrl) {
                imageUrls.push(imageUrl);
            }
        }
        
        // Добавляем изображения к проекту
        projectData.images = imageUrls;
        projectData.id = Date.now();
        
        // Добавляем проект к списку
        projects.push(projectData);
        
        updateLoadingProgress('Сохраняем проект...', 90);
        
        // Сохраняем все проекты на GitHub
        const saved = await githubStorage.saveProjects(projects);
        
        if (saved) {
            updateLoadingProgress('Готово!', 100);
            
            setTimeout(() => {
                hideLoadingOverlay();
                showNotification('Проект успешно сохранен на GitHub!', 'success');
                renderProjects();
                closeAdminPanel();
            }, 1000);
        } else {
            throw new Error('Failed to save to GitHub');
        }
        
    } catch (error) {
        console.error('GitHub save failed:', error);
        hideLoadingOverlay();
        
        // Fallback к локальному сохранению
        showNotification('Ошибка сохранения на GitHub. Сохранено локально.', 'warning');
        saveProjectLocally(projectData, imageFiles);
    }
}

// Локальное сохранение как fallback
function saveProjectLocally(projectData, imageFiles) {
    // Создаем локальные URLs для изображений
    const imageUrls = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const localUrl = URL.createObjectURL(file);
        imageUrls.push(localUrl);
    }
    
    projectData.images = imageUrls;
    projectData.id = Date.now();
    
    projects.push(projectData);
    
    // Сохраняем в localStorage
    localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
    
    renderProjects();
    closeAdminPanel();
}

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
    const messageEl = overlay.querySelector('h3');
    
    if (progressBar) progressBar.style.width = percent + '%';
    if (status) status.textContent = Math.round(percent) + '%';
    if (messageEl) messageEl.textContent = message;
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('upload-overlay');
    if (overlay) overlay.remove();
}

// Инициализируем проекты при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('projects.html')) {
        initializeProjects();
    }
});

// Остальной код админ-панели остается тем же...