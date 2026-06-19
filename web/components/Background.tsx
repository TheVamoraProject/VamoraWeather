"use client";

import { useMemo } from "react";
import { useSkyTime } from "./SkyTime";

// Deterministic star field so it doesn't reshuffle on re-render
function useStars(count: number) {
  return useMemo(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: rand() * 70, // keep stars in upper 70% of sky
      left: rand() * 100,
      size: rand() < 0.85 ? 1 : 2,
      delay: rand() * 4,
    }));
  }, [count]);
}

export default function SkyBackground() {
  const { nightBlend } = useSkyTime();
  const stars = useStars(60);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Day sky */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: "linear-gradient(to bottom, #0066AE 0%, #84C5DD 100%)",
          opacity: 1 - nightBlend,
        }}
      />
      {/* Night sky */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: "linear-gradient(to bottom, #022B4B 0%, #2C434B 100%)",
          opacity: nightBlend,
        }}
      />

      {/* Stars — fade in as night approaches */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: Math.max(0, (nightBlend - 0.4) / 0.6) }}
      >
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              opacity: 0.6,
              animationDelay: `${star.delay}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      {/* Sun glow — fades out as night approaches */}
      <div
        className="absolute -top-24 right-[15%] h-72 w-72 rounded-full blur-3xl transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
          opacity: Math.max(0, 1 - nightBlend * 1.6),
        }}
      />

      {/* Moon glow — fades in as night approaches */}
      <div
        className="absolute -top-16 right-[20%] h-48 w-48 rounded-full blur-3xl transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(circle, rgba(230,238,255,0.35) 0%, rgba(230,238,255,0) 70%)",
          opacity: Math.max(0, (nightBlend - 0.3) / 0.7),
        }}
      />
    </div>
  );
}
