// Main JavaScript for Nordmaling AS Website with User Preferences
let currentLanguage = 'no'; // Default language
let currentTheme = 'light'; // Default theme

// User preferences object
const userPreferences = {
    language: 'no',
    theme: 'light',
    lastVisit: null,
    visitCount: 0
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Nordmaling AS Website Loading...');
    
    // Load user preferences first
    loadUserPreferences();
    
    // Initialize components
    initializeNavigation();
    initializeTheme();
    initializeLanguage();
    initializeAnimations();
    initializeUserTracking();
    
    console.log('✅ Website fully loaded!');
    console.log(`👤 User: ${getUserInfo()}`);
    console.log(`🌍 Language: ${currentLanguage.toUpperCase()}`);
    console.log(`🎨 Theme: ${currentTheme}`);
});

// Load user preferences from localStorage
function loadUserPreferences() {
    try {
        const savedPreferences = localStorage.getItem('nordmaling_user_preferences');
        
        if (savedPreferences) {
            const preferences = JSON.parse(savedPreferences);
            
            // Update current settings
            currentLanguage = preferences.language || 'no';
            currentTheme = preferences.theme || 'light';
            
            // Update user preferences object
            Object.assign(userPreferences, preferences);
            
            console.log('👤 User preferences loaded:', preferences);
        } else {
            console.log('👤 No saved preferences found, using defaults');
            saveUserPreferences(); // Save default preferences
        }
    } catch (error) {
        console.error('❌ Error loading user preferences:', error);
        // Use defaults if loading fails
        currentLanguage = 'no';
        currentTheme = 'light';
    }
}

// Save user preferences to localStorage
function saveUserPreferences() {
    try {
        // Update preferences object
        userPreferences.language = currentLanguage;
        userPreferences.theme = currentTheme;
        userPreferences.lastVisit = new Date().toISOString();
        userPreferences.visitCount = (userPreferences.visitCount || 0) + 1;
        
        // Save to localStorage
        localStorage.setItem('nordmaling_user_preferences', JSON.stringify(userPreferences));
        
        console.log('💾 User preferences saved:', userPreferences);
    } catch (error) {
        console.error('❌ Error saving user preferences:', error);
    }
}

// Get user info (GitHub username or anonymous)
function getUserInfo() {
    // Try to detect GitHub username from URL or other sources
    const githubUser = detectGitHubUser();
    return githubUser || 'Anonymous User';
}

// Detect GitHub user (if available)
function detectGitHubUser() {
    // Check if we're on GitHub Pages
    const hostname = window.location.hostname;
    if (hostname.includes('github.io')) {
        const pathParts = hostname.split('.');
        if (pathParts[0] && pathParts[0] !== 'github') {
            return pathParts[0]; // GitHub username
        }
    }
    
    // Check if stored in localStorage from previous sessions
    const storedUser = localStorage.getItem('nordmaling_github_user');
    if (storedUser) {
        return storedUser;
    }
    
    return null;
}

// Initialize user tracking
function initializeUserTracking() {
    // Store GitHub user if detected
    const githubUser = detectGitHubUser();
    if (githubUser) {
        localStorage.setItem('nordmaling_github_user', githubUser);
    }
    
    // Track page views
    trackPageView();
    
    // Show welcome message for returning users
    showWelcomeMessage();
}

// Track page views
function trackPageView() {
    try {
        const pageViews = JSON.parse(localStorage.getItem('nordmaling_page_views') || '{}');
        const currentPage = window.location.pathname;
        
        pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
        pageViews.totalViews = (pageViews.totalViews || 0) + 1;
        pageViews.lastVisit = new Date().toISOString();
        
        localStorage.setItem('nordmaling_page_views', JSON.stringify(pageViews));
        
        console.log(`📊 Page view tracked: ${currentPage} (${pageViews[currentPage]} times)`);
    } catch (error) {
        console.error('❌ Error tracking page view:', error);
    }
}

