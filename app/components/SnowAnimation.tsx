'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: string;
  fontSize: string;
  animationDuration: string;
  animationDelay: string;
}

function useDeviceCapabilities() {
  const [snowflakeCount, setSnowflakeCount] = useState(80);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSnowflakeCount(0);
      return;
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const lowPowerDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

    if (lowPowerDevice || (isMobile && !isTablet)) {
      setSnowflakeCount(30);
    } else if (isTablet || isTouchDevice) {
      setSnowflakeCount(50);
    } else {
      setSnowflakeCount(80);
    }
  }, []);

  return snowflakeCount;
}

export default function SnowAnimation() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const count = useDeviceCapabilities();

  useEffect(() => {
    if (count === 0) {
      setSnowflakes([]);
      return;
    }

    const flakes: Snowflake[] = [];

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
  }, [count]);

  if (count === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100] overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
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
