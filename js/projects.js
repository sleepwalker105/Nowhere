// Projects Management System for Nordmaling AS
let projects = [];
let filteredProjects = [];
let currentFilter = 'all';
let currentSearchTerm = '';

// Глобальная переменная для доступа из админ-панели
window.projects = projects;

// Проверяем загрузку
console.log('Projects script loaded! 📋');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('projects.html')) {
        console.log('Projects page detected, initializing...');
        initializeProjects();
        setupSearchAndFilters();
        setupProjectInteractions();
    }
});

// Инициализация проектов
async function initializeProjects() {
    try {
        await loadProjects();
        filteredProjects = [...projects];
        renderProjects();
        updateProjectsCount();
        console.log(`Initialized with ${projects.length} projects`);
    } catch (error) {
        console.error('Failed to initialize projects:', error);
        showNotification('Feil ved lasting av prosjekter', 'error');
    }
}

// Загрузка проектов из различных источников
async function loadProjects() {
    // 1. Попытка загрузки из GitHub (если доступно)
    if (window.githubStorage) {
        try {
            const githubProjects = await githubStorage.loadProjects();
            if (githubProjects && githubProjects.length > 0) {
                projects = githubProjects;
                window.projects = projects;
                console.log(`Loaded ${projects.length} projects from GitHub`);
                return;
            }
        } catch (error) {
            console.log('GitHub loading failed, trying localStorage...', error);
        }
    }

    // 2. Fallback к localStorage
    try {
        const localProjects = localStorage.getItem('nordmaling_projects');
        if (localProjects) {
            projects = JSON.parse(localProjects);
            window.projects = projects;
            console.log(`Loaded ${projects.length} projects from localStorage`);
            return;
        }
    } catch (error) {
        console.log('localStorage loading failed, using default projects...', error);
    }

    // 3. Последний fallback - демо проекты
    projects = getDefaultProjects();
    window.projects = projects;
    console.log('Using default demo projects');
}

// Демо-проекты для показа
function getDefaultProjects() {
    return [
        {
            id: 1,
            name: "Villa Haugen Utendørs",
            category: "exterior",
            description: "Komplett utendørs maling av villa i Mo i Rana. Inkludert overflatebehandling og to strøk kvalitetsmaling. Prosjektet tok 5 dager å fullføre og kunden var svært fornøyd med resultatet. Brukt værbestandig maling som beskytter mot norske værforhold.",
            images: ["https://via.placeholder.com/400x300/ff6b35/ffffff?text=Villa+Haugen"],
            date: "2024-03-15",
            location: "Mo i Rana",
            client: "Familie Haugen",
            duration: "5 dager",
            area: "180 m²"
        },
        {
            id: 2,
            name: "Leilighet Sentrum Innendørs",
            category: "interior",
            description: "Innendørs maling av 3-roms leilighet i sentrum av Mosjøen. Alle rom malt med miljøvennlig maling. Spesielt fokus på stue og soverom med moderne fargepalette.",
            images: ["https://via.placeholder.com/400x300/004e89/ffffff?text=Leilighet+Sentrum"],
            date: "2024-02-28",
            location: "Mosjøen",
            client: "Privat leietaker",
            duration: "3 dager",
            area: "85 m²"
        },
        {
            id: 3,
            name: "Takprosjekt Nedre Rana",
            category: "roof-painting",
            description: "Takmaling og impregnering av enebolig. Komplett renovering av takflater med høykvalitets takbelegg som beskytter mot norske værforhold. Inkludert inspeksjon og reparasjon av skader.",
            images: ["https://via.placeholder.com/400x300/ffd23f/333333?text=Tak+Rana"],
            date: "2024-01-20",
            location: "Rana",
            client: "Eiendomsselskap Nord AS",
            duration: "7 dager",
            area: "120 m²"
        },
        {
            id: 4,
            name: "Hytte Sandnessjøen Renovering",
            category: "exterior",
            description: "Fullstendig utvendig renovering av tradisjonell norsk hytte. Inkludert slipearbeid, grunning og to strøk med traditionell rød farge. Restaurering av historiske detaljer.",
            images: ["https://via.placeholder.com/400x300/dc3545/ffffff?text=Hytte+Renovering"],
            date: "2024-04-10",
            location: "Sandnessjøen", 
            client: "Familie Olsen",
            duration: "6 dager",
            area: "95 m²"
        },
        {
            id: 5,
            name: "Kontor Mosjøen Interiør",
            category: "interior",
            description: "Moderne interiørmaling av kontorbygg. Brukt nøytrale farger for å skape et profesjonelt og rolig arbeidsmiljø. Inkludert maling av møterom og fellesarealer.",
            images: ["https://via.placeholder.com/400x300/17a2b8/ffffff?text=Kontor+Interior"],
            date: "2024-05-05",
            location: "Mosjøen",
            client: "Nordland Consulting AS",
            duration: "4 dager",
            area: "200 m²"
        },
        {
            id: 6,
            name: "Barnehage Hemnes Fargerikt",
            category: "interior",
            description: "Fargerik innendørs maling av barnehage. Brukt barnevennlige og allergivennlige malinger i lyse, glade farger. Spesielle tegninger og motiver for barna.",
            images: ["https://via.placeholder.com/400x300/28a745/ffffff?text=Barnehage+Colors"],
            date: "2024-06-12",
            location: "Hemnes",
            client: "Hemnes Kommune",
            duration: "8 dager",
            area: "300 m²"
        }
    ];
}