// Show welcome message for returning users
function showWelcomeMessage() {
    const visitCount = userPreferences.visitCount || 0;
    const lastVisit = userPreferences.lastVisit;
    const user = getUserInfo();
    
    if (visitCount > 1 && lastVisit) {
        const lastVisitDate = new Date(lastVisit);
        const daysSinceLastVisit = Math.floor((new Date() - lastVisitDate) / (1000 * 60 * 60 * 24));
        
        let welcomeMessage;
        
        if (currentLanguage === 'no') {
            if (daysSinceLastVisit === 0) {
                welcomeMessage = `Velkommen tilbake, ${user}! 👋`;
            } else if (daysSinceLastVisit === 1) {
                welcomeMessage = `Velkommen tilbake, ${user}! Du var her i går. 📅`;
            } else {
                welcomeMessage = `Velkommen tilbake, ${user}! Du var her for ${daysSinceLastVisit} dager siden. 📅`;
            }
        } else {
            if (daysSinceLastVisit === 0) {
                welcomeMessage = `Welcome back, ${user}! 👋`;
            } else if (daysSinceLastVisit === 1) {
                welcomeMessage = `Welcome back, ${user}! You were here yesterday. 📅`;
            } else {
                welcomeMessage = `Welcome back, ${user}! You were here ${daysSinceLastVisit} days ago. 📅`;
            }
        }
        
        // Show welcome notification
        setTimeout(() => {
            showNotification(welcomeMessage, 'info', 5000);
        }, 1000);
    }
}

// Initialize navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        // Scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Mobile menu toggle
        setupMobileMenu();
        
        console.log('🧭 Navigation initialized');
    }
}

// Mobile menu setup
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Initialize theme system
function initializeTheme() {
    // Apply saved theme
    applyTheme(currentTheme);
    
    // Update theme toggle button
    updateThemeButton();
    
    console.log(`🎨 Theme initialized: ${currentTheme}`);
}

// Apply theme
function applyTheme(theme) {
    const body = document.body;
    
    // Remove all theme classes
    body.classList.remove('light-theme', 'dark-theme');
    
    // Add current theme class
    body.classList.add(`${theme}-theme`);
    
    // Update CSS custom properties if needed
    if (theme === 'dark') {
        body.style.setProperty('--bg-color', '#1a1a1a');
        body.style.setProperty('--text-color', '#ffffff');
        body.style.setProperty('--card-bg', '#2d2d2d');
        body.style.setProperty('--border-color', '#404040');
    } else {
        body.style.setProperty('--bg-color', '#ffffff');
        body.style.setProperty('--text-color', '#333333');
        body.style.setProperty('--card-bg', '#f8f9fa');
        body.style.setProperty('--border-color', '#e0e0e0');
    }
    
    currentTheme = theme;
}

// Toggle theme
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    applyTheme(newTheme);
    updateThemeButton();
    saveUserPreferences();
    
    // Show theme change notification
    const message = currentLanguage === 'no' ? 
        `Byttet til ${newTheme === 'dark' ? 'mørk' : 'lys'} tema` :
        `Switched to ${newTheme} theme`;
    
    showNotification(message, 'info', 2000);
    
    console.log(`🎨 Theme changed to: ${newTheme}`);
}

