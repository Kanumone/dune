'use client';

interface ContactPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ContactPanel({ isOpen, onToggle }: ContactPanelProps) {

  return (
    <>
      {/* Contact panel */}
      <div
        className={`
          fixed bottom-20 left-0 right-0 z-[900] p-4 md:p-6 frosted-glass
          transition-all duration-400 ease-out
          ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-winter-text">Связаться с разработчиками</h3>
          <button
            onClick={onToggle}
            className="text-winter-text hover:text-accent-warm transition-colors text-2xl leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl">💬</span>
          <div>
            <p className="text-sm font-medium text-winter-text m-0">Telegram</p>
            <a
              href="https://t.me/Yanetvoykot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-warm hover:underline"
            >
              Иван
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-xl">💬</span>
          <div>
            <p className="text-sm font-medium text-winter-text m-0">Telegram</p>
            <a
              href="https://t.me/kanumone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-warm hover:underline"
            >
              Андрей
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
