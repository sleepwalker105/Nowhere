// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language system
    initLanguage();
    
    // Add smooth scroll behavior for navigation
    initSmoothScrolling();
    
    // Add enhanced hover effects
    initEnhancedEffects();
    
    // Add loading animation
    initLoadingAnimation();
    
    // Initialize page navigation
    initPageNavigation();
    
    // Initialize contact functionality
    initContactFunctionality();
    
    // Restore last visited page
    restoreLastPage();
});

// Page navigation functionality
function initPageNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn[data-page]');
    const pages = document.querySelectorAll('.page-content');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Save current page to localStorage
            saveCurrentPage(targetPage);
        });
    });
}

// Show specific page
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-content');
    const targetPage = document.getElementById(pageId + '-page');
    
    if (!targetPage) return;
    
    // Hide all pages
    pages.forEach(page => {
        if (page !== targetPage) {
            page.style.display = 'none';
        }
    });
    
    // Show target page with animation
    targetPage.style.display = 'block';
    targetPage.style.opacity = '0';
    targetPage.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        targetPage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        targetPage.style.opacity = '1';
        targetPage.style.transform = 'translateY(0)';
    }, 50);

    // Initialize gallery if switching to projects page
    if (pageId === 'projects' && window.ProjectGallery) {
        setTimeout(() => {
            if (!window.projectGallery) {
                window.projectGallery = new ProjectGallery();
            }
        }, 100);
    }
    
    // Update active navigation button
    updateActiveNavButton(pageId);
}

// Update active navigation button
function updateActiveNavButton(pageId) {
    const navButtons = document.querySelectorAll('.nav-btn[data-page]');
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Save current page to localStorage
function saveCurrentPage(pageId) {
    localStorage.setItem('currentPage', pageId);
    console.log(`Current page saved: ${pageId}`);
}

// Restore last visited page
function restoreLastPage() {
    const savedPage = localStorage.getItem('currentPage');
    const defaultPage = 'home';
    
    // If no saved page, use default (home)
    const pageToShow = savedPage || defaultPage;
    
    // Show the restored/default page
    showPage(pageToShow);
    
    console.log(`Page restored: ${pageToShow}`);
}

// Contact functionality - copy to clipboard
function initContactFunctionality() {
    const contactValues = document.querySelectorAll('.contact-value[data-contact]');
    
    contactValues.forEach(element => {
        element.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-contact');
            copyToClipboard(textToCopy);
            showCopyNotification();
        });
    });
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard:', text);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            console.log('Text copied to clipboard (fallback):', text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        
        document.body.removeChild(textArea);
    }
}

// Show copy notification with smooth animation
function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    if (notification) {
        // Reset classes
        notification.classList.remove('show', 'hide');
        
        // Trigger entrance animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Trigger exit animation after delay
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
        }, 1500);
        
        // Clean up classes
        setTimeout(() => {
            notification.classList.remove('hide');
        }, 2000);
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Enhanced hover effects and animations
function initEnhancedEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Skip gallery items as they have their own hover effects
        if (card.closest('.gallery-item')) return;
        
        // Mouse enter effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
            
            // Add glow effect to title
            const title = this.querySelector('.card-title');
            if (title) {
                title.style.textShadow = '0 0 15px var(--accent-color)';
            }
        });
        
        // Mouse leave effect
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            
            // Remove glow effect from title
            const title = this.querySelector('.card-title');
            if (title) {
                title.style.textShadow = '';
            }
        });
        
        // Click effect
        card.addEventListener('click', function() {
            this.style.transform = 'scale(1.02) translateY(-3px)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05) translateY(-5px)';
            }, 100);
        });
    });
}

// Loading animation for cards
function initLoadingAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        // Skip gallery items
        if (card.closest('.gallery-item')) return;
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Export functions for debugging
window.showPage = showPage;
window.saveCurrentPage = saveCurrentPage;
window.restoreLastPage = restoreLastPage;