// Update theme button icon
function updateThemeButton() {
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        const icon = themeButton.querySelector('i');
        if (icon) {
            icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// Initialize language system
function initializeLanguage() {
    // Apply saved language
    applyLanguage(currentLanguage);
    
    // Update language button
    updateLanguageButton();
    
    console.log(`🌍 Language initialized: ${currentLanguage}`);
}

// Apply language
function applyLanguage(language) {
    currentLanguage = language;
    
    // Apply translations if function exists
    if (typeof applyTranslations === 'function') {
        applyTranslations(language);
    }
}

// Toggle language
function toggleLanguage() {
    const newLanguage = currentLanguage === 'no' ? 'en' : 'no';
    
    applyLanguage(newLanguage);
    updateLanguageButton();
    saveUserPreferences();
    
    // Show language change notification
    const message = newLanguage === 'no' ? 
        'Byttet til norsk' : 
        'Switched to English';
    
    showNotification(message, 'success', 2000);
    
    console.log(`🌍 Language changed to: ${newLanguage.toUpperCase()}`);
}

// Update language button
function updateLanguageButton() {
    const languageButton = document.getElementById('language-selector');
    if (languageButton) {
        languageButton.textContent = currentLanguage.toUpperCase();
        languageButton.setAttribute('aria-label', 
            currentLanguage === 'no' ? 'Switch to English' : 'Bytt til norsk'
        );
    }
}

// Mobile menu toggle (standalone function for onclick)
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

// Initialize animations
function initializeAnimations() {
    // Fade in animation for page elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .hero-content, .card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
    
    console.log('✨ Animations initialized');
}

// Enhanced notification system
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icons for different types
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-color);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow);
        z-index: 10000;
        border-left: 4px solid ${getNotificationColor(type)};
        min-width: 300px;
        max-width: 90vw;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
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
    
    console.log(`📢 Notification: ${message} (${type})`);
}

// Get notification color based on type
function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// User preferences management
function resetUserPreferences() {
    localStorage.removeItem('nordmaling_user_preferences');
    localStorage.removeItem('nordmaling_github_user');
    localStorage.removeItem('nordmaling_page_views');
    
    // Reset to defaults
    currentLanguage = 'no';
    currentTheme = 'light';
    
    // Reinitialize
    initializeTheme();
    initializeLanguage();
    
    const message = currentLanguage === 'no' ? 
        'Brukerinnstillinger tilbakestilt' : 
        'User preferences reset';
    
    showNotification(message, 'info');
    
    console.log('🔄 User preferences reset');
}

// Get user statistics
function getUserStatistics() {
    const pageViews = JSON.parse(localStorage.getItem('nordmaling_page_views') || '{}');
    const preferences = JSON.parse(localStorage.getItem('nordmaling_user_preferences') || '{}');
    
    return {
        visitCount: preferences.visitCount || 0,
        totalPageViews: pageViews.totalViews || 0,
        favoritePages: Object.keys(pageViews)
            .filter(key => !['totalViews', 'lastVisit'].includes(key))
            .sort((a, b) => pageViews[b] - pageViews[a])
            .slice(0, 3),
        lastVisit: preferences.lastVisit,
        currentLanguage: currentLanguage,
        currentTheme: currentTheme,
        user: getUserInfo()
    };
}

// Debug function to show user stats
function showUserStats() {
    const stats = getUserStatistics();
    console.table(stats);
    
    const message = `
        👤 User: ${stats.user}
        🌍 Language: ${stats.currentLanguage.toUpperCase()}
        🎨 Theme: ${stats.currentTheme}
        📊 Visits: ${stats.visitCount}
        📄 Page views: ${stats.totalPageViews}
        ⭐ Favorite pages: ${stats.favoritePages.join(', ')}
    `;
    
    console.log(message);
    return stats;
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        font-family: inherit;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.8rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            min-width: auto;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Export functions for global use
window.toggleTheme = toggleTheme;
window.toggleLanguage = toggleLanguage;
window.toggleMobileMenu = toggleMobileMenu;
window.showNotification = showNotification;
window.resetUserPreferences = resetUserPreferences;
window.getUserStatistics = getUserStatistics;
window.showUserStats = showUserStats;

// Make current settings available globally
window.currentLanguage = currentLanguage;
window.currentTheme = currentTheme;

console.log('🎯 Main JavaScript loaded successfully!');
console.log('🔧 Available functions: toggleTheme(), toggleLanguage(), showUserStats()');
