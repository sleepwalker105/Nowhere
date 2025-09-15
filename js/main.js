// Global variables
let currentLanguage = 'no';
let currentTheme = 'light';

// Проверяем доступность переводов
function checkTranslations() {
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded! Make sure translations.js is loaded before main.js');
        return false;
    }
    return true;
}

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking translations...');
    
    // Ждем загрузки переводов
    let attempts = 0;
    const maxAttempts = 50; // 5 секунд максимум
    
    function waitForTranslations() {
        attempts++;
        
        if (checkTranslations()) {
            console.log('Translations found, initializing...');
            initializeWebsite();
            checkCookieConsent();
            loadUserPreferences();
            setupFormPersistence();
            setupScrollEffects();
            setupIntersectionObserver();
        } else if (attempts < maxAttempts) {
            console.log(`Waiting for translations... attempt ${attempts}`);
            setTimeout(waitForTranslations, 100);
        } else {
            console.error('Failed to load translations after maximum attempts');
        }
    }
    
    waitForTranslations();
});

function initializeWebsite() {
    console.log('Initializing website...');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Setup scroll behavior for navbar
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Add theme transition class to body
    document.body.classList.add('theme-transition');
    
    // Setup form validation
    setupFormValidation();
    
    // Initialize tooltips and accessibility features
    setupAccessibility();
    
    // Initialize language button immediately
    updateLanguageButton();
    applyTranslations(currentLanguage);
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 78, 137, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        navbar.style.backdropFilter = 'none';
        navbar.style.boxShadow = 'var(--shadow)';
    }
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu && hamburger) {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
}

// Language functionality
function toggleLanguage() {
    if (!checkTranslations()) {
        console.error('Cannot toggle language: translations not available');
        return;
    }
    
    // Переключение между языками
    const newLanguage = currentLanguage === 'no' ? 'en' : 'no';
    
    console.log(`Switching from ${currentLanguage} to ${newLanguage}`);
    
    currentLanguage = newLanguage;
    
    // Обновить текст кнопки
    updateLanguageButton();
    
    // Применить переводы
    applyTranslations(currentLanguage);
    
    // Сохранить настройки
    saveUserPreferences();
    
    // Обновить placeholder тексты
    updatePlaceholders();
    
    // Триггер события для других компонентов
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLanguage }));
    
    console.log('Language switched to:', currentLanguage);
}

function updateLanguageButton() {
    const languageBtn = document.getElementById('language-selector');
    if (languageBtn) {
        // Показываем язык, на который можно переключиться
        languageBtn.textContent = currentLanguage === 'no' ? 'EN' : 'NO';
        languageBtn.setAttribute('aria-label', 
            currentLanguage === 'no' ? 'Switch to English' : 'Bytt til norsk'
        );
        
        console.log('Language button updated to:', languageBtn.textContent);
    } else {
        console.error('Language button not found!');
    }
}

