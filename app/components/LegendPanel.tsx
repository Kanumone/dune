'use client';

import { useState } from 'react';

export default function LegendPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed right-6 bottom-6 z-[900] w-12 h-12 flex items-center justify-center
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
          fixed right-6 bottom-20 z-[900] p-4 md:p-6 frosted-glass rounded-3xl min-w-[280px]
          transition-all duration-400 ease-out
          ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <h3 className="text-base font-semibold mb-4 text-winter-text">Как читать карту</h3>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-warm" />
            <span className="w-3 h-3 rounded-full bg-accent-warm" />
            <span className="w-4 h-4 rounded-full bg-accent-warm" />
          </div>
          <p className="text-sm text-text-secondary m-0">Размер снежок — популярность</p>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent-warm opacity-40" />
            <span className="w-3 h-3 rounded-full bg-accent-warm" />
          </div>
          <p className="text-sm text-text-secondary m-0">Яркость — активность сейчас</p>
        </div>

        <button
          onClick={() => alert('Функция добавления нового сугроба в разработке!')}
          className="
            flex items-center justify-center gap-2 w-full py-3 px-5 mt-4
            bg-snow-white/50 border border-glass-border rounded-full cursor-pointer
            transition-all duration-300 ease-out text-winter-text text-sm font-medium
            hover:bg-snow-white/80 hover:-translate-y-0.5 hover:shadow-md
          "
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Добавить сугроб</span>
        </button>
      </div>
    </>
  );
}
