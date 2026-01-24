'use client';

import { useState, useEffect } from 'react';
import { Location, LocationCategory } from '@/app/lib/types';
import Header from '@/app/components/Header';
import LegendPanel from '@/app/components/LegendPanel';
import ContactPanel from '@/app/components/ContactPanel';
import PlaceCard from '@/app/components/PlaceCard';
import YandexMap from '@/app/components/YandexMap';

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeFilter, setActiveFilter] = useState<LocationCategory | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

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
    setIsLegendOpen(false);
    setIsContactOpen(false);
  };

  const handleClosePlaceCard = () => {
    setSelectedLocation(null);
  };

  const handleToggleLegend = () => {
    if (!isLegendOpen) {
      setIsContactOpen(false); // Close contact panel when opening legend
    }
    setIsLegendOpen(!isLegendOpen);
  };

  const handleToggleContact = () => {
    if (!isContactOpen) {
      setIsLegendOpen(false); // Close legend panel when opening contact
    }
    setIsContactOpen(!isContactOpen);
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
      {/* <FiltersPanel activeFilter={activeFilter} onFilterChange={handleFilterChange} /> */}
      <LegendPanel
        onLocationAdded={fetchLocations}
        isOpen={isLegendOpen}
        onToggle={handleToggleLegend}
      />
      <ContactPanel
        isOpen={isContactOpen}
        onToggle={handleToggleContact}
      />
      <PlaceCard location={selectedLocation} onClose={handleClosePlaceCard} />
    </>
  );
}
