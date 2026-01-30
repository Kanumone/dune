'use client';

interface BottomBarProps {
  onOpenLegend: () => void;
  onOpenContact: () => void;
}

export default function BottomBar({ onOpenLegend, onOpenContact }: BottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[900] frosted-glass h-20 px-8 py-4 flex items-center justify-center gap-6 max-md:px-4 max-md:h-16 max-md:gap-3">
      <button
        onClick={onOpenLegend}
        className="px-6 py-3 rounded-xl bg-snow-white/30 hover:bg-snow-white/50 hover:scale-105 transition-all duration-300 text-winter-text font-medium text-base cursor-pointer max-md:px-4 max-md:py-2 max-md:text-sm"
        aria-label="Как пользоваться"
      >
        Как пользоваться?
      </button>
      <button
        onClick={onOpenContact}
        className="px-6 py-3 rounded-xl bg-snow-white/30 hover:bg-snow-white/50 hover:scale-105 transition-all duration-300 text-winter-text font-medium text-base cursor-pointer max-md:px-4 max-md:py-2 max-md:text-sm"
        aria-label="О проекте"
      >
        О проекте
      </button>
    </div>
  );
}
