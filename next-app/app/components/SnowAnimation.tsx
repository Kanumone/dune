'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: string;
  fontSize: string;
  animationDuration: string;
  animationDelay: string;
}

export default function SnowAnimation() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 0.8 + 0.7; // 0.7 to 1.5
      const duration = Math.random() * 10 + 10; // 10 to 20 seconds
      const delay = Math.random() * 5;

      flakes.push({
        id: i,
        left: `${Math.random() * 100}%`,
        fontSize: `${size}em`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      });
    }

    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100] overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            fontSize: flake.fontSize,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}
