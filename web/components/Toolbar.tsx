"use client";

import { Plus, MoreVertical } from "lucide-react";

interface WeatherToolbarProps {
  title?: string;
  onAddClick?: () => void;
  onMoreClick?: () => void;
}

export default function WeatherToolbar({
  title = "Weather",
  onAddClick,
  onMoreClick,
}: WeatherToolbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-5 pb-4 pt-4">
      <h1 className="text-3xl font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onAddClick}
          aria-label="Add city"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/20"
        >
          <Plus size={22} strokeWidth={2.25} />
        </button>

        <button
          type="button"
          onClick={onMoreClick}
          aria-label="More options"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/20"
        >
          <MoreVertical size={22} strokeWidth={2.25} />
        </button>
      </div>
    </header>
  );
}
