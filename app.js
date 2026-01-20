// Map locations data (Snowdrifts)
const locations = [
    {
        id: 1,
        coords: [53.9045, 27.5615],
        title: 'Сугроб №1',
        district: 'Центральный',
        size: '220 м²',
        description: 'Уютное пространство с живой музыкой и дружелюбной атмосферой. Идеально для вечерних встреч с друзьями.',
        badges: ['Музыка', 'Движ на 220 м²'],
        time: 'Обычно после 23:00',
        peak: 'Пик — пятница / суббота',
        categories: ['music', 'party'],
        popularity: 'large'
    },
    {
        id: 2,
        coords: [53.9145, 27.5715],
        title: 'Сугроб №2',
        district: 'Советский',
        size: '150 м²',
        description: 'Странное и веселое место, где всегда что-то происходит. Арт-пространство с непредсказуемой атмосферой.',
        badges: ['Странно', 'Весело'],
        time: 'Обычно после 20:00',
        peak: 'Пик — четверг / пятница',
        categories: ['weird', 'party'],
        popularity: 'medium'
    },
    {
        id: 3,
        coords: [53.8945, 27.5515],
        title: 'Сугроб №3',
        district: 'Ленинский',
        size: '80 м²',
        description: 'Тихое место для душевных разговоров за чаем или глинтвейном. Камин, книги и уютная атмосфера.',
        badges: ['Чай', 'Глинтвейн', 'Камин'],
        time: 'Обычно после 18:00',
        peak: 'Пик — выходные',
        categories: ['cozy'],
        popularity: 'small'
    },
    {
        id: 4,
        coords: [53.9245, 27.5815],
        title: 'Сугроб №4',
        district: 'Партизанский',
        size: '300 м²',
        description: 'Самое громкое место в городе! Танцпол, DJ-сеты и безудержное веселье до утра.',
        badges: ['Угар', 'Танцы', 'DJ'],
        time: 'Обычно после 00:00',
        peak: 'Пик — пятница / суббота',
        categories: ['party'],
        popularity: 'large'
    },
    {
        id: 5,
        coords: [53.8845, 27.5415],
        title: 'Сугроб №5',
        district: 'Октябрьский',
        size: '120 м²',
        description: 'Живая музыка каждый вечер. От джаза до инди-рока. Приходите насладиться звуками.',
        badges: ['Живая музыка', 'Джаз', 'Инди'],
        time: 'Обычно после 21:00',
        peak: 'Пик — среда / пятница',
        categories: ['music'],
        popularity: 'medium'
    },
    {
        id: 6,
        coords: [53.9, 27.56],
        title: 'Сугроб №6',
        district: 'Фрунзенский',
        size: '95 м²',
        description: 'Экспериментальное арт-пространство. Выставки, перформансы и необычные события.',
        badges: ['Арт', 'Перформанс', 'Выставки'],
        time: 'Обычно после 19:00',
        peak: 'Пик — суббота',
        categories: ['weird'],
        popularity: 'small'
    },
    {
        id: 7,
        coords: [53.91, 27.57],
        title: 'Сугроб №7',
        district: 'Заводской',
        size: '180 м²',
        description: 'Музыка и веселье в равных пропорциях. Танцуй и слушай одновременно!',
        badges: ['Музыка', 'Танцы'],
        time: 'Обычно после 22:00',
        peak: 'Пик — выходные',
        categories: ['music', 'party'],
        popularity: 'medium'
    },
    {
        id: 8,
        coords: [53.89, 27.55],
        title: 'Сугроб №8',
        district: 'Первомайский',
        size: '65 м²',
        description: 'Маленькое уютное кафе с отличным выбором чая и домашними сладостями.',
        badges: ['Чай', 'Кофе', 'Сладости'],
        time: 'Обычно после 14:00',
        peak: 'Пик — воскресенье',
        categories: ['cozy'],
        popularity: 'small'
    }
];

let map;
let currentLocation = null;
let placemarksCollection = [];
let activeFilter = null;

// Initialize map when Yandex Maps API is ready
ymaps.ready(init);

function init() {
    // Create map
    map = new ymaps.Map('map', {
        center: [53.9045, 27.5615],
        zoom: 13,
        controls: ['zoomControl']
    }, {
        searchControlProvider: 'yandex#search',
        suppressMapOpenBlock: true,
        yandexMapDisablePoiInteractivity: true
    });

    // Disable scroll zoom for better UX
    map.behaviors.disable('scrollZoom');

    // Create all placemarks
    createPlacemarks();

    // Initialize UI
    initFilters();
    initLegend();
    initPlaceCard();

    // Show filters and legend immediately
    document.getElementById('filtersPanel').classList.add('visible');
    document.getElementById('legendPanel').classList.add('visible');
}

// Create placemarks for all locations
function createPlacemarks() {
    locations.forEach(location => {
        const placemark = new ymaps.Placemark(
            location.coords,
            {
                hintContent: location.title,
                locationData: location
            },
            {
                iconLayout: 'default#image',
                iconImageHref: getMarkerIcon(location.popularity),
                iconImageSize: getMarkerSize(location.popularity),
                iconImageOffset: getMarkerOffset(location.popularity)
            }
        );

        // Click handler
        placemark.events.add('click', function () {
            showPlaceCard(location);
        });

        placemarksCollection.push({
            placemark: placemark,
            location: location
        });

        map.geoObjects.add(placemark);
    });
}

