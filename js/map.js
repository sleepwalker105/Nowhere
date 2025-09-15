// Map functionality without Google Maps API
let currentCityInfo = null;

// Helgeland region cities and coordinates
const HELGELAND_CITIES = [
    { name: 'Mo i Rana', population: '25,000+', type: 'primary' },
    { name: 'Mosjøen', population: '9,000+', type: 'primary' },
    { name: 'Sandnessjøen', population: '5,000+', type: 'primary' },
    { name: 'Brønnøysund', population: '5,000+', type: 'secondary' },
    { name: 'Hemnes', population: '4,500+', type: 'primary' },
    { name: 'Nesna', population: '1,800+', type: 'primary' }
];

// Initialize map functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('map.html')) {
        console.log('Interactive map initialized');
        setupAddressChecker();
        animateCityMarkers();
    }
});

// Setup address checker functionality
function setupAddressChecker() {
    const addressInput = document.getElementById('addressInput');
    
    if (addressInput) {
        // Enter key support
        addressInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAddress();
            }
        });
    }
}

// Animate city markers on load
function animateCityMarkers() {
    const markers = document.querySelectorAll('.city-marker');
    
    markers.forEach((marker, index) => {
        setTimeout(() => {
            marker.style.opacity = '0';
            marker.style.transform = 'scale(0)';
            marker.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                marker.style.opacity = '1';
                marker.style.transform = 'scale(1)';
            }, 100);
        }, index * 200);
    });
}

// Show city information
function showCityInfo(cityName) {
    const city = HELGELAND_CITIES.find(c => c.name === cityName);
    if (!city) return;
    
    const isNorvegian = currentLanguage === 'no';
    
    // Create info popup
    const popup = document.createElement('div');
    popup.className = 'city-info-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--bg-color);
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        width: 90%;
        text-align: center;
        border: 2px solid var(--primary-color);
    `;
    
    popup.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <i class="fas fa-map-marker-alt" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
        </div>
        <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">${city.name}</h3>
        <div style="margin-bottom: 1.5rem;">
            <p style="margin-bottom: 0.5rem;">
                <strong>${isNorvegian ? 'Befolkning:' : 'Population:'}</strong> ${city.population}
            </p>
            <p style="margin-bottom: 0.5rem;">
                <strong>${isNorvegian ? 'Servicenivå:' : 'Service Level:'}</strong> 
                <span style="color: ${city.type === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)'};">
                    ${city.type === 'primary' ? 
                        (isNorvegian ? 'Primært område' : 'Primary area') : 
                        (isNorvegian ? 'Sekundært område' : 'Secondary area')
                    }
                </span>
            </p>
        </div>
        <div style="margin-bottom: 1.5rem; color: var(--primary-color); font-weight: bold;">
            ${isNorvegian ? '✓ Vi leverer tjenester her!' : '✓ We provide services here!'}
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button onclick="window.location.href='contact.html'" 
                    style="background: var(--gradient); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: bold;">
                ${isNorvegian ? 'Kontakt oss' : 'Contact us'}
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                    style="background: var(--border-color); color: var(--text-color); border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer;">
                ${isNorvegian ? 'Lukk' : 'Close'}
            </button>
        </div>
    `;
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    
    backdrop.addEventListener('click', () => {
        backdrop.remove();
        popup.remove();
    });
    
    document.body.appendChild(backdrop);
    document.body.appendChild(popup);
    
    // Animate popup
    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
    
    setTimeout(() => {
        popup.style.transition = 'all 0.3s ease';
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

// Check if address is in service area
function checkAddress() {
    const addressInput = document.getElementById('addressInput');
    const addressResult = document.getElementById('addressResult');
    
    if (!addressInput || !addressResult) return;
    
    const address = addressInput.value.trim();
    
    if (!address) {
        showNotification(
            currentLanguage === 'no' ? 'Vennligst skriv inn en adresse' : 'Please enter an address',
            'warning'
        );
        addressInput.focus();
        return;
    }
    
    // Show loading state
    addressResult.style.display = 'block';
    addressResult.className = 'address-result';
    addressResult.innerHTML = `
        <span class="loading-spinner"></span> 
        ${currentLanguage === 'no' ? 'Sjekker adresse...' : 'Checking address...'}
    `;
    
    // Simulate address checking
    setTimeout(() => {
        simpleAddressCheck(address, addressResult);
    }, 1500);
}

// Simple address checking without external APIs
function simpleAddressCheck(address, resultElement) {
    const lowerAddress = address.toLowerCase();
    
    // Check for Helgeland cities and regions
    const helgelandKeywords = [
        'mo i rana', 'rana', 'mosjøen', 'sandnessjøen', 'brønnøysund', 
        'hemnes', 'nesna', 'vefsn', 'grane', 'hattfjelldal', 'alstahaug',
        'lurøy', 'træna', 'rødøy', 'meløy', 'gildeskål', 'beiarn',
        'saltdal', 'fauske', 'sørfold', 'hamarøy', 'steigen', 'lødingen'
    ];
    
    const isInServiceArea = helgelandKeywords.some(keyword => 
        lowerAddress.includes(keyword)
    );
    
    showAddressResult(isInServiceArea, address, resultElement);
}

// Show address check result
function showAddressResult(isAvailable, address, resultElement) {
    const isNorvegian = currentLanguage === 'no';
    
    if (isAvailable) {
        resultElement.className = 'address-result available';
        resultElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem;">
                <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
                <strong>${isNorvegian ? 'Flott!' : 'Great!'}</strong>
            </div>
            <p>${isNorvegian ? 'Vi leverer tjenester til' : 'We deliver services to'} <strong>${address}</strong></p>
            <button onclick="window.location.href='contact.html'" 
                    style="margin-top: 1rem; background: var(--primary-color); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: bold;">
                ${isNorvegian ? 'Kontakt oss nå' : 'Contact us now'}
            </button>
        `;
        
        // Add celebration animation
        celebrateResult();
        
    } else {
        resultElement.className = 'address-result unavailable';
        resultElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem;"></i>
                <strong>${isNorvegian ? 'Beklager' : 'Sorry'}</strong>
            </div>
            <p><strong>${address}</strong> ${isNorvegian ? 
                'er utenfor vårt hovedområde.' : 
                'is outside our main service area.'}</p>
            <p style="margin-top: 0.5rem;">${isNorvegian ? 
                'Men ikke bekymre deg! Vi vurderer også prosjekter utenfor vårt hovedområde.' : 
                'But don\'t worry! We also consider projects outside our main area.'}</p>
            <button onclick="window.location.href='contact.html'" 
                    style="margin-top: 1rem; background: var(--secondary-color); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: bold;">
                ${isNorvegian ? 'Kontakt oss likevel' : 'Contact us anyway'}
            </button>
        `;
    }
}

// Celebration animation for positive results
function celebrateResult() {
    // Create confetti effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 100);
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${['#ff6b35', '#004e89', '#ffd23f'][Math.floor(Math.random() * 3)]};
        top: 20%;
        left: ${Math.random() * 100}%;
        z-index: 9999;
        border-radius: 50%;
        pointer-events: none;
        animation: confetti-fall 3s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 3000);
}

// Add confetti animation to CSS
const confettiStyles = document.createElement('style');
confettiStyles.textContent = `
    @keyframes confetti-fall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(0,0,0,0.3);
        border-radius: 50%;
        border-top-color: var(--primary-color);
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

document.head.appendChild(confettiStyles);

// Export functions
window.checkAddress = checkAddress;
window.showCityInfo = showCityInfo;

console.log('Interactive map JavaScript loaded successfully! 🗺️');