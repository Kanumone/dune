'use client';

import { Location } from '@/app/lib/types';
import SnowdriftIllustration from './SnowdriftIllustration';

interface PlaceCardProps {
  location: Location | null;
  onClose: () => void;
}

export default function PlaceCard({ location, onClose }: PlaceCardProps) {
  if (!location) return null;

  const handleOpenMaps = () => {
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

      <div className="flex justify-between items-start mb-6 gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold leading-tight mb-1 text-winter-text">{location.title}</h2>
          <p className="text-sm text-text-secondary m-0">{location.district}</p>
        </div>
        <div className="w-[120px] h-[120px] flex-shrink-0">
          <SnowdriftIllustration />
        </div>
      </div>

      <div className="text-5xl font-bold leading-none mb-6 text-accent-warm drop-shadow-sm">
        {location.size}
      </div>

      <p className="text-[15px] leading-relaxed text-text-secondary mb-6">
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

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] flex-shrink-0 text-text-muted">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{location.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] flex-shrink-0 text-text-muted">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{location.peak}</span>
        </div>
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
