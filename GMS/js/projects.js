// Projects data - starts empty, add your projects here!
const projectsData = [
    // Example projects (uncomment and modify when adding real projects):
    /*
    {
        id: 1,
        title: 'Modern Apartment',
        description: 'Complete interior renovation with contemporary colors',
        category: 'private',
        subcategory: 'interior',
        image: 'project-images/apartment-1.jpg',
        alt: 'Modern apartment interior after painting',
        dateAdded: '2025-01-15'
    },
    {
        id: 2,
        title: 'Office Building Exterior',
        description: 'Professional commercial building facade renovation',
        category: 'public',
        subcategory: 'exterior',
        image: 'project-images/office-building-1.jpg',
        alt: 'Office building exterior painting project',
        dateAdded: '2025-02-01'
    },
    {
        id: 3,
        title: 'Luxury Living Room',
        description: 'Elegant interior design with premium finishes',
        category: 'interior',
        image: 'project-images/luxury-living-1.jpg',
        alt: 'Luxury living room interior design',
        dateAdded: '2025-02-15'
    }
    */
];

// Gallery management system
class ProjectGallery {
    constructor() {
        this.currentFilter = 'all';
        this.galleryGrid = document.getElementById('galleryGrid');
        this.moreSoonMessage = document.getElementById('moreSoonMessage');
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalCaption = document.getElementById('modalCaption');
        this.modalClose = document.getElementById('modalClose');
        
        this.init();
    }

    init() {
        this.renderGallery();
        this.initializeFilters();
        this.initializeModal();
        this.initializeHoverEffects();
        this.updateMoreSoonMessage();
        
        console.log('Project Gallery initialized with', projectsData.length, 'projects');
    }

    renderGallery() {
        if (!this.galleryGrid) return;
        
        const filteredProjects = this.getFilteredProjects();
        this.galleryGrid.innerHTML = '';

        if (filteredProjects.length === 0) {
            this.updateMoreSoonMessage();
            return;
        }

        filteredProjects.forEach((project, index) => {
            const galleryItem = this.createGalleryItem(project, index);
            this.galleryGrid.appendChild(galleryItem);
        });

        this.updateMoreSoonMessage();
        this.restartAnimations();
    }

    getFilteredProjects() {
        if (this.currentFilter === 'all') {
            return projectsData;
        }
        
        return projectsData.filter(project => 
            project.category === this.currentFilter || 
            project.subcategory === this.currentFilter
        );
    }

    updateMoreSoonMessage() {
        if (!this.moreSoonMessage) return;
        
        // Always show "More soon!" message (it will be below projects if any exist)
        this.moreSoonMessage.classList.remove('hidden');
    }

    createGalleryItem(project, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Create fallback placeholder image
        const placeholderSvg = this.createPlaceholderImage(project.title);
        
        item.innerHTML = `
            <img src="${project.image}" alt="${project.alt}" 
                 onerror="this.src='${placeholderSvg}'">
            <div class="gallery-overlay">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
        `;

        // Add click listener to open modal
        item.addEventListener('click', () => {
            this.openModal(project);
        });

        return item;
    }

    createPlaceholderImage(title) {
        // Create SVG placeholder with project title
        const svg = `
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3c3c3c;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#grad)"/>
                <text x="200" y="140" font-family="Montserrat, Arial" font-