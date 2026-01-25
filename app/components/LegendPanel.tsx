'use client';

import { useState } from 'react';
import AddLocationForm from './AddLocationForm';

interface LegendPanelProps {
  onLocationAdded?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function LegendPanel({ onLocationAdded, isOpen, onToggle }: LegendPanelProps) {
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
          fixed right-6 bottom-[152px] z-[900] w-12 h-12 flex items-center justify-center
          frosted-glass rounded-full cursor-pointer transition-all duration-300 ease-out
          text-winter-text text-2xl font-bold hover:scale-110 hover:shadow-lg
        "
        aria-label="Добавить сугроб"
      >
        +
      </button>

      {/* Help button */}
      <button
        onClick={onToggle}
        className="
          fixed right-6 bottom-[88px] z-[900] w-12 h-12 flex items-center justify-center
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
          fixed bottom-20 left-0 right-0 z-[900] p-4 md:p-6 frosted-glass
          transition-all duration-400 ease-out
          ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-winter-text">Как читать карту</h3>
          <button
            onClick={onToggle}
            className="text-winter-text hover:text-accent-warm transition-colors text-2xl leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">❄️</span>
            <span className="text-2xl">❄️</span>
            <span className="text-4xl">❄️</span>
          </div>
          <p className="text-sm text-text-secondary m-0">Размер снежок на карте — популярность</p>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <p className="text-2xl font-bold">+</p>
          <p className="text-sm text-text-secondary m-0">Нажми, чтобы добавить новый сугроб</p>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <p className="text-l text-accent-warm font-bold">10 м²</p>
          <p className="text-sm text-text-secondary m-0">Размер сугроба</p>
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
