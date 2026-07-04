"use client";

import { useState } from "react";
import {
  Sun, CloudSun, Cloud, Moon, CloudRain,
  Wind, Droplets, Eye, Gauge, ChevronDown, type LucideIcon,
} from "lucide-react";
import Toolbar from "@/components/Toolbar";
import BottomNavbar from "@/components/BottomNavbar";
import SkyBackground from "@/components/Background";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HourForecast {
  time: string;
  temp: number;
  Icon: LucideIcon;
}

interface DayForecast {
  day: string;
  high: number;
  low: number;
  Icon: LucideIcon;
  label: string;
}

interface ConditionStat {
  label: string;
  value: string;
  Icon: LucideIcon;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const hourly: HourForecast[] = [
  { time: "Now",   temp: 17, Icon: Cloud    },
  { time: "14:00", temp: 17, Icon: CloudSun },
  { time: "15:00", temp: 18, Icon: Sun      },
  { time: "16:00", temp: 18, Icon: Sun      },
  { time: "17:00", temp: 17, Icon: CloudSun },
  { time: "18:00", temp: 15, Icon: Cloud    },
  { time: "19:00", temp: 14, Icon: CloudRain},
  { time: "20:00", temp: 13, Icon: Moon     },
  { time: "21:00", temp: 12, Icon: Moon     },
];

const forecast: DayForecast[] = [
  { day: "Today",     high: 18, low: 11, Icon: Cloud,     label: "Cloudy"        },
  { day: "Tue",       high: 19, low: 12, Icon: CloudSun,  label: "Partly cloudy" },
  { day: "Wed",       high: 16, low: 10, Icon: CloudRain, label: "Showers"       },
  { day: "Thu",       high: 14, low:  9, Icon: CloudRain, label: "Rain"          },
  { day: "Fri",       high: 17, low: 11, Icon: CloudSun,  label: "Partly cloudy" },
];

const conditions: ConditionStat[] = [
  { label: "Feels like", value: "15°",     Icon: Gauge    },
  { label: "Humidity",   value: "72%",     Icon: Droplets },
  { label: "Wind",       value: "18 km/h", Icon: Wind     },
  { label: "Visibility", value: "9 km",    Icon: Eye      },
];

// ─── Shared glass card style ───────────────────────────────────────────────────

const CARD_RADIUS = 22;

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: CARD_RADIUS,
  boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WeatherHome() {
  const [forecastExpanded, setForecastExpanded] = useState(false);
  const visibleDays = forecastExpanded ? forecast : forecast.slice(0, 3);

  return (
    <>
      <Toolbar title="" buttons={false} />
      <SkyBackground color="dark" />
      <BottomNavbar
        items={[
          { id: "home",     href: "/",         icon: "home",     label: "Home"     },
          { id: "settings", href: "/settings", icon: "settings", label: "Settings" },
        ]}
      />

      {/* ── Scrollable content ────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0,
        overflowY: "auto",
        paddingTop: 60,
        paddingBottom: 88,
        paddingLeft: 16,
        paddingRight: 16,
        boxSizing: "border-box",
      }}>
        <div style={{
          maxWidth: 480, margin: "0 auto",
          display: "flex", flexDirection: "column",
          gap: 14, paddingTop: 8, paddingBottom: 16,
        }}>

          {/* Hero */}
          <div style={{ textAlign: "center", padding: "18px 0 10px" }}>
            <h1 style={{
              margin: 0,
              color: "rgba(255,255,255,0.95)",
              fontSize: 22, fontWeight: 600, letterSpacing: 0.1,
            }}>
              London
            </h1>
            <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.48)", fontSize: 13.5 }}>
              United Kingdom
            </p>
            
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "center",
              marginTop: 12, lineHeight: 1,
            }}>
              <span style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: 96, fontWeight: 300, letterSpacing: -4,
                fontVariantNumeric: "tabular-nums",
              }}>
                17
              </span>
              <span style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 38, fontWeight: 300, marginTop: 14,
              }}>
                °
              </span>
            </div>

            <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
              Sunny
            </p>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
              H: 19° &nbsp;·&nbsp; L: 11°
            </p>
          </div>

          {/* Hourly forecast */}
          <div style={{ ...glass, padding: "16px 18px" }}>
            <p style={{
              margin: "0 0 14px",
              color: "rgba(255,255,255,0.35)",
              fontSize: 11, fontWeight: 600, letterSpacing: 0.9,
              textTransform: "uppercase",
            }}>
              Hourly
            </p>
            <div style={{
              display: "flex", gap: 22,
              overflowX: "auto", paddingBottom: 2,
              scrollbarWidth: "none",
            }}>
              {hourly.map((h) => (
                <div
                  key={h.time}
                  style={{
                    flexShrink: 0,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.42)", fontSize: 12 }}>{h.time}</span>
                  <h.Icon size={20} color="rgba(255,255,255,0.88)" strokeWidth={1.8} />
                  <span style={{
                    color: "rgba(255,255,255,0.92)", fontSize: 13.5, fontWeight: 500,
                    display: "flex", alignItems: "baseline", gap: 1,
                  }}>
                    {h.temp}<span style={{ fontSize: "0.72em" }}>°</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ Forecast card ════════════════════════════════════════════════ */}
          <div style={{ ...glass, overflow: "hidden" }}>
            <div style={{ padding: "16px 18px 4px" }}>
              <p style={{
                margin: "0 0 4px",
                color: "rgba(255,255,255,0.35)",
                fontSize: 11, fontWeight: 600, letterSpacing: 0.9,
                textTransform: "uppercase",
              }}>
                Forecast
              </p>
            </div>

            {/* Day rows */}
            <div>
              {visibleDays.map((d, i) => {
                const isLast = i === visibleDays.length - 1;
                return (
                  <div key={d.day} style={{ position: "relative" }}>
                    <div style={{
                      display: "flex", alignItems: "center",
                      padding: "13px 18px",
                      gap: 12,
                    }}>
                      {/* Day name */}
                      <span style={{
                        width: 48, flexShrink: 0,
                        color: "rgba(255,255,255,0.88)",
                        fontSize: 14.5, fontWeight: i === 0 ? 600 : 400,
                      }}>
                        {d.day}
                      </span>

                      {/* Icon + label */}
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1 }}>
                        <d.Icon size={17} color="rgba(255,255,255,0.6)" strokeWidth={1.8} />
                        <span style={{ color: "rgba(255,255,255,0.42)", fontSize: 13 }}>{d.label}</span>
                      </div>

                      {/* High / Low */}
                      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                        <span style={{ color: "rgba(255,255,255,0.88)", fontSize: 14.5, fontWeight: 500 }}>
                          {d.high}°
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.32)", fontSize: 14.5 }}>
                          {d.low}°
                        </span>
                      </div>
                    </div>

                    {/* Divider — not after last visible row */}
                    {!isLast && (
                      <div style={{
                        position: "absolute", bottom: 0,
                        left: 18, right: 0,
                        height: "0.5px",
                        background: "rgba(255,255,255,0.08)",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 5-day toggle button */}
            <button
              onClick={() => setForecastExpanded(v => !v)}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6,
                padding: "12px 18px",
                background: "transparent",
                border: "none",
                borderTop: "0.5px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                color: "rgba(255,255,255,0.42)",
                fontSize: 12.5, fontWeight: 500, letterSpacing: 0.2,
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}
            >
              {forecastExpanded ? "Show less" : "5-day forecast"}
              <ChevronDown
                size={14}
                strokeWidth={2}
                style={{
                  transition: "transform 0.25s ease",
                  transform: forecastExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
          </div>

          {/* ══ Condition stat cards ══════════════════════════════════════════ */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}>
            {conditions.map((c) => (
              <div key={c.label} style={{ ...glass, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                  <c.Icon size={14} color="rgba(255,255,255,0.38)" strokeWidth={1.8} />
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 11.5, fontWeight: 500, letterSpacing: 0.3 }}>
                    {c.label.toUpperCase()}
                  </p>
                </div>
                <p style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 26, fontWeight: 300, letterSpacing: -0.5,
                }}>
                  {c.value}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
