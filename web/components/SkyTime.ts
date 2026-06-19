"use client";

import { useEffect, useState } from "react";

export type SkyPeriod = "day" | "night";

export interface SkyTime {
  period: SkyPeriod;
  /** 0 = fully day gradient, 1 = fully night gradient */
  nightBlend: number;
  hour: number;
}

const DAWN_START = 5; // sky starts lightening
const DAY_START = 6.5; // fully day
const DUSK_START = 19.5; // sky starts darkening
const NIGHT_START = 21; // fully night

function computeSkyTime(date: Date): SkyTime {
  const hour = date.getHours() + date.getMinutes() / 60;

  let nightBlend: number;

  if (hour >= DAWN_START && hour < DAY_START) {
    // dawn: night -> day
    nightBlend = 1 - (hour - DAWN_START) / (DAY_START - DAWN_START);
  } else if (hour >= DAY_START && hour < DUSK_START) {
    // full day
    nightBlend = 0;
  } else if (hour >= DUSK_START && hour < NIGHT_START) {
    // dusk: day -> night
    nightBlend = (hour - DUSK_START) / (NIGHT_START - DUSK_START);
  } else {
    // full night (wraps past midnight)
    nightBlend = 1;
  }

  return {
    period: nightBlend >= 0.5 ? "night" : "day",
    nightBlend,
    hour,
  };
}

export function useSkyTime(): SkyTime {
  const [skyTime, setSkyTime] = useState<SkyTime>(() =>
    computeSkyTime(new Date())
  );

  useEffect(() => {
    const tick = () => setSkyTime(computeSkyTime(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return skyTime;
}