// Рендеринг проектов
function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) {
        console.error('Projects container not found!');
        return;
    }

    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="no-projects-message">
                <div class="no-projects-content">
                    <i class="fas fa-search" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem; opacity: 0.7;"></i>
                    <h3 data-translate="no-projects">Ingen prosjekter funnet</h3>
                    <p style="color: var(--text-color); opacity: 0.8; margin-bottom: 2rem;">
                        ${currentSearchTerm ? 
                            `Ingen prosjekter matcher "${currentSearchTerm}"` : 
                            'Prøv å endre filter eller søkeord'
                        }
                    </p>
                    <button onclick="clearFilters()" class="clear-filters-btn">
                        <i class="fas fa-undo"></i> Tilbakestill filter
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const projectsHTML = filteredProjects.map(project => createProjectCard(project)).join('');
    projectsContainer.innerHTML = projectsHTML;

    // Применяем переводы к новым элементам
    if (typeof applyTranslations === 'function' && typeof currentLanguage !== 'undefined') {
        applyTranslations(currentLanguage);
    }

    // Настраиваем ленивую загрузку изображений
    setupLazyLoading();
}

// Создание карточки проекта
function createProjectCard(project) {
    const imageUrl = project.images && project.images.length > 0 
        ? project.images[0] 
        : `https://via.placeholder.com/400x300/${getCategoryColor(project.category)}/ffffff?text=${encodeURIComponent(project.name)}`;

    const categoryTranslationKey = getCategoryTranslationKey(project.category);
    
    return `
        <div class="project-card" data-category="${project.category}" data-id="${project.id}">
            <div class="project-image">
                <img src="${imageUrl}" 
                     alt="${project.name}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x300/ff6b35/ffffff?text=Nordmaling+AS'">
                <div class="project-overlay">
                    <div class="project-actions">
                        <button onclick="openProjectModal(${project.id})" class="project-btn primary">
                            <i class="fas fa-eye"></i> Se detaljer
                        </button>
                        <button onclick="shareProject(${project.id})" class="project-btn secondary">
                            <i class="fas fa-share"></i> Del
                        </button>
                    </div>
                </div>
                <div class="project-category-badge" data-translate="${categoryTranslationKey}">
                    ${getCategoryDisplayName(project.category)}
                </div>
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${project.name}</h3>
                    <div class="project-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(project.date)}
                    </div>
                </div>
                <div class="project-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${project.location || 'Ukjent lokasjon'}
                </div>
                <p class="project-description">${truncateText(project.description, 120)}</p>
                <div class="project-stats">
                    ${project.duration ? `<span><i class="fas fa-clock"></i> ${project.duration}</span>` : ''}
                    ${project.area ? `<span><i class="fas fa-ruler"></i> ${project.area}</span>` : ''}
                    ${project.client ? `<span><i class="fas fa-user"></i> ${project.client}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Утилиты для категорий
function getCategoryColor(category) {
    const colors = {
        'exterior': 'ff6b35',
        'interior': '004e89',
        'roof-painting': 'ffd23f',
        'roof-cleaning': '28a745',
        'waste': '6c757d',
        'other': '17a2b8'
    };
    return colors[category] || 'ff6b35';
}

function getCategoryTranslationKey(category) {
    const keys = {
        'exterior': 'filter-exterior',
        'interior': 'filter-interior',
        'roof-painting': 'filter-roof-painting',
        'roof-cleaning': 'filter-roof-cleaning',
        'waste': 'filter-waste',
        'other': 'filter-other'
    };
    return keys[category] || 'filter-other';
}

function getCategoryDisplayName(category) {
    const names = {
        'exterior': 'Utendørs maling',
        'interior': 'Innendørs maling',
        'roof-painting': 'Takmaling',
        'roof-cleaning': 'Takrensing',
        'waste': 'Avfallshåndtering',
        'other': 'Annet'
    };
    return names[category] || 'Annet';
}

// Настройка поиска и фильтров
function setupSearchAndFilters() {
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Поиск с debounce
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            applyFilters();
        }, 300));
    }

    // Фильтры категорий
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
            currentFilter = filter;
            applyFilters();
        });
    });
}

