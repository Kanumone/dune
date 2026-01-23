'use client';

import { useState, useEffect } from 'react';
import { Location, LocationCategory } from '@/app/lib/types';
import Header from '@/app/components/Header';
import FiltersPanel from '@/app/components/FiltersPanel';
import LegendPanel from '@/app/components/LegendPanel';
import PlaceCard from '@/app/components/PlaceCard';
import SnowAnimation from '@/app/components/SnowAnimation';
import YandexMap from '@/app/components/YandexMap';

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeFilter, setActiveFilter] = useState<LocationCategory | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleFilterChange = (filter: LocationCategory | null) => {
    setActiveFilter(filter);
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleClosePlaceCard = () => {
    setSelectedLocation(null);
  };

  if (loading) {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000]">
        <div className="w-12 h-12 border-4 border-accent-warm/20 border-t-accent-warm rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <YandexMap
        locations={locations}
        activeFilter={activeFilter}
        onSelectLocation={handleSelectLocation}
        selectedLocation={selectedLocation}
      />
      {/* <SnowAnimation /> */}
      <FiltersPanel activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      <LegendPanel onLocationAdded={fetchLocations} />
      <PlaceCard location={selectedLocation} onClose={handleClosePlaceCard} />
    </>
  );
}
