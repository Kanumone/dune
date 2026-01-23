'use client';

import { useState } from 'react';
import AddLocationForm from './AddLocationForm';

interface LegendPanelProps {
  onLocationAdded?: () => void;
}

export default function LegendPanel({ onLocationAdded }: LegendPanelProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleLocationAdded = () => {
    if (onLocationAdded) {
      onLocationAdded();
    }
  };

  return (
    <>
      {/* Add button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="
          fixed right-6 top-1/2 -translate-y-[84px] z-[900] w-12 h-12 flex items-center justify-center
          frosted-glass rounded-full cursor-pointer transition-all duration-300 ease-out
          text-winter-text text-2xl font-bold hover:scale-110 hover:shadow-lg
        "
        aria-label="Добавить сугроб"
      >
        +
      </button>

      {/* Help button */}
      <button
        onClick={() => setIsLegendOpen(!isLegendOpen)}
        className="
          fixed right-6 top-1/2 -translate-y-1/2 z-[900] w-12 h-12 flex items-center justify-center
          frosted-glass rounded-full cursor-pointer transition-all duration-300 ease-out
          text-winter-text text-xl font-bold hover:scale-110 hover:shadow-lg
        "
        aria-label="Как читать карту"
      >
        ?
      </button>

      {/* Legend panel */}
      <div
        className={`
          fixed right-20 top-1/2 z-[900] p-4 md:p-6 frosted-glass rounded-3xl min-w-[280px]
          transition-all duration-400 ease-out
          ${isLegendOpen ? 'opacity-100 -translate-y-1/2 -translate-x-0 pointer-events-auto' : 'opacity-0 -translate-y-1/2 translate-x-4 pointer-events-none'}
        `}
      >
        <h3 className="text-base font-semibold mb-4 text-winter-text">Как читать карту</h3>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">❄️</span>
            <span className="text-2xl">❄️</span>
            <span className="text-4xl">❄️</span>
          </div>
          <p className="text-sm text-text-secondary m-0">Размер снежок — популярность</p>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <p className="text-2xl font-bold">+</p>
          <p className="text-sm text-text-secondary m-0">Нажми, чтобы добавить новый сугроб</p>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <p className="text-l text-accent-warm font-bold">10 м²</p>
          <p className="text-sm text-text-secondary m-0">Популярность сугроба</p>
        </div>
      </div>

      {/* Add location form modal */}
      <AddLocationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleLocationAdded}
      />
    </>
  );
}
