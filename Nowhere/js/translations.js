// Complete translations object for Norwegian and English
const translations = {
    no: {
        // Site meta and navigation
        'site-title': 'Nordmaling AS - Profesjonell Malertjeneste i Norge',
        'company-name': 'Nordmaling AS',
        'nav-home': 'Hjem',
        'nav-projects': 'Prosjekter',
        'nav-services': 'Tjenester',
        'nav-map': 'Dekningsområde',
        'nav-contact': 'Kontakt',

        // Hero section
        'hero-title': 'Profesjonell Malertjeneste i Norge',
        'hero-description': 'Vi er et erfaren malerteam som leverer høykvalitets malerarbeid med fokus på individuell tilnærming, topp kvalitet, konkurransedyktige priser og rask leveranse. Vårt team har over 15 års erfaring og vi er stolte av å være en av de mest pålitelige malerselskapene i Helgeland-regionen.',
        'hero-cta': 'Få tilbud i dag',

        // Features section
        'features-title': 'Våre Fordeler',
        'feature-individual': 'Individuell Tilnærming',
        'feature-individual-desc': 'Vi tilpasser våre tjenester til dine spesifikke behov og ønsker.',
        'feature-quality': 'Topp Kvalitet',
        'feature-quality-desc': 'Vi bruker kun de beste materialene og teknikker for å sikre varig resultat.',
        'feature-price': 'Konkurransedyktige Priser',
        'feature-price-desc': 'Vi tilbyr rimelige priser uten å gå på kompromiss med kvaliteten.',
        'feature-speed': 'Rask Leveranse',
        'feature-speed-desc': 'Vi fullfører prosjektene dine på tid og innenfor budsjett.',

        // Contact section
        'contact-title': 'Kontakt Oss',
        'form-firstname': 'Fornavn *',
        'form-lastname': 'Etternavn *',
        'form-phone': 'Telefon *',
        'form-address': 'Adresse *',
        'form-email': 'E-post',
        'form-photo': 'Last opp bilde',
        'form-message': 'Melding *',
        'form-submit': 'Send forespørsel',
        'form-service': 'Type tjeneste',
        'select-service': 'Velg tjeneste',
        'photo-help': 'Du kan laste opp flere bilder av området som skal males',

        // Services page
        'services-title': 'Tjenester - Nordmaling AS',
        'services-hero-title': 'Våre Tjenester',
        'services-hero-desc': 'Komplett utvalg av profesjonelle malertjenester tilpasset dine behov',
        'service-exterior': 'Utendørs Maling',
        'service-interior': 'Innendørs Maling',
        'service-roof': 'Takmaling',
        'service-roof-cleaning': 'Takrensing',
        'service-waste': 'Avfallshåndtering',
        'service-other': 'Annet',

        // Service prices
        'price-from': 'Fra 150 kr/m²',
        'price-from-interior': 'Fra 80 kr/m²',
        'price-from-roof': 'Fra 200 kr/m²',
        'price-from-cleaning': 'Fra 50 kr/m²',
        'price-from-waste': 'Fra 500 kr',

        // Service descriptions
        'service-exterior-desc': 'Profesjonell utendørs maling av hus, garasjer og andre bygninger. Vi bruker værbestandige malinger av høy kvalitet som tåler norske værforhold.',
        'service-interior-desc': 'Innendørs maling av vegger, tak og treverk. Vi skaper vakre og harmoniske interiører med profesjonell finish.',
        'service-roof-desc': 'Spesialisert takmaling for alle typer tak. Vi bruker spesialmaling som beskytter mot fuktighet og forlenger takets levetid.',
        'service-roof-cleaning-desc': 'Grundig rengjøring av tak for å fjerne mose, sopp og skitt. Forbereder taket for maling eller forlenger levetiden.',
        'service-waste-desc': 'Profesjonell håndtering og fjerning av bygningsavfall og gammelt malermateriell etter endt arbeid.',

        // Service details
        'exterior-prep': 'Overflatebehandling og grunning',
        'exterior-paint': 'Høykvalitets utendørsmaling',
        'exterior-finish': 'Beskyttende sluttbehandling',
        'interior-walls': 'Vegg- og takmaling',
        'interior-trim': 'Maling av lister og treverk',
        'interior-texture': 'Strukturmaling og spesialfinish',
        'roof-inspection': 'Takinspeksjon og reparasjon',
        'roof-cleaning': 'Rengjøring før maling',
        'roof-coating': 'Beskyttende takbelegg',
        'cleaning-moss': 'Fjerning av mose og alger',
        'cleaning-pressure': 'Høytrykksspyling',
        'cleaning-treatment': 'Forebyggende behandling',
        'waste-removal': 'Avfallsfjerning',
        'waste-sorting': 'Kildesortering',
        'waste-disposal': 'Miljøvennlig deponi',

        // Custom services
        'custom-title': 'Finner du ikke det du leter etter?',
        'custom-desc': 'Ikke bekymre deg! Beskriv hva du ønsker og vi vil gjøre vårt beste for å hjelpe deg. Vi tilbyr skreddersydde løsninger for alle typer malerprosjekter.',
        'custom-contact': 'Kontakt oss',

        // Projects page
        'projects-title': 'Prosjekter - Nordmaling AS',
        'projects-hero-title': 'Våre Prosjekter',
        'projects-hero-desc': 'Se eksempler på vårt arbeid og la deg inspirere',
        'search-placeholder': 'Søk etter prosjekter...',
        'search-btn': 'Søk',
        'filter-all': 'Alle',
        'filter-exterior': 'Utendørs maling',
        'filter-interior': 'Innendørs maling',
        'filter-roof-painting': 'Takmaling',
        'filter-roof-cleaning': 'Takrensing',
        'filter-waste': 'Avfallshåndtering',
        'filter-other': 'Annet',
        'coming-soon-title': 'Mer kommer snart!',
        'coming-soon-desc': 'Vi jobber kontinuerlig med nye prosjekter. Kom tilbake snart for å se flere av våre arbeider.',
        'no-projects': 'Ingen prosjekter funnet',
        'project-description': 'Prosjektbeskrivelse',

        // Map page
        'map-title': 'Dekningsområde - Nordmaling AS',
        'map-hero-title': 'Vårt Dekningsområde',
        'map-hero-desc': 'Vi leverer tjenester i Helgeland-regionen og omkringliggende områder',
        'address-check-title': 'Sjekk om vi leverer til din adresse',
        'address-check-desc': 'Skriv inn din adresse for å se om vi kan levere tjenester til deg',
        'address-placeholder': 'Skriv inn din adresse...',
        'check-address-btn': 'Sjekk adresse',
        'map-section-title': 'Helgeland Regionen',
        'map-placeholder-text': 'Google Maps vil bli lastet her',
        'map-placeholder-desc': 'Helgeland og omkringliggende områder', 
        'legend-primary': 'Primært serviceområde',
        'legend-secondary': 'Sekundært serviceområde', 
        'legend-extended': 'Utvidet område (etter avtale)',


        // Coverage areas
        'coverage-title': 'Områder vi dekker',
        'coverage-desc': 'Vi leverer profesjonelle malertjenester til følgende områder i og rundt Helgeland-regionen:',
        'coverage-mo': 'Sentral beliggenhet med full service tilgjengelig',
        'coverage-mosjoen': 'Komplett utvalg av alle våre tjenester',
        'coverage-sandnessjoen': 'Kyst og innlandsområder dekket',
        'coverage-bronnoysund': 'Utvidet serviceområde etter avtale',
        'coverage-hemnes': 'Lokale prosjekter og hurtig respons',
        'coverage-nesna': 'Øyområder og fastland',
        'coverage-rana': 'Hele kommunen dekket',
        'coverage-other': 'Kontakt oss for andre lokasjoner',
        'other-areas-title': 'Bor du utenfor vårt hovedområde?',
        'other-areas-desc': 'Vi vurderer også prosjekter utenfor vårt hovedområde. Kontakt oss for å diskutere mulighetene!',
        'contact-us-btn': 'Kontakt oss',

        // Contact page
        'contact-page-title': 'Kontakt - Nordmaling AS',
        'contact-hero-title': 'Ta Kontakt Med Oss',
        'contact-hero-desc': 'Vi er klare til å hjelpe deg med ditt neste malerprosjekt',
        'contact-info-title': 'Kontaktinformasjon',
        'contact-phone': 'Telefon',
        'contact-email': 'E-post',
        'contact-address': 'Adresse',
        'contact-address-text': 'Malerveien 123<br>8600 Mo i Rana',
        'contact-website': 'Nettside',
        'contact-form-title': 'Send oss en melding',

        // Business hours
        'business-hours-title': 'Åpningstider',
        'monday-friday': 'Mandag - Fredag',
        'saturday': 'Lørdag',
        'sunday': 'Søndag',
        'closed': 'Stengt',

        // Emergency contact
        'emergency-title': 'Akutt behov for hjelp?',
        'emergency-desc': 'Ring oss for akutte maleroppgaver og skadereparasjoner',

        // Footer
        'footer-description': 'Profesjonell malertjeneste i Norge siden 2008',
        'footer-contact': 'Kontakt',
        'footer-rights': 'Alle rettigheter forbeholdt.',

        // Cookie consent
        'cookie-message': 'Vi bruker informasjonskapsler for å forbedre din opplevelse på nettstedet vårt.',
        'cookie-accept': 'Godta'
    },
    en: {
        // Site meta and navigation
        'site-title': 'Nordmaling AS - Professional Painting Services in Norway',
        'company-name': 'Nordmaling AS',
        'nav-home': 'Home',
        'nav-projects': 'Projects',
        'nav-services': 'Services',
        'nav-map': 'Coverage Area',
        'nav-contact': 'Contact',

        // Hero section
        'hero-title': 'Professional Painting Services in Norway',
        'hero-description': 'We are an experienced painting team that delivers high-quality painting work with focus on individual approach, top quality, competitive prices and fast delivery. Our team has over 15 years of experience and we are proud to be one of the most reliable painting companies in the Helgeland region.',
        'hero-cta': 'Get quote today',

        // Features section
        'features-title': 'Our Advantages',
        'feature-individual': 'Individual Approach',
        'feature-individual-desc': 'We adapt our services to your specific needs and wishes.',
        'feature-quality': 'Top Quality',
        'feature-quality-desc': 'We use only the best materials and techniques to ensure lasting results.',
        'feature-price': 'Competitive Prices',
        'feature-price-desc': 'We offer affordable prices without compromising on quality.',
        'feature-speed': 'Fast Delivery',
        'feature-speed-desc': 'We complete your projects on time and within budget.',

        // Contact section
        'contact-title': 'Contact Us',
        'form-firstname': 'First Name *',
        'form-lastname': 'Last Name *',
        'form-phone': 'Phone *',
        'form-address': 'Address *',
        'form-email': 'Email',
        'form-photo': 'Upload image',
        'form-message': 'Message *',
        'form-submit': 'Send inquiry',
        'form-service': 'Service type',
        'select-service': 'Select service',
        'photo-help': 'You can upload multiple images of the area to be painted',

        // Services page
        'services-title': 'Services - Nordmaling AS',
        'services-hero-title': 'Our Services',
        'services-hero-desc': 'Complete range of professional painting services tailored to your needs',
        'service-exterior': 'Exterior Painting',
        'service-interior': 'Interior Painting',
        'service-roof': 'Roof Painting',
        'service-roof-cleaning': 'Roof Cleaning',
        'service-waste': 'Waste Management',
        'service-other': 'Other',

        // Service prices
        'price-from': 'From 150 NOK/m²',
        'price-from-interior': 'From 80 NOK/m²',
        'price-from-roof': 'From 200 NOK/m²',
        'price-from-cleaning': 'From 50 NOK/m²',
        'price-from-waste': 'From 500 NOK',

        // Service descriptions
        'service-exterior-desc': 'Professional exterior painting of houses, garages and other buildings. We use weather-resistant paints of high quality that withstand Norwegian weather conditions.',
        'service-interior-desc': 'Interior painting of walls, ceilings and woodwork. We create beautiful and harmonious interiors with professional finish.',
        'service-roof-desc': 'Specialized roof painting for all types of roofs. We use special paint that protects against moisture and extends the roof\'s lifespan.',
        'service-roof-cleaning-desc': 'Thorough roof cleaning to remove moss, fungus and dirt. Prepares the roof for painting or extends its lifespan.',
        'service-waste-desc': 'Professional handling and removal of construction waste and old painting materials after completed work.',

        // Service details
        'exterior-prep': 'Surface treatment and priming',
        'exterior-paint': 'High-quality exterior painting',
        'exterior-finish': 'Protective final treatment',
        'interior-walls': 'Wall and ceiling painting',
        'interior-trim': 'Painting of trim and woodwork',
        'interior-texture': 'Texture painting and special finishes',
        'roof-inspection': 'Roof inspection and repair',
        'roof-cleaning': 'Cleaning before painting',
        'roof-coating': 'Protective roof coating',
        'cleaning-moss': 'Removal of moss and algae',
        'cleaning-pressure': 'High-pressure washing',
        'cleaning-treatment': 'Preventive treatment',
        'waste-removal': 'Waste removal',
        'waste-sorting': 'Source sorting',
        'waste-disposal': 'Environmentally friendly disposal',

        // Custom services
        'custom-title': 'Can\'t find what you\'re looking for?',
        'custom-desc': 'Don\'t worry! Describe what you want and we will do our best to help you. We offer custom solutions for all types of painting projects.',
        'custom-contact': 'Contact us',

        // Projects page
        'projects-title': 'Projects - Nordmaling AS',
        'projects-hero-title': 'Our Projects',
        'projects-hero-desc': 'See examples of our work and get inspired',
        'search-placeholder': 'Search for projects...',
        'search-btn': 'Search',
        'filter-all': 'All',
        'filter-exterior': 'Exterior painting',
        'filter-interior': 'Interior painting',
        'filter-roof-painting': 'Roof painting',
        'filter-roof-cleaning': 'Roof cleaning',
        'filter-waste': 'Waste management',
        'filter-other': 'Other',
        'coming-soon-title': 'More coming soon!',
        'coming-soon-desc': 'We are continuously working on new projects. Come back soon to see more of our work.',
        'no-projects': 'No projects found',
        'project-description': 'Project Description',

        // Map page
        'map-title': 'Coverage Area - Nordmaling AS',
        'map-hero-title': 'Our Coverage Area',
        'map-hero-desc': 'We deliver services in the Helgeland region and surrounding areas',
        'address-check-title': 'Check if we deliver to your address',
        'address-check-desc': 'Enter your address to see if we can deliver services to you',
        'address-placeholder': 'Enter your address...',
        'check-address-btn': 'Check address',
        'map-section-title': 'Helgeland Region',
        'map-placeholder-text': 'Google Maps will be loaded here',
        'map-placeholder-desc': 'Helgeland and surrounding areas',
        'legend-primary': 'Primary service area',
        'legend-secondary': 'Secondary service area',
        'legend-extended': 'Extended area (by agreement)',

        // Coverage areas
        'coverage-title': 'Areas we cover',
        'coverage-desc': 'We deliver professional painting services to the following areas in and around the Helgeland region:',
        'coverage-mo': 'Central location with full service available',
        'coverage-mosjoen': 'Complete range of all our services',
        'coverage-sandnessjoen': 'Coast and inland areas covered',
        'coverage-bronnoysund': 'Extended service area by agreement',
        'coverage-hemnes': 'Local projects and quick response',
        'coverage-nesna': 'Island and mainland areas',
        'coverage-rana': 'Entire municipality covered',
        'coverage-other': 'Contact us for other locations',
        'other-areas-title': 'Do you live outside our main area?',
        'other-areas-desc': 'We also consider projects outside our main area. Contact us to discuss the possibilities!',
        'contact-us-btn': 'Contact us',

        // Contact page
        'contact-page-title': 'Contact - Nordmaling AS',
        'contact-hero-title': 'Get In Touch With Us',
        'contact-hero-desc': 'We are ready to help you with your next painting project',
        'contact-info-title': 'Contact Information',
        'contact-phone': 'Phone',
        'contact-email': 'Email',
        'contact-address': 'Address',
        'contact-address-text': 'Malerveien 123<br>8600 Mo i Rana',
        'contact-website': 'Website',
        'contact-form-title': 'Send us a message',

        // Business hours
        'business-hours-title': 'Business Hours',
        'monday-friday': 'Monday - Friday',
        'saturday': 'Saturday',
        'sunday': 'Sunday',
        'closed': 'Closed',

        // Emergency contact
        'emergency-title': 'Need urgent help?',
        'emergency-desc': 'Call us for urgent painting jobs and damage repairs',

        // Footer
        'footer-description': 'Professional painting service in Norway since 2008',
        'footer-contact': 'Contact',
        'footer-rights': 'All rights reserved.',

        // Cookie consent
        'cookie-message': 'We use cookies to improve your experience on our website.',
        'cookie-accept': 'Accept'
    }
};

// Проверяем, что переводы загружены
console.log('Translations loaded:', translations);

// Экспортируем для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}