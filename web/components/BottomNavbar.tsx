"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Settings,
  Search,
  User,
  Bell,
  Heart,
  Mail,
  Calendar,
  Folder,
  Image as ImageIcon,
  Music,
  FileText,
} from "lucide-react";

// Central icon registry — keeps icon *components* out of server-rendered
// props entirely. Pages only ever pass a string key like "home".
const ICONS: Record<string, LucideIcon> = {
  home: Home,
  settings: Settings,
  search: Search,
  user: User,
  bell: Bell,
  heart: Heart,
  mail: Mail,
  calendar: Calendar,
  folder: Folder,
  image: ImageIcon,
  music: Music,
  file: FileText,
};

export interface NavbarItem {
  /** Unique id, also used as the React key */
  id: string;
  /** Route to navigate to on click */
  href: string;
  /** Key into the ICONS map above (e.g. "home", "settings") */
  icon: keyof typeof ICONS;
  /** Shown only as a hover tooltip — navbar itself has no labels */
  label: string;
}

interface BottomNavbarProps {
  items: NavbarItem[];
}

/**
 * Vamora bottom navbar.
 * - 2 to 4 icons, no labels (tooltip on hover)
 * - Frosted glass pill, sticky to the bottom
 * - Sliding indicator animates to the target tab before the route changes,
 *   so the motion reads as "the indicator takes you there"
 */
export default function BottomNavbar({ items }: BottomNavbarProps) {
  if (items.length < 2 || items.length > 4) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("BottomNavbar expects between 2 and 4 items.");
    }
  }

  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.href === pathname)
  );

  // The index the indicator is currently sitting on/animating to.
  // Lets us move the indicator first, then navigate, so the motion
  // visually "arrives" at the destination instead of just reacting to it.
  const [indicatorIndex, setIndicatorIndex] = useState(activeIndex);
  const navTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIndicatorIndex(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      if (navTimeout.current) clearTimeout(navTimeout.current);
    };
  }, []);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    width: number;
    left: number;
  }>({ width: 0, left: 0 });

  useEffect(() => {
    const node = itemRefs.current[indicatorIndex];
    if (node) {
      setIndicatorStyle({ width: node.offsetWidth, left: node.offsetLeft });
    }
  }, [indicatorIndex, items.length]);

  const handleClick = (index: number, href: string) => {
    if (index === activeIndex) return;

    // Move the indicator immediately…
    setIndicatorIndex(index);

    // …then navigate once the slide has had time to read as motion.
    if (navTimeout.current) clearTimeout(navTimeout.current);
    navTimeout.current = setTimeout(() => {
      router.push(href);
    }, 220);
  };

  return (
    <nav
      className="
        fixed bottom-5 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-1 p-1.5
        rounded-full
        bg-white/40 dark:bg-zinc-900/40
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-lg shadow-black/5 dark:shadow-black/30
      "
      aria-label="Primary"
    >
      {/* Sliding active indicator */}
      <span
        aria-hidden
        className="
          absolute top-1.5 bottom-1.5
          rounded-full
          bg-white/70 dark:bg-white/15
          shadow-sm
          transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        "
        style={{ width: indicatorStyle.width, left: indicatorStyle.left }}
      />

      {items.map((item, index) => {
        const Icon = ICONS[item.icon];
        const isActive = index === activeIndex;

        if (!Icon) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`BottomNavbar: unknown icon key "${item.icon}"`);
          }
          return null;
        }

        return (
          <button
            key={item.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
            onClick={() => handleClick(index, item.href)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            title={item.label}
            className="
              group relative z-10
              flex items-center justify-center
              h-11 w-11
              rounded-full
              transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500
            "
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.25 : 1.75}
              className={`
                transition-all duration-200
                group-hover:scale-105
                ${
                  isActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-100"
                }
              `}
            />

            {/* Tooltip — only way the page name is ever shown */}
            <span
              role="tooltip"
              className="
                pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
                whitespace-nowrap rounded-full px-2.5 py-1
                text-xs font-medium
                bg-zinc-900/90 text-white dark:bg-white/90 dark:text-zinc-900
                opacity-0 scale-95
                transition-all duration-150
                group-hover:opacity-100 group-hover:scale-100
              "
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
