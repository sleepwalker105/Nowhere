// Projects Management System for Nordmaling AS - Debug Version
let projects = [];
let filteredProjects = [];
let currentFilter = 'all';
let currentSearchTerm = '';

// Глобальная переменная для доступа из админ-панели
window.projects = projects;

// Проверяем загрузку
console.log('🚀 Projects script loaded!');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, checking page...');
    console.log('🔍 Current pathname:', window.location.pathname);
    
    if (window.location.pathname.includes('projects.html')) {
        console.log('✅ Projects page detected, initializing...');
        setTimeout(initializeProjects, 100); // Small delay to ensure everything is loaded
        setupSearchAndFilters();
        setupProjectInteractions();
    } else {
        console.log('❌ Not on projects page');
    }
});

// Инициализация проектов
async function initializeProjects() {
    console.log('🔄 Starting project initialization...');
    
    try {
        // Check if container exists
        const container = document.getElementById('projects-container');
        console.log('📦 Container check:', container ? '✅ Found' : '❌ Not found');
        
        if (!container) {
            console.error('❌ CRITICAL: projects-container not found!');
            return;
        }
        
        console.log('🔄 Loading projects...');
        await loadProjects();
        
        console.log('📊 Projects loaded:', projects.length);
        filteredProjects = [...projects];
        
        console.log('🎨 Starting render...');
        renderProjects();
        
        console.log('📈 Updating count...');
        updateProjectsCount();
        
        console.log(`✅ Initialization complete! ${projects.length} projects loaded`);
        
    } catch (error) {
        console.error('❌ Failed to initialize projects:', error);
        showDebugError('Error loading projects: ' + error.message);
    }
}

// Show debug error in the container
function showDebugError(message) {
    const container = document.getElementById('projects-container');
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--card-bg); border-radius: 15px; border: 2px solid #dc3545;">
                <div style="font-size: 3rem; margin-bottom: 1rem; color: #dc3545;">⚠️</div>
                <h3 style="color: #dc3545;">Debug Error</h3>
                <p style="color: var(--text-color); font-family: monospace; background: rgba(220,53,69,0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    ${message}
                </p>
                <button onclick="location.reload()" style="background: #dc3545; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    }
}