// Применение фильтров
function applyFilters() {
    filteredProjects = projects.filter(project => {
        // Фильтр по категории
        const matchesCategory = currentFilter === 'all' || project.category === currentFilter;
        
        // Фильтр по поиску
        const matchesSearch = !currentSearchTerm || 
            project.name.toLowerCase().includes(currentSearchTerm) ||
            project.description.toLowerCase().includes(currentSearchTerm) ||
            (project.location && project.location.toLowerCase().includes(currentSearchTerm)) ||
            (project.client && project.client.toLowerCase().includes(currentSearchTerm));

        return matchesCategory && matchesSearch;
    });

    renderProjects();
    updateProjectsCount();
}

// Установка активного фильтра
function setActiveFilter(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-filter="${filter}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Сброс фильтров
function clearFilters() {
    currentFilter = 'all';
    currentSearchTerm = '';
    
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    setActiveFilter('all');
    filteredProjects = [...projects];
    renderProjects();
    updateProjectsCount();
}

// Обновление счетчика проектов
function updateProjectsCount() {
    const countElement = document.getElementById('projects-count');
    if (countElement) {
        const total = projects.length;
        const filtered = filteredProjects.length;
        
        if (currentFilter === 'all' && !currentSearchTerm) {
            countElement.textContent = `${total} prosjekter`;
        } else {
            countElement.textContent = `${filtered} av ${total} prosjekter`;
        }
    }
}

// Модальное окно проекта
function openProjectModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const modalContent = `
        <div class="modal-content" style="
            background: var(--bg-color);
            border-radius: 15px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: modalSlideIn 0.3s ease;
        ">
            <button onclick="this.closest('.project-modal').remove()" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: var(--text-color);
                z-index: 1;
            ">
                <i class="fas fa-times"></i>
            </button>
            
            ${project.images && project.images.length > 0 ? `
                <div class="modal-image" style="
                    height: 300px;
                    background-image: url('${project.images[0]}');
                    background-size: cover;
                    background-position: center;
                    border-radius: 15px 15px 0 0;
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        bottom: 1rem;
                        left: 1rem;
                        background: rgba(0,0,0,0.7);
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 20px;
                        font-size: 0.9rem;
                    ">
                        ${getCategoryDisplayName(project.category)}
                    </div>
                </div>
            ` : ''}
            
            <div style="padding: 2rem;">
                <h2 style="color: var(--primary-color); margin-bottom: 1rem;">${project.name}</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div class="modal-info-item">
                        <strong><i class="fas fa-map-marker-alt"></i> Lokasjon:</strong>
                        <span>${project.location || 'Ikke oppgitt'}</span>
                    </div>
                    <div class="modal-info-item">
                        <strong><i class="fas fa-calendar"></i> Dato:</strong>
                        <span>${formatDate(project.date)}</span>
                    </div>
                    ${project.duration ? `
                        <div class="modal-info-item">
                            <strong><i class="fas fa-clock"></i> Varighet:</strong>
                            <span>${project.duration}</span>
                        </div>
                    ` : ''}
                    ${project.area ? `
                        <div class="modal-info-item">
                            <strong><i class="fas fa-ruler"></i> Område:</strong>
                            <span>${project.area}</span>
                        </div>
                    ` : ''}
                    ${project.client ? `
                        <div class="modal-info-item">
                            <strong><i class="fas fa-user"></i> Klient:</strong>
                            <span>${project.client}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 data-translate="project-description">Prosjektbeskrivelse</h3>
                    <p style="line-height: 1.6; color: var(--text-color);">${project.description}</p>
                </div>
                
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button onclick="shareProject(${project.id})" style="
                        background: var(--gradient);
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">
                        <i class="fas fa-share"></i> Del prosjekt
                    </button>
                    <a href="../pages/contact.html" style="
                        background: var(--secondary-color);
                        color: white;
                        text-decoration: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 8px;
                        font-weight: bold;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-envelope"></i> Kontakt oss
                    </a>
                </div>
            </div>
        </div>
    `;

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    // Анимация появления
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Применяем переводы
    if (typeof applyTranslations === 'function' && typeof currentLanguage !== 'undefined') {
        applyTranslations(currentLanguage);
    }
}

// Поделиться проектом
function shareProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const shareData = {
        title: `${project.name} - Nordmaling AS`,
        text: `Se dette flotte malerprosjektet: ${project.name} i ${project.location || 'Norge'}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        // Fallback - копирование в буфер обмена
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Prosjektlink kopiert!', 'success');
        }).catch(() => {
            showNotification('Kunne ikke kopiere link', 'error');
        });
    }
}

