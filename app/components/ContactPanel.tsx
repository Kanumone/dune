'use client';

import { useState } from 'react';

export default function ContactPanel() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      {/* Contact button */}
      <button
        onClick={() => setIsContactOpen(!isContactOpen)}
        className="
          fixed right-6 top-1/2 translate-y-[36px] z-[900] w-12 h-12 flex items-center justify-center
          frosted-glass rounded-full cursor-pointer transition-all duration-300 ease-out
          text-winter-text text-xl font-bold hover:scale-110 hover:shadow-lg
        "
        aria-label="Контакты разработчиков"
      >
        !
      </button>

      {/* Contact panel */}
      <div
        className={`
          fixed right-20 top-1/2 z-[900] p-4 md:p-6 frosted-glass rounded-3xl min-w-[280px]
          transition-all duration-400 ease-out
          ${isContactOpen ? 'opacity-100 translate-y-[36px] -translate-x-0 pointer-events-auto' : 'opacity-0 translate-y-[36px] translate-x-4 pointer-events-none'}
        `}
      >
        <h3 className="text-base font-semibold mb-4 text-winter-text">Связаться с разработчиками</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">📧</span>
            <div>
              <p className="text-sm font-medium text-winter-text m-0">Email</p>
              <a
                href="mailto:contact@example.com"
                className="text-sm text-accent-warm hover:underline"
              >
                contact@example.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">💬</span>
            <div>
              <p className="text-sm font-medium text-winter-text m-0">Telegram</p>
              <a
                href="https://t.me/your_contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-warm hover:underline"
              >
                @your_contact
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">🐙</span>
            <div>
              <p className="text-sm font-medium text-winter-text m-0">GitHub</p>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-warm hover:underline"
              >
                github.com/yourusername
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
