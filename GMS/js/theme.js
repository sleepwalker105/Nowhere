// Theme management system
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Default theme
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('.theme-icon');
        
        this.init();
    }

    init() {
        // Load saved theme preference
        const savedTheme = localStorage.getItem('preferredTheme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
        }

        // Apply initial theme
        this.applyTheme();

        // Add click listener to theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        console.log(`Theme system initialized: ${this.currentTheme}`);
    }

    toggleTheme() {
        // Switch between themes
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveThemePreference();
        
        console.log(`Theme switched to: ${this.currentTheme}`);
    }

    applyTheme() {
        const body = document.body;
        
        if (this.currentTheme === 'light') {
            // Apply light theme
            body.setAttribute('data-theme', 'light');
            if (this.themeIcon) {
                this.themeIcon.textContent = '☀️';
            }
        } else {
            // Apply dark theme (default)
            body.removeAttribute('data-theme');
            if (this.themeIcon) {
                this.themeIcon.textContent = '🌙';
            }
        }

        // Add smooth transition for theme change
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }

    saveThemePreference() {
        localStorage.setItem('preferredTheme', this.currentTheme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.applyTheme();
            this.saveThemePreference();
            console.log(`Theme manually set to: ${theme}`);
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export ThemeManager class for use in other scripts
window.ThemeManager = ThemeManager;