// Настройка взаимодействий
function setupProjectInteractions() {
    // Ленивая загрузка изображений
    setupLazyLoading();
    
    // Анимации при скролле
    setupScrollAnimations();
}

// Ленивая загрузка изображений
function setupLazyLoading() {
    const images = document.querySelectorAll('.project-card img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Анимации при скролле
function setupScrollAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    projectCards.forEach(card => cardObserver.observe(card));
}

// Утилиты
function formatDate(dateString) {
    if (!dateString) return 'Ukjent dato';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    try {
        return date.toLocaleDateString('no-NO', options);
    } catch (error) {
        return dateString;
    }
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Сохранение проектов (используется админ-панелью)
function saveProjectsToStorage() {
    try {
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        console.log('Projects saved to localStorage');
        return true;
    } catch (error) {
        console.error('Failed to save projects:', error);
        return false;
    }
}

// Добавление нового проекта (используется админ-панелью)
function addProject(projectData) {
    const newProject = {
        id: Date.now(),
        ...projectData,
        date: projectData.date || new Date().toISOString().split('T')[0]
    };
    
    projects.push(newProject);
    window.projects = projects; // Обновляем глобальную переменную
    
    saveProjectsToStorage();
    applyFilters(); // Перерендериваем с учетом текущих фильтров
    
    return newProject;
}

// Удаление проекта (используется админ-панелью)
function removeProject(projectId) {
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
        projects.splice(index, 1);
        window.projects = projects; // Обновляем глобальную переменную
        
        saveProjectsToStorage();
        applyFilters(); // Перерендериваем с учетом текущих фильтров
        
        return true;
    }
    return false;
}

// Экспорт функций для использования в других файлах
window.addProject = addProject;
window.removeProject = removeProject;
window.saveProjectsToStorage = saveProjectsToStorage;
window.openProjectModal = openProjectModal;
window.shareProject = shareProject;
window.clearFilters = clearFilters;

// Добавляем стили для анимаций
const projectStyles = document.createElement('style');
projectStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    .project-card {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .project-card img.fade-in {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    .no-projects-message {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        text-align: center;
    }
    
    .no-projects-content {
        max-width: 400px;
    }
    
    .clear-filters-btn {
        background: var(--gradient);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .clear-filters-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .modal-info-item {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    
    .modal-info-item strong {
        color: var(--primary-color);
        font-size: 0.9rem;
    }
    
    .modal-info-item span {
        color: var(--text-color);
    }
`;

document.head.appendChild(projectStyles);

console.log('Projects management system fully loaded! 🚀');