function applyTranslations(language) {
    if (!checkTranslations()) {
        console.error('Cannot apply translations: translations not available');
        return;
    }
    
    if (!translations[language]) {
        console.error('Translations not found for language:', language);
        return;
    }
    
    const elements = document.querySelectorAll('[data-translate]');
    console.log(`Applying ${language} translations to ${elements.length} elements`);
    
    let translatedCount = 0;
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = translations[language][key];
        
        if (translation) {
            if (element.tagName === 'INPUT' && element.type !== 'submit') {
                element.placeholder = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                // Обрабатываем HTML контент
                if (key === 'contact-address-text') {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
            translatedCount++;
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${language}`);
        }
    });
    
    console.log(`Translated ${translatedCount} elements`);
}

function updatePlaceholders() {
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
}

// Theme functionality
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    saveUserPreferences();
    
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: currentTheme }));
}

// Cookie functionality
function checkCookieConsent() {
    if (!getCookie('cookieConsent')) {
        setTimeout(showCookieConsent, 2000);
    }
}

function showCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent) {
        cookieConsent.classList.add('show');
    }
}

function acceptCookies() {
    setCookie('cookieConsent', 'true', 365);
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent) {
        cookieConsent.classList.remove('show');
    }
}

// Contact form functionality
function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    if (!validateContactForm(formData)) {
        return;
    }
    
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = `<span class="loading-spinner"></span> ${currentLanguage === 'no' ? 'Sender...' : 'Sending...'}`;
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const emailContent = createEmailContent(formData);
        console.log('Email content:', emailContent);
        
        showNotification(
            currentLanguage === 'no' ? 
            'Takk for din forespørsel! Vi vil kontakte deg snart.' : 
            'Thank you for your inquiry! We will contact you soon.',
            'success'
        );
        
        form.reset();
        clearFormData();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 2000);
}

function createEmailContent(formData) {
    const data = {
        to: 'o21072005@gmail.com',
        subject: `Ny forespørsel fra ${formData.get('firstName')} ${formData.get('lastName')}`,
        body: `
            Ny kontaktforespørsel fra nettstedet:
            
            Navn: ${formData.get('firstName')} ${formData.get('lastName')}
            Telefon: ${formData.get('phone')}
            E-post: ${formData.get('email') || 'Ikke oppgitt'}
            Adresse: ${formData.get('address')}
            Tjeneste: ${formData.get('service') || 'Ikke spesifisert'}
            
            Melding:
            ${formData.get('message')}
            
            ${formData.get('photo') && formData.get('photo').size > 0 ? 'Vedlegg: Bilde lastet opp' : 'Ingen vedlegg'}
        `
    };
    
    return data;
}

function validateContactForm(formData) {
    const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'message'];
    
    for (let field of requiredFields) {
        const value = formData.get(field);
        if (!value || !value.trim()) {
            showNotification(
                currentLanguage === 'no' ? 
                `Vennligst fyll ut ${getFieldLabel(field)}` : 
                `Please fill out ${getFieldLabel(field)}`,
                'error'
            );
            
            const fieldElement = document.querySelector(`[name="${field}"]`);
            if (fieldElement) {
                fieldElement.focus();
                fieldElement.style.borderColor = 'var(--primary-color)';
                setTimeout(() => {
                    fieldElement.style.borderColor = '';
                }, 3000);
            }
            
            return false;
        }
    }
    
    const phone = formData.get('phone');
    if (phone && !isValidPhone(phone)) {
        showNotification(
            currentLanguage === 'no' ? 
            'Vennligst oppgi et gyldig telefonnummer' : 
            'Please provide a valid phone number',
            'error'
        );
        return false;
    }
    
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        showNotification(
            currentLanguage === 'no' ? 
            'Vennligst oppgi en gyldig e-postadresse' : 
            'Please provide a valid email address',
            'error'
        );
        return false;
    }
    
    return true;
}

function getFieldLabel(field) {
    const labels = {
        'firstName': currentLanguage === 'no' ? 'fornavn' : 'first name',
        'lastName': currentLanguage === 'no' ? 'etternavn' : 'last name',
        'phone': currentLanguage === 'no' ? 'telefonnummer' : 'phone number',
        'address': currentLanguage === 'no' ? 'adresse' : 'address',
        'message': currentLanguage === 'no' ? 'melding' : 'message'
    };
    return labels[field] || field;
}

function isValidPhone(phone) {
    const phoneRegex = /^(\+47|0047|47)?[2-9]\d{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form persistence
function setupFormPersistence() {
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    
    formInputs.forEach(input => {
        const savedValue = getCookie(`form_${input.name}`);
        if (savedValue && input.type !== 'file') {
            input.value = savedValue;
        }
        
        input.addEventListener('input', function() {
            if (this.type !== 'file') {
                setCookie(`form_${this.name}`, this.value, 7);
            }
        });
        
        input.addEventListener('change', function() {
            if (this.type !== 'file') {
                setCookie(`form_${this.name}`, this.value, 7);
            }
        });
    });
}

function clearFormData() {
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    formInputs.forEach(input => {
        deleteCookie(`form_${input.name}`);
    });
}

function setupFormValidation() {
    const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
    }
    
    return isValid;
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colors[type] || colors.info;
}

function setupScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    createBackToTopButton();
}

function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--gradient);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.2rem;
        box-shadow: var(--shadow);
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(backToTop);
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const animateElements = document.querySelectorAll('.feature-card, .service-card, .project-card, .contact-item, .coverage-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

function setupAccessibility() {
    const interactiveElements = document.querySelectorAll('.feature-card, .service-card, .project-card');
    
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .feature-card:focus,
        .service-card:focus,
        .project-card:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        window.location.href = 'pages/contact.html';
    }
}

function saveUserPreferences() {
    setCookie('userLanguage', currentLanguage, 365);
    setCookie('userTheme', currentTheme, 365);
    console.log('Saved preferences:', { language: currentLanguage, theme: currentTheme });
}

function loadUserPreferences() {
    const savedLanguage = getCookie('userLanguage');
    const savedTheme = getCookie('userTheme');
    
    console.log('Loading preferences:', { savedLanguage, savedTheme });
    
    if (savedLanguage && checkTranslations() && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
        console.log('Loaded language:', currentLanguage);
    }
    
    // Применяем язык сразу после загрузки
    setTimeout(() => {
        updateLanguageButton();
        applyTranslations(currentLanguage);
    }, 50);
    
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            
            if (savedTheme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
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

const optimizedScrollHandler = debounce(handleNavbarScroll, 10);
window.addEventListener('scroll', optimizedScrollHandler);

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        showNotification('En feil oppstod. Sjekk konsollen for detaljer.', 'error');
    }
});

// Export functions
window.toggleTheme = toggleTheme;
window.toggleLanguage = toggleLanguage;
window.toggleMobileMenu = toggleMobileMenu;
window.acceptCookies = acceptCookies;
window.submitContactForm = submitContactForm;
window.scrollToContact = scrollToContact;

// Add CSS animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.2rem;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .back-to-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    
    input.error,
    textarea.error,
    select.error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
    
    input.valid,
    textarea.valid,
    select.valid {
        border-color: #28a745 !important;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1) !important;
    }
`;

document.head.appendChild(notificationStyles);

console.log('Main JavaScript loaded successfully! 🚀');