// Загрузка проектов из различных источников
async function loadProjects() {
    console.log('🔍 Starting project loading...');
    
    // 1. Check localStorage first
    try {
        const localProjects = localStorage.getItem('nordmaling_projects');
        console.log('💾 localStorage check:', localProjects ? 'Found data' : 'No data');
        
        if (localProjects) {
            const parsedProjects = JSON.parse(localProjects);
            console.log('📝 Parsed projects:', parsedProjects.length, 'items');
            
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

    // 2. Load demo projects
    console.log('📝 Loading demo projects...');
    projects = getDefaultProjects();
    window.projects = projects;
    
    // Save demo projects to localStorage
    try {
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        console.log('💾 Demo projects saved to localStorage');
    } catch (error) {
        console.error('❌ Failed to save demo projects:', error);
    }
    
    console.log(`📊 Final projects count: ${projects.length}`);
}

// Демо-проекты для показа
function getDefaultProjects() {
    return [
        {
            id: 1,
            name: "Villa Haugen Utendørs",
            category: "exterior",
            description: "Komplett utendørs maling av villa i Mo i Rana. Inkludert overflatebehandling og to strøk kvalitetsmaling. Prosjektet tok 5 dager å fullføre og kunden var svært fornøyd med resultatet.",
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
            description: "Innendørs maling av 3-roms leilighet i sentrum av Mosjøen. Alle rom malt med miljøvennlig maling. Moderne fargepalette som skaper koselig atmosfære.",
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
            description: "Takmaling og impregnering av enebolig. Komplett renovering av takflater med høykvalitets takbelegg som beskytter mot norske værforhold.",
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
            description: "Fullstendig utvendig renovering av tradisjonell norsk hytte. Inkludert slipearbeid, grunning og to strøk med traditionell rød farge.",
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
            description: "Moderne interiørmaling av kontorbygg. Brukt nøytrale farger for å skape et profesjonelt og rolig arbeidsmiljø.",
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
            description: "Fargerik innendørs maling av barnehage. Brukt barnevennlige og allergivennlige malinger i lyse, glade farger.",
            images: ["https://via.placeholder.com/400x300/28a745/ffffff?text=Kindergarten+Colors"],
            date: "2024-06-12",
            location: "Hemnes",
            client: "Hemnes Kommune",
            duration: "8 dager",
            area: "300 m²"
        },
        {
            id: 7,
            name: "Butikk Mo i Rana Fasade",
            category: "exterior",
            description: "Profesjonell fasademaling av forretningsbygg i Mo i Rana sentrum. Moderne fargevalg som tiltrekker kunder.",
            images: ["https://via.placeholder.com/400x300/6f42c1/ffffff?text=Shop+Facade"],
            date: "2024-07-22",
            location: "Mo i Rana",
            client: "Handel Nord AS",
            duration: "3 dager",
            area: "75 m²"
        },
        {
            id: 8,
            name: "Avfallshåndtering Industriområde",
            category: "waste",
            description: "Komplett avfallshåndtering og rydding etter byggprosjekt. Miljøvennlig sortering og gjenvinning av materialer.",
            images: ["https://via.placeholder.com/400x300/6c757d/ffffff?text=Waste+Management"],
            date: "2024-08-01",
            location: "Hemnes",
            client: "Byggmester Nordland",
            duration: "2 dager",
            area: "500 m²"
        }
    ];
}

// Рендеринг проектов
function renderProjects() {
    console.log(`🎨 Starting render of ${filteredProjects.length} projects...`);
    
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) {
        console.error('❌ CRITICAL: Projects container not found during render!');
        return;
    }

    console.log('📦 Container found, proceeding with render...');

    if (filteredProjects.length === 0) {
        console.log('📝 No projects to show, rendering empty state...');
        projectsContainer.innerHTML = getNoProjectsHTML();
        return;
    }

    console.log('🏗️ Creating project cards...');
    const projectsHTML = filteredProjects.map((project, index) => {
        console.log(`🎴 Creating card ${index + 1}: ${project.name}`);
        return createProjectCard(project);
    }).join('');
    
    console.log('📄 Setting innerHTML...');
    projectsContainer.innerHTML = projectsHTML;

    console.log('🌍 Applying translations...');
    // Apply translations to new elements
    if (typeof applyTranslations === 'function' && typeof currentLanguage !== 'undefined') {
        applyTranslations(currentLanguage);
    }

    console.log('🖼️ Setting up lazy loading...');
    // Setup lazy loading for images
    setupLazyLoading();
    
    console.log(`✅ Successfully rendered ${filteredProjects.length} projects!`);
}

// HTML для случая когда нет проектов
function getNoProjectsHTML() {
    return `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--card-bg); border-radius: 15px;">
            <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.7;">🔍</div>
            <h3 style="color: var(--secondary-color); margin-bottom: 1rem;" data-translate="no-projects">Ingen prosjekter funnet</h3>
            <p style="color: var(--text-color); opacity: 0.8; margin-bottom: 2rem;">
                ${currentSearchTerm ? 
                    `Ingen prosjekter matcher "${currentSearchTerm}"` : 
                    'Prøv å endre filter eller søkeord'
                }
            </p>
            <button onclick="clearFilters()" style="background: var(--gradient); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: bold;">
                <i class="fas fa-undo"></i> Tilbakestill filter
            </button>
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
                            <i class="fas fa-eye"></i> <span data-translate="view-details">Se detaljer</span>
                        </button>
                        <button onclick="shareProject(${project.id})" class="project-btn secondary">
                            <i class="fas fa-share"></i> <span data-translate="share">Del</span>
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

// Настройка поиска и фильтров
function setupSearchAndFilters() {
    console.log('🔧 Setting up search and filters...');
    
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    console.log('🔍 Search input:', searchInput ? '✅ Found' : '❌ Not found');
    console.log('🏷️ Filter buttons:', filterButtons.length, 'found');

    // Search with debounce
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            console.log(`🔍 Search term changed: "${currentSearchTerm}"`);
            applyFilters();
        }, 300));
    }

    // Category filters
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            console.log(`🏷️ Filter clicked: ${filter}`);
            setActiveFilter(filter);
            currentFilter = filter;
            applyFilters();
        });
    });
    
    console.log('✅ Search and filters setup complete');
}

// Применение фильтров
function applyFilters() {
    console.log(`🔍 Applying filters: category="${currentFilter}", search="${currentSearchTerm}"`);
    
    filteredProjects = projects.filter(project => {
        // Category filter
        const matchesCategory = currentFilter === 'all' || project.category === currentFilter;
        
        // Search filter
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

// Обновление счетчика проектов
function updateProjectsCount() {
    const countElement = document.getElementById('projects-count');
    console.log('📊 Updating count, element:', countElement ? '✅ Found' : '❌ Not found');
    
    if (countElement) {
        const total = projects.length;
        const filtered = filteredProjects.length;
        
        let countText;
        if (currentFilter === 'all' && !currentSearchTerm) {
            if (currentLanguage === 'en') {
                countText = `${total} projects`;
            } else {
                countText = `${total} prosjekter`;
            }
        } else {
            if (currentLanguage === 'en') {
                countText = `${filtered} of ${total} projects`;
            } else {
                countText = `${filtered} av ${total} prosjekter`;
            }
        }
        
        countElement.textContent = countText;
        console.log('📊 Count updated:', countText);
    }
}

// Utility functions
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
        if (currentLanguage === 'en') {
            return date.toLocaleDateString('en-US', options);
        } else {
            return date.toLocaleDateString('no-NO', options);
        }
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

// Basic implementations for missing functions
function openProjectModal(projectId) {
    console.log('👁️ Opening modal for project:', projectId);
    // Basic modal implementation
    alert(`Project details for ID: ${projectId}\n\nThis would open a detailed modal window.`);
}

function shareProject(projectId) {
    console.log('📤 Sharing project:', projectId);
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const shareText = `Check out this project: ${project.name} by Nordmaling AS\n${window.location.href}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            alert('Project link copied to clipboard!');
        } else {
            alert(shareText);
        }
    }
}

