"use client";

import { Plus, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface WeatherToolbarProps {
  title?: string;
}

export default function WeatherToolbar({
  title = "Weather",
}: WeatherToolbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    router.push("/add");
  };

  const handleMoreToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-5 pb-4 pt-4 relative">
      <h1 className="text-3xl font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-1 relative">
        {/* Add Button */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label="Add city"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/20"
        >
          <Plus size={22} strokeWidth={2.25} />
        </button>

        {/* More Button */}
        <button
          type="button"
          onClick={handleMoreToggle}
          aria-label="More options"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/20"
        >
          <MoreVertical size={22} strokeWidth={2.25} />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <>
            {/* click outside area */}
            <div
              className="fixed inset-0"
              onClick={() => setOpen(false)}
            />

            <div className="absolute right-0 top-12 w-40 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden">
              <button
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Settings
              </button>

              <button
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                About
              </button>

              <button
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Help
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
