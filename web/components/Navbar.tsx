"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Data ────────────────────────────────────────────────────────────────────

const apps = [
  { name: "VamoraID", href: "#", icon: "/res/apps/ID.png" },
  { name: "Seek",     href: "#", icon: "/res/apps/Seek.png" },
  { name: "Connect",  href: "#", icon: "/res/apps/Connect.png" },
  { name: "VStore",   href: "#", icon: "/res/apps/Store.png" },
  { name: "Games",     href: "#", icon: "/res/apps/Playground.png" },
  { name: "Calculator",    href: "#", icon: "/res/apps/Calculator.png" },
  { name: "VMail",    href: "#", icon: "/res/apps/Mail.png" },
  { name: "AISlop",     href: "/aislop", icon: "/res/apps/Terminal.png" },
  { name: "Weather",    href: "#", icon: "/res/apps/Weather.png" },
  { name: "Camera",   href: "#", icon: "/res/apps/Camera.png" },
  { name: "Music",    href: "#", icon: "/res/apps/Music.png" },
  { name: "Vano",    href: "#", icon: "/res/apps/Vano.png" },
  { name: "Clock",    href: "#", icon: "/res/apps/Clock.png" },
  { name: "Calendar",    href: "#", icon: "/res/apps/Calendar.png" },
  { name: "Compass",    href: "#", icon: "/res/apps/Compass.png" },
  { name: "Settings",    href: "settings", icon: "/res/apps/Settings.png" },
];

const APPS_PER_PAGE = 9;

// ─── Shared glass style — one definition used everywhere ─────────────────────

const glassStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
} as React.CSSProperties;

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Single app icon with fallback image and label */
function AppIcon({ app, onClose }: { app: typeof apps[0]; onClose: () => void }) {
  const [imgSrc, setImgSrc] = useState(app.icon);

  return (
    <Link
      href={app.href}
      onClick={onClose}
      className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/20 active:scale-95 transition-all"
    >
      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/30 relative">
        <Image
          src={imgSrc}
          alt={app.name}
          fill
          sizes="56px"
          className="object-cover"
          onError={() => setImgSrc("/res/apps/NoIcon_App.png")}
        />
      </div>
      <span className="text-[11px] text-center text-white font-medium w-full truncate px-1 drop-shadow">
        {app.name}
      </span>
    </Link>
  );
}

