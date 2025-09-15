// Projects Management System for Nordmaling AS - Fixed Version
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
        console.log('🔄 Loading projects...');
        await loadProjects();
        filteredProjects = [...projects];
        renderProjects();
        updateProjectsCount();
        console.log(`✅ Initialized with ${projects.length} projects`);
    } catch (error) {
        console.error('❌ Failed to initialize projects:', error);
        showNotification('Error loading projects', 'error');
    }
}

// Загрузка проектов из различных источников
async function loadProjects() {
    console.log('🔍 Checking for saved projects...');
    
    // 1. Сначала проверяем localStorage
    try {
        const localProjects = localStorage.getItem('nordmaling_projects');
        if (localProjects) {
            const parsedProjects = JSON.parse(localProjects);
            if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
                projects = parsedProjects;
                window.projects = projects;
                console.log(`✅ Loaded ${projects.length} projects from localStorage`);
                return;
            }
        }
    } catch (error) {
        console.log('⚠️ localStorage loading failed:', error);
    }

    // 2. Если нет сохраненных проектов, используем демо
    console.log('📝 No saved projects found, loading demo projects...');
    projects = getDefaultProjects();
    window.projects = projects;
    
    // Сохраняем демо-проекты в localStorage для будущих загрузок
    try {
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        console.log('💾 Demo projects saved to localStorage');
    } catch (error) {
        console.error('❌ Failed to save demo projects:', error);
    }
}

// Демо-проекты для показа
function getDefaultProjects() {
    return [
        {
            id: 1,
            name: "Villa Haugen Utendørs",
            category: "exterior",
            description: "Komplett utendørs maling av villa i Mo i Rana. Inkludert overflatebehandling og to strøk kvalitetsmaling. Prosjektet tok 5 dager å fullføre og kunden var svært fornøyd med resultatet. Brukt værbestandig maling som beskytter mot norske værforhold.",
            images: ["https://via.placeholder.com/400x300/ff6b35/ffffff?text=Villa+Haugen+Exterior"],
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
            description: "Innendørs maling av 3-roms leilighet i sentrum av Mosjøen. Alle rom malt med miljøvennlig maling. Spesielt fokus på stue og soverom med moderne fargepalette som skaper en koselig atmosfære.",
            images: ["https://via.placeholder.com/400x300/004e89/ffffff?text=Apartment+Interior"],
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
            description: "Takmaling og impregnering av enebolig. Komplett renovering av takflater med høykvalitets takbelegg som beskytter mot norske værforhold. Inkludert inspeksjon og reparasjon av mindre skader.",
            images: ["https://via.placeholder.com/400x300/ffd23f/333333?text=Roof+Project"],
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
            description: "Fullstendig utvendig renovering av tradisjonell norsk hytte. Inkludert slipearbeid, grunning og to strøk med traditionell rød farge. Restaurering av historiske detaljer og vedlikehold av autentisk utseende.",
            images: ["https://via.placeholder.com/400x300/dc3545/ffffff?text=Cabin+Renovation"],
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
            description: "Moderne interiørmaling av kontorbygg. Brukt nøytrale farger for å skape et profesjonelt og rolig arbeidsmiljø. Inkludert maling av møterom, korridorer og fellesarealer med høy kvalitet.",
            images: ["https://via.placeholder.com/400x300/17a2b8/ffffff?text=Office+Interior"],
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
            description: "Fargerik innendørs maling av barnehage. Brukt barnevennlige og allergivennlige malinger i lyse, glade farger. Spesielle tegninger og motiver for å skape et inspirerende miljø for barna.",
            images: ["https://via.placeholder.com/400x300/28a745/ffffff?text=Kindergarten+Colors"],
            date: "2024-06-12",
            location: "Hemnes",
            client: "Hemnes Kommune",
            duration: "8 dager",
            area: "300 m²"
        }
    ];
}

