// Обновленный projects.js для работы с GitHub

let projects = [];
let filteredProjects = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('projects.html')) {
        loadProjectsFromGitHub();
    }
});

async function loadProjectsFromGitHub() {
    try {
        // Пытаемся загрузить с GitHub
        if (window.githubStorage) {
            projects = await githubStorage.loadProjects();
            console.log(`Loaded ${projects.length} projects from GitHub`);
        }
        
        // Если проектов нет, загружаем из localStorage как fallback
        if (projects.length === 0) {
            const localProjects = localStorage.getItem('nordmaling_projects');
            if (localProjects) {
                projects = JSON.parse(localProjects);
                console.log(`Loaded ${projects.length} projects from localStorage`);
            }
        }
        
        // Если все еще нет проектов, показываем демо-проекты
        if (projects.length === 0) {
            projects = getDefaultProjects();
            console.log('Using default demo projects');
        }
        
        filteredProjects = [...projects];
        renderProjects();
        
    } catch (error) {
        console.error('Failed to load projects:', error);
        projects = getDefaultProjects();
        filteredProjects = [...projects];
        renderProjects();
    }
}

// Демо-проекты для показа
function getDefaultProjects() {
    return [
        {
            id: 1,
            name: "Villa Haugen Utendørs",
            category: "exterior",
            description: "Komplett utendørs maling av villa i Mo i Rana. Inkludert overflatebehandling og to strøk kvalitetsmaling. Prosjektet tok 5 dager å fullføre.",
            images: ["https://raw.githubusercontent.com/sleepwalker105/Nowhere/main/images/placeholder-exterior.jpg"],
            date: "2024-03-15",
            location: "Mo i Rana",
            client: "Familie Haugen",
            duration: "5 dager",
            area: "180 m²"
        },
        {
            id: 2,
            name: "Leilighet Sentrum",
            category: "interior", 
            description: "Innendørs maling av 3-roms leilighet i sentrum av Mosjøen. Alle rom malt med miljøvennlig maling.",
            images: ["https://raw.githubusercontent.com/sleepwalker105/Nowhere/main/images/placeholder-interior.jpg"],
            date: "2024-02-28",
            location: "Mosjøen",
            client: "Privat leietaker",
            duration: "3 dager", 
            area: "85 m²"
        }
    ];
}

// Остальные функции остаются теми же (renderProjects, filterProjects, etc.)