function setupProjectInteractions() {
    setupLazyLoading();
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

// Export functions for global use
window.addProject = function(projectData) {
    const newProject = {
        id: Date.now(),
        ...projectData,
        date: projectData.date || new Date().toISOString().split('T')[0]
    };
    
    projects.push(newProject);
    window.projects = projects;
    
    localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
    applyFilters();
    
    return newProject;
};

window.removeProject = function(projectId) {
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
        projects.splice(index, 1);
        window.projects = projects;
        localStorage.setItem('nordmaling_projects', JSON.stringify(projects));
        applyFilters();
        return true;
    }
    return false;
};

window.updateProjectsList = function() {
    console.log('🔄 Updating projects list from external call...');
    const localProjects = localStorage.getItem('nordmaling_projects');
    if (localProjects) {
        projects = JSON.parse(localProjects);
        window.projects = projects;
        applyFilters();
    }
};

window.openProjectModal = openProjectModal;
window.shareProject = shareProject;
window.clearFilters = clearFilters;

console.log('🚀 Projects management system fully loaded with debug support!');

// Debug function for console
window.debugProjects = function() {
    console.log('🔍 DEBUG INFO:');
    console.log('Projects array:', projects);
    console.log('Filtered projects:', filteredProjects);
    console.log('Current filter:', currentFilter);
    console.log('Search term:', currentSearchTerm);
    console.log('Container:', document.getElementById('projects-container'));
    console.log('Count element:', document.getElementById('projects-count'));
    return {
        projects,
        filteredProjects,
        currentFilter,
        currentSearchTerm,
        container: document.getElementById('projects-container'),
        countElement: document.getElementById('projects-count')
    };
};
