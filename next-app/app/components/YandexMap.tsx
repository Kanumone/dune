'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Location, LocationCategory, Popularity } from '@/app/lib/types';

declare global {
  interface Window {
    ymaps3: typeof ymaps3;
    ymaps3Loaded?: boolean;
    ymaps3Loading?: Promise<void>;
  }
  const ymaps3: {
    ready: Promise<void>;
    YMap: new (
      container: HTMLElement,
      options: { location: { center: [number, number]; zoom: number } }
    ) => YMap;
    YMapDefaultSchemeLayer: new () => unknown;
    YMapDefaultFeaturesLayer: new () => unknown;
    YMapControls: new (options: { position: string }) => YMapControls;
    YMapListener: new (options: { layer: string; onWheel: (e: WheelEvent) => void }) => unknown;
    import: (module: string) => Promise<{
      YMapZoomControl?: new (options: object) => unknown;
      YMapDefaultMarker?: new (options: MarkerOptions) => YMapMarker;
    }>;
  };

  interface YMap {
    addChild: (child: unknown) => void;
    removeChild: (child: unknown) => void;
    setLocation: (options: { center: [number, number]; zoom: number; duration?: number }) => void;
  }

  interface YMapControls {
    addChild: (child: unknown) => void;
  }

  interface YMapMarker {
    update: (options: { visible?: boolean }) => void;
  }

  interface MarkerOptions {
    coordinates: [number, number];
    title: string;
    content: HTMLElement;
    onClick: () => void;
  }
}

interface YandexMapProps {
  locations: Location[];
  activeFilter: LocationCategory | null;
  onSelectLocation: (location: Location) => void;
  selectedLocation: Location | null;
}

interface MarkerData {
  marker: YMapMarker;
  location: Location;
}

const YANDEX_MAPS_API_KEY = '3ddfa66d-9152-44b9-a601-4828b27c8170';

function getMarkerSize(popularity: Popularity): number {
  const sizes = { small: 32, medium: 40, large: 48 };
  return sizes[popularity] || 40;
}

function loadYandexMapsScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is undefined'));
  }

  // Already loaded
  if (window.ymaps3Loaded) {
    return Promise.resolve();
  }

  // Currently loading
  if (window.ymaps3Loading) {
    return window.ymaps3Loading;
  }

  // Start loading
  window.ymaps3Loading = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src*="api-maps.yandex.ru"]`);
    if (existingScript) {
      window.ymaps3Loaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
    script.async = true;

    script.onload = () => {
      window.ymaps3Loaded = true;
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Yandex Maps script'));
    };

    document.head.appendChild(script);
  });

  return window.ymaps3Loading;
}

export default function YandexMap({
  locations,
  activeFilter,
  onSelectLocation,
  selectedLocation,
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<YMap | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  const initializedRef = useRef(false);

  const createMarkerElement = useCallback((location: Location): HTMLElement => {
    const size = getMarkerSize(location.popularity);

    const markerElement = document.createElement('div');
    markerElement.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: #fd7e14;
      opacity: 0.9;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
      position: relative;
      transition: transform 0.2s;
    `;

    const innerCircle = document.createElement('div');
    innerCircle.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${size - 12}px;
      height: ${size - 12}px;
      border-radius: 50%;
      background: white;
      opacity: 0.3;
    `;
    markerElement.appendChild(innerCircle);

    markerElement.addEventListener('mouseenter', () => {
      markerElement.style.transform = 'scale(1.1)';
    });
    markerElement.addEventListener('mouseleave', () => {
      markerElement.style.transform = 'scale(1)';
    });

    return markerElement;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') return;
    if (locations.length === 0) return;
    if (initializedRef.current) return;

    initializedRef.current = true;

    const initMap = async () => {
      try {
        await loadYandexMapsScript();
        await ymaps3.ready;

        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapListener } = ymaps3;
        const { YMapZoomControl } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
        const { YMapDefaultMarker } = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');

        if (!mapRef.current || !YMapDefaultMarker || mapInstanceRef.current) return;

        const map = new YMap(mapRef.current, {
          location: {
            center: [27.5615, 53.9045],
            zoom: 13,
          },
        });

        map.addChild(new YMapDefaultSchemeLayer());
        map.addChild(new YMapDefaultFeaturesLayer());

        const controls = new YMapControls({ position: 'right' });
        if (YMapZoomControl) {
          controls.addChild(new YMapZoomControl({}));
        }
        map.addChild(controls);

        map.addChild(
          new YMapListener({
            layer: 'any',
            onWheel: (event: WheelEvent) => {
              event.preventDefault();
            },
          })
        );

        // Create markers
        locations.forEach((location) => {
          const markerElement = createMarkerElement(location);

          const marker = new YMapDefaultMarker({
            coordinates: [location.coords[1], location.coords[0]],
            title: location.title,
            content: markerElement,
            onClick: () => onSelectLocation(location),
          });

          markersRef.current.push({ marker, location });
          map.addChild(marker);
        });

        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
        initializedRef.current = false;
      }
    };

    initMap();
  }, [locations, createMarkerElement, onSelectLocation]);

  // Filter markers
  useEffect(() => {
    markersRef.current.forEach(({ marker, location }) => {
      if (!activeFilter || location.categories.includes(activeFilter)) {
        marker.update({ visible: true });
      } else {
        marker.update({ visible: false });
      }
    });
  }, [activeFilter]);

  // Center on selected location
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setLocation({
        center: [selectedLocation.coords[1], selectedLocation.coords[0]],
        zoom: 14,
        duration: 300,
      });
    }
  }, [selectedLocation]);

  return <div ref={mapRef} id="map" />;
}