// Get marker icon based on popularity
function getMarkerIcon(popularity) {
    const sizes = {
        small: 32,
        medium: 40,
        large: 48
    };
    const size = sizes[popularity] || 40;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
            <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="#fd7e14" opacity="0.9" filter="url(#shadow)"/>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 6}" fill="white" opacity="0.3"/>
    </svg>`;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

// Get marker size based on popularity
function getMarkerSize(popularity) {
    const sizes = {
        small: [32, 32],
        medium: [40, 40],
        large: [48, 48]
    };
    return sizes[popularity] || [40, 40];
}

// Get marker offset based on popularity
function getMarkerOffset(popularity) {
    const sizes = {
        small: [-16, -16],
        medium: [-20, -20],
        large: [-24, -24]
    };
    return sizes[popularity] || [-20, -20];
}

// Initialize hero panel
function initHeroPanel() {
    const heroPanel = document.getElementById('heroPanel');
    const ctaButton = document.getElementById('ctaButton');

    ctaButton.addEventListener('click', () => {
        // Hide hero panel with animation
        heroPanel.classList.add('hidden');

        // Show filters and legend after hero animation
        setTimeout(() => {
            document.getElementById('filtersPanel').classList.add('visible');
            document.getElementById('legendPanel').classList.add('visible');
        }, 200);
    });
}

// Initialize filters
function initFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter');

            // Toggle active state
            if (activeFilter === filter) {
                chip.classList.remove('active');
                activeFilter = null;
                showAllMarkers();
            } else {
                // Remove active from all chips
                filterChips.forEach(c => c.classList.remove('active'));
                // Add active to clicked chip
                chip.classList.add('active');
                activeFilter = filter;
                filterMarkers(filter);
            }
        });
    });
}

// Filter markers by category
function filterMarkers(category) {
    placemarksCollection.forEach(({ placemark, location }) => {
        if (location.categories.includes(category)) {
            placemark.options.set('visible', true);
        } else {
            placemark.options.set('visible', false);
        }
    });
}

// Show all markers
function showAllMarkers() {
    placemarksCollection.forEach(({ placemark }) => {
        placemark.options.set('visible', true);
    });
}

// Initialize legend
function initLegend() {
    const addButton = document.querySelector('.add-button');

    addButton.addEventListener('click', () => {
        alert('Функция добавления нового сугроба в разработке!');
    });
}

// Initialize place card
function initPlaceCard() {
    const closeButton = document.getElementById('closeCard');
    const mapButton = document.querySelector('.map-button');

    closeButton.addEventListener('click', () => {
        hidePlaceCard();
    });

    mapButton.addEventListener('click', () => {
        if (currentLocation) {
            const url = `https://yandex.ru/maps/?rtext=~${currentLocation.coords[0]},${currentLocation.coords[1]}&rtt=pd`;
            window.open(url, '_blank');
        }
    });
}

// Show place card with location data
function showPlaceCard(location) {
    currentLocation = location;
    const placeCard = document.getElementById('placeCard');

    // Update card content
    document.getElementById('cardTitle').textContent = location.title;
    document.getElementById('cardDistrict').textContent = location.district;
    document.getElementById('cardSize').textContent = location.size;
    document.getElementById('cardDescription').textContent = location.description;
    document.getElementById('cardTime').textContent = location.time;
    document.getElementById('cardPeak').textContent = location.peak;

    // Update badges
    const badgesContainer = document.getElementById('cardBadges');
    badgesContainer.innerHTML = location.badges.map(badge =>
        `<span class="badge">${badge}</span>`
    ).join('');

    // Show card
    placeCard.classList.add('visible');

    // Center map on selected location
    map.setCenter(location.coords, 14, {
        duration: 300
    });
}

// Hide place card
function hidePlaceCard() {
    const placeCard = document.getElementById('placeCard');
    placeCard.classList.remove('visible');
    currentLocation = null;
}

// Haptic feedback helper
function triggerHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Create snowfall animation
function createSnowfall() {
    const snowContainer = document.getElementById('snowContainer');
    const snowflakeCount = 50; // Number of snowflakes

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';

        // Random position
        snowflake.style.left = Math.random() * 100 + '%';

        // Random size
        const size = Math.random() * 0.5 + 0.5; // 0.5 to 1
        snowflake.style.fontSize = size + 'em';

        // Random animation duration (slower = more realistic)
        const duration = Math.random() * 10 + 10; // 10 to 20 seconds
        snowflake.style.animationDuration = duration + 's';

        // Random delay for staggered effect
        const delay = Math.random() * 5;
        snowflake.style.animationDelay = delay + 's';

        snowContainer.appendChild(snowflake);
    }
}

// Initialize snowfall when page loads
window.addEventListener('DOMContentLoaded', createSnowfall);
