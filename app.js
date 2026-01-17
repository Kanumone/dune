// Map locations data
const locations = [
    {
        id: 1,
        coords: [53.9045, 27.5615], // Минск
        title: 'Дюна у озера',
        rating: 4.8,
        tags: ['закат', 'костёр', 'вид'],
        distance: '10 мин пешком',
        type: 'fire'
    },
    {
        id: 2,
        coords: [53.9145, 27.5715],
        title: 'Песчаный берег',
        rating: 4.6,
        tags: ['пляж', 'купание'],
        distance: '15 мин пешком',
        type: 'camera'
    },
    {
        id: 3,
        coords: [53.8945, 27.5515],
        title: 'Музыкальная поляна',
        rating: 4.9,
        tags: ['музыка', 'тусовка'],
        distance: '8 мин пешком',
        type: 'music'
    },
    {
        id: 4,
        coords: [53.9245, 27.5815],
        title: 'Смотровая точка',
        rating: 4.7,
        tags: ['вид', 'фото'],
        distance: '20 мин пешком',
        type: 'camera'
    },
    {
        id: 5,
        coords: [53.8845, 27.5415],
        title: 'Вечерний костёр',
        rating: 4.5,
        tags: ['костёр', 'гитара'],
        distance: '12 мин пешком',
        type: 'fire'
    }
];

// Icon SVGs
const icons = {
    fire: `<svg viewBox="0 0 24 24" fill="currentColor" class="marker-icon">
        <path d="M12 2c1.5 3.5 3 6 3 8.5 0 3-2.5 5.5-5.5 5.5S4 13.5 4 10.5c0-2 1-4.5 2.5-7C7.5 5 9 7 10 9c.5-3 2-5.5 2-7z"/>
    </svg>`,
    music: `<svg viewBox="0 0 24 24" fill="currentColor" class="marker-icon">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>`,
    camera: `<svg viewBox="0 0 24 24" fill="currentColor" class="marker-icon">
        <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>`
};

let map;
let currentLocation = locations[0];

// Initialize map
async function initMap() {
    try {
        // Wait for Yandex Maps API to load
        await ymaps3.ready;

        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton, YMapMarker } = ymaps3;

        // Create map instance
        map = new YMap(
            document.getElementById('map'),
            {
                location: {
                    center: [27.5615, 53.9045], // [longitude, latitude]
                    zoom: 13
                },
                theme: 'dark'
            }
        );

        // Add layers
        map.addChild(new YMapDefaultSchemeLayer({
            theme: 'dark'
        }));
        map.addChild(new YMapDefaultFeaturesLayer());

        // Add markers
        locations.forEach(location => {
            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker';
            markerElement.innerHTML = icons[location.type];
            markerElement.onclick = () => selectLocation(location);

            const marker = new YMapMarker(
                {
                    coordinates: [location.coords[1], location.coords[0]],
                    draggable: false
                },
                markerElement
            );

            map.addChild(marker);
        });

        // Add cluster markers (simulate clusters)
        addClusterMarkers();

    } catch (error) {
        console.error('Failed to initialize map:', error);
        // Fallback: show static map or error message
        showMapError();
    }
}

// Add cluster markers
function addClusterMarkers() {
    const clusters = [
        { coords: [27.5415, 53.8945], count: 5 },
        { coords: [27.5915, 53.9145], count: 3 }
    ];

    clusters.forEach(cluster => {
        const { YMapMarker } = ymaps3;
        const clusterElement = document.createElement('div');
        clusterElement.className = 'cluster-marker';
        clusterElement.textContent = cluster.count;

        const marker = new YMapMarker(
            {
                coordinates: [cluster.coords[0], cluster.coords[1]],
                draggable: false
            },
            clusterElement
        );

        map.addChild(marker);
    });
}

// Select location
function selectLocation(location) {
    currentLocation = location;
    updateBottomSheet(location);
}

// Update bottom sheet content
function updateBottomSheet(location) {
    document.querySelector('.place-title').textContent = location.title;
    document.querySelector('.rating-value').textContent = location.rating;

    const tagsContainer = document.querySelector('.tags');
    tagsContainer.innerHTML = location.tags.map(tag =>
        `<span class="tag">${tag}</span>`
    ).join('');

    document.querySelector('.distance span').textContent = location.distance;
}

// Bottom sheet drag functionality
function initBottomSheet() {
    const bottomSheet = document.getElementById('bottomSheet');
    const handle = bottomSheet.querySelector('.bottom-sheet-handle');
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
        bottomSheet.style.transition = 'none';
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY - startY;
        if (currentY > 0) {
            bottomSheet.style.transform = `translateY(${currentY}px)`;
        }
    });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        bottomSheet.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        if (currentY > 100) {
            bottomSheet.style.transform = 'translateY(50%)';
        } else {
            bottomSheet.style.transform = 'translateY(0)';
        }
        currentY = 0;
    });
}

// Button handlers
function initButtons() {
    document.getElementById('routeBtn').addEventListener('click', () => {
        // Haptic feedback (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        console.log('Route to:', currentLocation.title);
        // Here you would implement route functionality
        alert(`Построить маршрут к: ${currentLocation.title}`);
    });

    document.getElementById('shareBtn').addEventListener('click', async () => {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: currentLocation.title,
                    text: `Посмотри это место: ${currentLocation.title}`,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback
            alert('Поделиться: ' + currentLocation.title);
        }
    });
}

// Show error if map fails to load
function showMapError() {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: var(--bg-dark-secondary);">
            <p style="color: var(--text-secondary); padding: 20px; text-align: center;">
                Не удалось загрузить карту.<br>
                Проверьте API ключ Яндекс.Карт.
            </p>
        </div>
    `;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBottomSheet();
    initButtons();

    // Initialize map when API is ready
    if (typeof ymaps3 !== 'undefined') {
        initMap();
    } else {
        // Fallback if API didn't load
        showMapError();
    }
});
