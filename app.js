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
let markersCollection = [];
let activeFilter = null;

// Initialize map when page loads
window.onload = async function() {
    await initMap();
    initFilters();
    initLegend();
    initPlaceCard();
    createSnowfall();

    // Show filters and legend immediately
    document.getElementById('filtersPanel').classList.add('visible');
    document.getElementById('legendPanel').classList.add('visible');
};

async function initMap() {
    // Wait for Yandex Maps API to be ready
    await ymaps3.ready;

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = ymaps3;
    const {YMapZoomControl} = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
    const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');

    // Create map
    map = new YMap(
        document.getElementById('map'),
        {
            location: {
                center: [27.5615, 53.9045], // Note: v3 uses [lng, lat] instead of [lat, lng]
                zoom: 13
            }
        }
    );

    // Add scheme layer (map tiles)
    map.addChild(new YMapDefaultSchemeLayer());

    // Add features layer (for markers)
    map.addChild(new YMapDefaultFeaturesLayer());

    // Add zoom control
    const controls = new YMapControls({position: 'right'});
    controls.addChild(new YMapZoomControl({}));
    map.addChild(controls);

    // Disable scroll zoom for better UX
    map.addChild(new ymaps3.YMapListener({
        layer: 'any',
        onWheel: (event) => {
            event.preventDefault();
        }
    }));

    // Create all markers
    createMarkers(YMapDefaultMarker);
}

// Create markers for all locations
function createMarkers(YMapDefaultMarker) {
    locations.forEach(location => {
        // Get marker size and color based on popularity
        const markerConfig = getMarkerConfig(location.popularity);

        // Create custom HTML content for marker
        const markerElement = document.createElement('div');
        markerElement.style.cssText = `
            width: ${markerConfig.size}px;
            height: ${markerConfig.size}px;
            border-radius: 50%;
            background: #fd7e14;
            opacity: 0.9;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            position: relative;
            transition: transform 0.2s;
        `;

        // Inner white circle for effect
        const innerCircle = document.createElement('div');
        innerCircle.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${markerConfig.size - 12}px;
            height: ${markerConfig.size - 12}px;
            border-radius: 50%;
            background: white;
            opacity: 0.3;
        `;
        markerElement.appendChild(innerCircle);

        // Hover effect
        markerElement.addEventListener('mouseenter', () => {
            markerElement.style.transform = 'scale(1.1)';
        });
        markerElement.addEventListener('mouseleave', () => {
            markerElement.style.transform = 'scale(1)';
        });

        // Create marker with custom element
        const marker = new YMapDefaultMarker({
            coordinates: [location.coords[1], location.coords[0]], // v3 uses [lng, lat]
            title: location.title,
            content: markerElement,
            onClick: () => {
                showPlaceCard(location);
            }
        });

        markersCollection.push({
            marker: marker,
            location: location
        });

        map.addChild(marker);
    });
}

// Get marker configuration based on popularity
function getMarkerConfig(popularity) {
    const configs = {
        small: { size: 32 },
        medium: { size: 40 },
        large: { size: 48 }
    };
    return configs[popularity] || { size: 40 };
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
    markersCollection.forEach(({ marker, location }) => {
        if (location.categories.includes(category)) {
            marker.update({visible: true});
        } else {
            marker.update({visible: false});
        }
    });
}

// Show all markers
function showAllMarkers() {
    markersCollection.forEach(({ marker }) => {
        marker.update({visible: true});
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
    map.setLocation({
        center: [location.coords[1], location.coords[0]], // v3 uses [lng, lat]
        zoom: 14,
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
    const snowflakeCount = 80; // Number of snowflakes

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';

        // Random position
        snowflake.style.left = Math.random() * 100 + '%';

        // Random size (larger range)
        const size = Math.random() * 0.8 + 0.7; // 0.7 to 1.5
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
