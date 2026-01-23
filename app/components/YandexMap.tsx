'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Location, LocationCategory, Popularity } from '@/app/lib/types';

// Import Yandex Maps types
type YMaps3 = typeof import('@yandex/ymaps3-types');

declare global {
  interface Window {
    ymaps3?: YMaps3;
    ymaps3Loaded?: boolean;
    ymaps3Loading?: Promise<void>;
  }
}

interface YandexMapProps {
  locations: Location[];
  activeFilter: LocationCategory | null;
  onSelectLocation: (location: Location) => void;
  selectedLocation: Location | null;
}

const YANDEX_MAPS_API_KEY = '3ddfa66d-9152-44b9-a601-4828b27c8170';
const MINSK_CENTER: [number, number] = [27.5615, 53.9045];

function getMarkerSize(popularity: Popularity): number {
  const sizes = { small: 32, medium: 40, large: 48 };
  return sizes[popularity] || 40;
}

function loadYandexMapsScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is undefined'));
  }

  if (window.ymaps3Loaded) {
    return Promise.resolve();
  }

  if (window.ymaps3Loading) {
    return window.ymaps3Loading;
  }

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

function createMarkerElement(location: Location): HTMLElement {
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
}

interface ReactifiedAPI {
  reactify: {
    useDefault: <T>(value: T, deps?: any[]) => T;
  };
  [key: string]: any;
}

export default function YandexMap({
  locations,
  activeFilter,
  onSelectLocation,
  selectedLocation,
}: YandexMapProps) {
  const [reactifiedAPI, setReactifiedAPI] = useState<ReactifiedAPI | null>(null);

  // Memoize filtered locations to prevent unnecessary rerenders
  const filteredLocations = useMemo(() => {
    return locations.filter(
      (location) => !activeFilter || location.categories.includes(activeFilter)
    );
  }, [locations, activeFilter]);

  // Memoize location state to use with reactify.useDefault
  const mapLocation = useMemo(() => {
    if (selectedLocation) {
      return {
        center: [selectedLocation.coords[1], selectedLocation.coords[0]] as [number, number],
        zoom: 14,
        duration: 300,
      };
    }
    return {
      center: MINSK_CENTER,
      zoom: 13,
    };
  }, [selectedLocation]);

  // Initialize reactify API once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;

    const initReactify = async () => {
      try {
        await loadYandexMapsScript();

        // Wait for ymaps3 to be available
        if (!window.ymaps3) {
          throw new Error('ymaps3 not loaded');
        }

        const ymaps3 = window.ymaps3;
        await ymaps3.ready;
        await ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', ['@yandex/ymaps3-default-ui-theme@0.0']);

        // Import reactify module
        const ymaps3React = await ymaps3.import('@yandex/ymaps3-reactify');

        if (!mounted) return;

        // Bind reactify to React and ReactDOM
        const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

        // Create React components from ymaps3 core module
        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
          YMapControls,
          YMapMarker,
        } = reactify.module(ymaps3);

        // Import and reactify default UI theme components
        const ymaps3DefaultUITheme = await ymaps3.import('@yandex/ymaps3-default-ui-theme' as any);
        const uiThemeComponents = reactify.module(ymaps3DefaultUITheme) as any;

        setReactifiedAPI({
          reactify,
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
          YMapControls,
          YMapMarker,
          YMapZoomControl: uiThemeComponents.YMapZoomControl,
          YMapDefaultMarker: uiThemeComponents.YMapDefaultMarker,
        });
      } catch (error) {
        console.error('Error initializing Yandex Maps:', error);
      }
    };

    initReactify();

    return () => {
      mounted = false;
    };
  }, []);

  // Return loading state
  if (!reactifiedAPI) {
    return <div id="map" style={{ width: '100%', height: '100%' }} />;
  }

  const { reactify, YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapZoomControl, YMapDefaultMarker } =
    reactifiedAPI;

  return (
    <div id="map">
      <YMap location={reactify.useDefault(mapLocation, [mapLocation])}>
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        

        <YMapControls position="right">
          <YMapZoomControl />
        </YMapControls>

        {filteredLocations.map((location) => (
          <YMapDefaultMarker
            key={location.id}
            coordinates={reactify.useDefault(
              [location.coords[1], location.coords[0]] as [number, number],
              [location.id]
            )}
            title={location.title}
            content={createMarkerElement(location)}
            onClick={() => onSelectLocation(location)}
          />
        ))}
      </YMap>
    </div>
  );
}
