"use client";

import { useSkyTime } from "./SkyTime";
import SkyBackground from "./Background";

interface HourForecast {
  time: string;
  temp: number;
  icon: string;
}

interface ConditionStat {
  label: string;
  value: string;
}

const hourly: HourForecast[] = [
  { time: "Now", temp: 24, icon: "☀️" },
  { time: "15:00", temp: 25, icon: "☀️" },
  { time: "16:00", temp: 25, icon: "🌤️" },
  { time: "17:00", temp: 23, icon: "🌤️" },
  { time: "18:00", temp: 21, icon: "⛅" },
  { time: "19:00", temp: 19, icon: "🌙" },
  { time: "20:00", temp: 18, icon: "🌙" },
  { time: "21:00", temp: 17, icon: "🌙" },
];

const conditions: ConditionStat[] = [
  { label: "Feels like", value: "26°" },
  { label: "Humidity", value: "48%" },
  { label: "Wind", value: "12 km/h" },
  { label: "UV index", value: "5" },
];

export default function WeatherApp() {
  const { period } = useSkyTime();
  const isNight = period === "night";

  const textPrimary = "text-white";
  const textSecondary = isNight ? "text-zinc-300" : "text-white/80";

  return (
    <div className="relative min-h-screen w-full">
      <SkyBackground />

      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-28 pt-12">
        {/* Location */}
        <div className="text-center">
          <h1 className={`text-lg font-medium ${textPrimary}`}>Algiers</h1>
          <p className={`text-sm ${textSecondary}`}>Baraki</p>
        </div>

        {/* Current conditions hero */}
        <div className="mt-10 flex flex-col items-center">
          <span className={`mt-4 text-7xl font-bold ${textPrimary}`}>
            24°
          </span>
          <span className={`mt-1 text-base ${textSecondary}`}>
            {isNight ? "Clear night" : "Sunny"}
          </span>
          <span className={`mt-1 text-sm ${textSecondary}`}>
            H: 26° L: 17°
          </span>
        </div>

        {/* Hourly forecast */}
        <section className="mt-10 rounded-3xl bg-zinc-900/30 p-4 backdrop-blur-xl">
          <div className="flex gap-5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {hourly.map((h) => (
              <div
                key={h.time}
                className="flex flex-shrink-0 flex-col items-center gap-2"
              >
                <span className={`text-xs ${textSecondary}`}>{h.time}</span>
                <span className="text-xl">{h.icon}</span>
                <span className={`text-sm font-medium ${textPrimary}`}>
                  {h.temp}°
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Condition stat cards */}
        <section className="mt-4 grid grid-cols-2 gap-4">
          {conditions.map((c) => (
            <div
              key={c.label}
              className="rounded-3xl bg-zinc-900/30 p-4 backdrop-blur-xl"
            >
              <p className={`text-xs ${textSecondary}`}>{c.label}</p>
              <p className={`mt-2 text-2xl font-medium ${textPrimary}`}>
                {c.value}
              </p>
            </div>
          ))}
        </section>

        {/* Floating bottom search bar — Vamora pattern */}
        <div className="fixed bottom-6 left-1/2 w-full max-w-md -translate-x-1/2 px-5">
          <div className="flex items-center gap-3 rounded-full bg-zinc-900/40 px-5 py-3 backdrop-blur-xl">
            <span className="text-zinc-300">⌕</span>
            <input
              type="text"
              placeholder="Search city"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