/** Page indicator dots — active dot is wider */
function DotIndicator({
  total,
  current,
  onDot,
}: {
  total: number;
  current: number;
  onDot: (i: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDot(i)}
          aria-label={`Page ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-4 h-2 bg-white"
              : "w-2 h-2 bg-white/40 hover:bg-white/60"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BlogNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [page, setPage]             = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Refs for touch tracking — not state so they don't trigger re-renders
  const touchStartX = useRef<number | null>(null);
  const isDragging  = useRef(false);

  const totalPages = Math.ceil(apps.length / APPS_PER_PAGE);

  // ── Touch handlers ───────────────────────────────────────────────────────

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current  = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || touchStartX.current === null) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    // Resist dragging past the first or last page
    const atEdge = (page === 0 && diff > 0) || (page === totalPages - 1 && diff < 0);
    setDragOffset(atEdge ? diff * 0.2 : diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if      (diff > 40  && page < totalPages - 1) setPage(page + 1);
    else if (diff < -40 && page > 0)              setPage(page - 1);
    setDragOffset(0);
    touchStartX.current = null;
    isDragging.current  = false;
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  const openApps  = () => { setPage(0); setAppsOpen(true); };
  const closeApps = () => setAppsOpen(false);

  const renderAppPages = () =>
    Array.from({ length: totalPages }).map((_, pageIdx) => (
      <div
        key={pageIdx}
        className="grid grid-cols-3 gap-6 flex-shrink-0 px-4 place-items-center"
        style={{ minWidth: "100%" }}
      >
        {apps
          .slice(pageIdx * APPS_PER_PAGE, (pageIdx + 1) * APPS_PER_PAGE)
          .map((app) => (
            <AppIcon key={app.name} app={app} onClose={closeApps} />
          ))}
      </div>
    ));

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <nav className="glass fixed top-0 z-50 w-full flex items-center justify-between p-4 shadow-md">

      {/* ── Mobile hamburger + full-screen menu ── */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl p-2" aria-label="Menu">
          ☰
        </button>

        {menuOpen && (
          // Same glassStyle so it matches the apps overlay exactly
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
            style={glassStyle}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl p-2"
              aria-label="Close"
            >
              ✕
            </button>
            <Link href="/"         className="text-2xl text-white hover:opacity-80 transition font-semibold" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/#about"   className="text-2xl text-white hover:opacity-80 transition"               onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/projects" className="text-2xl text-white hover:opacity-80 transition"               onClick={() => setMenuOpen(false)}>Projects</Link>
            <Link href="/blog"     className="text-2xl text-white hover:opacity-80 transition"               onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link href="/#contact" className="text-2xl text-white hover:opacity-80 transition"               onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </div>

      {/* ── Logo (centered on mobile, left-aligned on desktop) ── */}
      <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
        <Image src="/res/vamora.png" alt="Vamora" width={28} height={28} className="hover:opacity-80 transition" />
      </Link>

      {/* ── Desktop nav links ── */}
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/#about"   className="hover:opacity-80 transition">About</Link>
        <Link href="/projects" className="hover:opacity-80 transition">Projects</Link>
        <Link href="/blog"     className="hover:opacity-80 transition">Blog</Link>
        <Link href="/#contact" className="hover:opacity-80 transition">Contact</Link>
      </div>

      {/* Apps button */}
      <div className="relative">
        <button onClick={openApps} className="p-2 rounded-lg hover:bg-black/10 transition" aria-label="Apps">
          <Image src="/res/uicons/apps.png" alt="Apps" width={20} height={20} />
        </button>

        {appsOpen && (
          <>
            {/* Mobile: full-screen overlay — glassStyle directly on the root div,
                touch handlers here so the whole screen is swipeable */}
            <div
              className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
              style={glassStyle}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <button
                onClick={closeApps}
                className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl p-2 z-10"
                aria-label="Close apps"
              >
                ✕
              </button>

              <p className="text-white/60 text-xs uppercase tracking-widest mb-10 font-medium">
                Vamora Apps
              </p>

              <div className="w-full overflow-hidden px-6">
                <div
                  className="flex"
                  style={{
                    transform: `translateX(calc(${-page * 100}% + ${dragOffset}px))`,
                    transition: dragOffset === 0 ? "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
                    willChange: "transform",
                  }}
                >
                  {renderAppPages()}
                </div>
              </div>

              <DotIndicator total={totalPages} current={page} onDot={setPage} />
            </div>

            {/* Desktop: click-outside backdrop + floating dropdown — same glassStyle */}
            <div className="hidden md:block fixed inset-0 z-40" onClick={closeApps} />
            <div
              className="hidden md:block absolute right-0 mt-3 z-50 w-[360px] rounded-2xl p-4 shadow-xl border border-white/20"
              style={glassStyle}
            >
              <p className="text-center text-[10px] font-semibold text-white/50 mb-4 tracking-widest uppercase">
                Vamora Apps
              </p>

              <div className="overflow-hidden rounded-xl">
                <div
                  className="flex"
                  style={{
                    transform: `translateX(${-page * 100}%)`,
                    transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                >
                  {renderAppPages()}
                </div>
              </div>

              <DotIndicator total={totalPages} current={page} onDot={setPage} />

              {totalPages > 1 && (
                <div className="flex justify-between mt-4 px-1">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="text-white/50 hover:text-white disabled:opacity-20 text-sm transition"
                  >
                    ‹ Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="text-white/50 hover:text-white disabled:opacity-20 text-sm transition"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
