'use client';

interface AddSnowdriftButtonProps {
  onClick: () => void;
  isHidden?: boolean;
}

export default function AddSnowdriftButton({ onClick, isHidden = false }: AddSnowdriftButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed right-6 top-[45%] -translate-y-1/2 z-[900]
        px-8 py-5 rounded-xl bg-[#FFD236]
        hover:bg-[#FFC700] hover:scale-105 hover:shadow-xl
        shadow-lg transition-all duration-300 ease-out
        text-winter-text font-semibold text-lg
        cursor-pointer
        flex items-center justify-center gap-2
        max-md:right-4 max-md:px-5 max-md:py-3 max-md:text-sm max-md:top-[40%]
        max-md:flex-col max-md:gap-1 max-md:min-w-[100px]
        ${isHidden ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 pointer-events-auto scale-100'}
      `}
      aria-label="Добавить сугроб"
    >
      <span className="text-2xl max-md:text-xl max-md:leading-none">+</span>
      <span className="max-md:hidden">Добавить сугроб</span>
      <span className="md:hidden text-center leading-tight">
        <span className="block">Добавить</span>
        <span className="block">сугроб</span>
      </span>
    </button>
  );
}