// Rендеринг проектов
function renderProjects() {
    console.log(`🎨 Rendering ${filteredProjects.length} projects...`);
    
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) {
        console.error('❌ Projects container not found!');
        return;
    }

    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = getNoProjectsHTML();
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
    
    console.log(`✅ Rendered ${filteredProjects.length} projects successfully`);
}

// HTML для случая когда нет проектов
function getNoProjectsHTML() {
    return `
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

// Обновление списка проектов (вызывается из админ-панели)
function updateProjectsList() {
    console.log('🔄 Updating projects list from admin panel...');
    
    // Перезагружаем проекты из localStorage
    try {
        const localProjects = localStorage.getItem('nordmaling_projects');
        if (localProjects) {
            projects = JSON.parse(localProjects);
            window.projects = projects;
            
            // Применяем текущие фильтры
            applyFilters();
            
            console.log(`✅ Projects list updated: ${projects.length} total projects`);
        }
    } catch (error) {
        console.error('❌ Error updating projects list:', error);
    }
}

// Настройка поиска и фильтров
function setupSearchAndFilters() {
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Поиск с debounce
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            console.log(`🔍 Search term: "${currentSearchTerm}"`);
            applyFilters();
        }, 300));
    }

    // Фильтры категорий
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            console.log(`🏷️ Filter changed to: ${filter}`);
            setActiveFilter(filter);
            currentFilter = filter;
            applyFilters();
        });
    });
    
    console.log('🔧 Search and filters setup complete');
}

// Применение фильтров
function applyFilters() {
    console.log(`🔍 Applying filters: category="${currentFilter}", search="${currentSearchTerm}"`);
    
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

    console.log(`📊 Filter results: ${filteredProjects.length} of ${projects.length} projects`);
    
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
    console.log('🔄 Clearing all filters...');
    
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

// Добавление нового проекта (используется админ-панелью)
function addProject(projectData) {
    console.log('➕ Adding new project:', projectData.name);
    
    const newProject = {
        id: Date.now(),
        ...projectData,
        date: projectData.date || new Date().toISOString().split('T')[0]
    };
    
    projects.push(newProject);
    window.projects = projects; // Обновляем глобальную переменную
    
    // Сохраняем в localStorage
    try {
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        console.log('💾 Projects saved to localStorage');
    } catch (error) {
        console.error('❌ Error saving projects:', error);
    }
    
    // Обновляем отображение
    applyFilters();
    
    return newProject;
}

// Удаление проекта (используется админ-панелью)
function removeProject(projectId) {
    console.log('🗑️ Removing project:', projectId);
    
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
        const removedProject = projects.splice(index, 1)[0];
        window.projects = projects; // Обновляем глобальную переменную
        
        // Сохраняем в localStorage
        try {
            localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
            console.log('💾 Projects updated in localStorage');
        } catch (error) {
            console.error('❌ Error updating projects:', error);
        }
        
        // Обновляем отображение
        applyFilters();
        
        console.log('✅ Project removed:', removedProject.name);
        return true;
    }
    return false;
}

// Остальные функции остаются теми же...
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

// Модальное окно и другие функции...
function openProjectModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    console.log('👁️ Opening modal for project:', project.name);
    
    // Код модального окна остается тем же...
    // (сохраняю место для краткости)
}

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
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Prosjektlink kopiert!', 'success');
        }).catch(() => {
            showNotification('Kunne ikke kopiere link', 'error');
        });
    }
}

function setupProjectInteractions() {
    setupLazyLoading();
    setupScrollAnimations();
    console.log('🎭 Project interactions setup complete');
}

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

// Экспорт функций для использования в других файлах
window.addProject = addProject;
window.removeProject = removeProject;
window.updateProjectsList = updateProjectsList;
window.openProjectModal = openProjectModal;
window.shareProject = shareProject;
window.clearFilters = clearFilters;

console.log('🚀 Projects management system fully loaded and ready!');
