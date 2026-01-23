'use client';

import { ReactNode } from 'react';
import { LocationCategory } from '@/app/lib/types';

interface FiltersPanelProps {
  activeFilter: LocationCategory | null;
  onFilterChange: (filter: LocationCategory | null) => void;
}

const filters: { id: LocationCategory; label: string; icon: ReactNode }[] = [
  {
    id: 'music',
    label: 'Где музыка',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
        <path d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm12-2c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
      </svg>
    ),
  },
  {
    id: 'weird',
    label: 'Где странно и весело',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    id: 'party',
    label: 'Где угар',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        <path d="M8 11l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'cozy',
    label: 'Где чай / глинтвейн',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
];

export default function FiltersPanel({ activeFilter, onFilterChange }: FiltersPanelProps) {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[900] flex flex-col gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(activeFilter === filter.id ? null : filter.id)}
          className={`
            flex items-center gap-3 py-3 px-4 md:py-3.5 md:px-5 frosted-glass rounded-full cursor-pointer
            transition-all duration-300 ease-out text-[15px] font-medium whitespace-nowrap
            hover:translate-x-1 hover:shadow-lg
            ${activeFilter === filter.id
              ? 'bg-accent-warm/15 border-accent-warm/40 text-accent-warm'
              : 'text-winter-text'
            }
          `}
        >
          {filter.icon}
          <span className="md:inline hidden">{filter.label}</span>
        </button>
      ))}
    </div>
  );
}
