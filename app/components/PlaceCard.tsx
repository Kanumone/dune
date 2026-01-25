'use client';

import { Location } from '@/app/lib/types';
import SnowdriftIllustration from './SnowdriftIllustration';

interface PlaceCardProps {
  location: Location | null;
  onClose: () => void;
}

export default function PlaceCard({ location, onClose }: PlaceCardProps) {
  if (!location) return null;

  const handleOpenMaps = async () => {
    // Increment clicks count
    try {
      await fetch(`/api/locations/${location.id}/clicks`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Failed to increment clicks:', error);
      // Continue opening maps even if tracking fails
    }

    const url = `https://yandex.ru/maps/?rtext=~${location.coords[0]},${location.coords[1]}&rtt=pd`;
    window.open(url, '_blank');
  };

  return (
    <div
      className={`
        fixed right-6 top-1/2 z-[900] w-[380px] max-h-[85vh] overflow-y-auto p-8
        place-card-glass rounded-3xl transition-all duration-500 ease-out custom-scrollbar
        ${location ? '-translate-y-1/2 translate-x-0 opacity-100' : '-translate-y-1/2 translate-x-[120%] opacity-0'}
        max-md:left-4 max-md:right-4 max-md:top-auto max-md:bottom-0 max-md:w-auto max-md:max-h-[70vh]
        max-md:rounded-t-3xl max-md:rounded-b-none
        ${location ? 'max-md:translate-y-0' : 'max-md:translate-y-full'}
      `}
    >
      <button
        onClick={onClose}
        className="
          absolute top-4 right-4 w-8 h-8 flex items-center justify-center
          bg-snow-white/60 border border-glass-border rounded-full cursor-pointer
          transition-all duration-200 ease-out p-0 text-winter-text
          hover:bg-snow-white/90 hover:rotate-90
        "
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h2 className="text-2xl font-bold leading-tight text-winter-text">{location.title}</h2>
          <p className="text-xs text-winter-text/50 mt-1">кликнуло {location.clicks} человек</p>
        </div>
        <div className="w-[100px] h-[120px] flex-shrink-0">
          <SnowdriftIllustration />
        </div>
      </div>

      <div className="text-4xl font-bold leading-none mb-3 text-accent-warm drop-shadow-sm">
        {!isNaN(Number(location.size.trim())) ? `${location.size} м²` : location.size}
      </div>

      <p className="text-[15px] leading-relaxed text-text-secondary mb-3">
        {location.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {location.badges.map((badge, index) => (
          <span
            key={index}
            className="inline-block py-1.5 px-3.5 bg-accent-warm/10 border border-accent-warm/30 rounded-full text-[13px] font-medium text-accent-warm"
          >
            {badge}
          </span>
        ))}
      </div>


      <button
        onClick={handleOpenMaps}
        className="
          flex items-center justify-center gap-2 w-full py-4 px-6
          bg-accent-dark text-white border-none rounded-full cursor-pointer
          transition-all duration-300 ease-out text-base font-semibold
          shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0
        "
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>Открыть в картах</span>
      </button>
    </div>
  );
}
