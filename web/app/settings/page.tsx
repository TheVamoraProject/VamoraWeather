"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Wind, Thermometer, RefreshCw, Shield, MessageSquare, Info, ChevronRight, Download } from "lucide-react";
import Toolbar from "@/components/Toolbar";
import BottomNavbar from "@/components/BottomNavbar";
import SkyBackground from "@/components/Background";

// ─── Types ────────────────────────────────────────────────────────────────────

type WindUnit = "km/h" | "mph" | "m/s";
type TempUnit = "°C" | "°F";
type RefreshInterval = "Every 15 minutes" | "Every 30 minutes" | "Every hour" | "Manual";
type ActiveModal = "wind" | "temp" | "refresh" | null;

// ─── localStorage helpers ─────────────────────────────────────────────────────

function getLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v !== null ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setLS(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── Platform detection ───────────────────────────────────────────────────────

function detectPlatform(): "android" | "linux" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/linux/.test(ua)) return "linux";
  return "other";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_RADIUS = 22;

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: CARD_RADIUS,
  boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [bannerDismissed, setBannerDismissed] = useState(true); // true first to avoid SSR flash
  const [platform, setPlatform] = useState<"android" | "linux" | "other">("other");
  const [windUnit, setWindUnitState] = useState<WindUnit>("km/h");
  const [tempUnit, setTempUnitState] = useState<TempUnit>("°C");
  const [refreshInterval, setRefreshIntervalState] = useState<RefreshInterval>("Every hour");
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // ── Hydrate from localStorage after mount ─────────────────────────────────
  useEffect(() => {
    setBannerDismissed(getLS("vw_banner_dismissed", false));
    setWindUnitState(getLS<WindUnit>("vw_wind_unit", "km/h"));
    setTempUnitState(getLS<TempUnit>("vw_temp_unit", "°C"));
    setRefreshIntervalState(getLS<RefreshInterval>("vw_refresh_interval", "Every hour"));
    setPlatform(detectPlatform());
  }, []);

  // ── Setters that also persist ─────────────────────────────────────────────
  const setWindUnit = (v: string) => { setWindUnitState(v as WindUnit); setLS("vw_wind_unit", v); };
  const setTempUnit = (v: string) => { setTempUnitState(v as TempUnit); setLS("vw_temp_unit", v); };
  const setRefreshInterval = (v: string) => { setRefreshIntervalState(v as RefreshInterval); setLS("vw_refresh_interval", v); };

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
    setLS("vw_banner_dismissed", true);
  }, []);

  const downloadLabel =
    platform === "android" ? "Install for Android" :
    platform === "linux"   ? "Download for Linux"  :
                             "Download App";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Shared layout pieces (unchanged) ───────────────────────────── */}
      <Toolbar title="Settings" buttons={false} />
      <SkyBackground color="dark" />
      <BottomNavbar
        items={[
          { id: "home",     href: "/",         icon: "home",     label: "Home"     },
          { id: "settings", href: "/settings", icon: "settings", label: "Settings" },
        ]}
      />

      {/* ── Scrollable settings content ─────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "auto",
          paddingTop: 72,       // clear toolbar
          paddingBottom: 88,    // clear bottom nav
          paddingLeft: 16,
          paddingRight: 16,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingTop: 8,
            paddingBottom: 16,
          }}
        >

          {/* ══ Download / Install Banner ══════════════════════════════════ */}
          <div
            style={{
              overflow: "hidden",
              maxHeight: bannerDismissed ? 0 : 200,
              opacity: bannerDismissed ? 0 : 1,
              marginBottom: bannerDismissed ? -16 : 0,
              transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease, margin-bottom 0.38s ease",
              pointerEvents: bannerDismissed ? "none" : "auto",
            }}
          >
            <div style={{ ...glass, padding: 14, position: "relative", borderRadius: 22 }}>

              {/* Close ✕ */}
              <button
                onClick={dismissBanner}
                aria-label="Dismiss banner"
                style={{
                  position: "absolute", top: 10, right: 10,
                  background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
                  width: 26, height: 26, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.6)", transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              >
                <X size={12} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                {/* App icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 18, flexShrink: 0,
                  background: "linear-gradient(135deg, #1a3a6b 0%, #2563eb 50%, #60a5fa 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                }}>
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <circle cx="15" cy="11" r="5" fill="#FCD34D" />
                    <path d="M7 19c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <ellipse cx="10"  cy="20" rx="4"   ry="2.5" fill="white" opacity="0.85" />
                    <ellipse cx="15"  cy="21" rx="5.5" ry="3"   fill="white" />
                    <ellipse cx="20"  cy="20" rx="4"   ry="2.5" fill="white" opacity="0.85" />
                  </svg>
                </div>

                {/* Text + CTA */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.95)", fontSize: 14.5, fontWeight: 600 }}>
                    Get the VamiWeather app
                  </p>
                  <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.52)", fontSize: 12.5, lineHeight: 1.45 }}>
                    Install the Android or Linux app for a faster and more integrated experience.
                  </p>
                  <button
                    style={{
                      background: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
                      border: "none", borderRadius: 12,
                      padding: "7px 14px",
                      color: "white", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", letterSpacing: 0.2,
                      boxShadow: "0 2px 12px rgba(37,99,235,0.45)",
                      display: "flex", alignItems: "center", gap: 6,
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <Download size={13} />
                    {downloadLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ══ Settings group 1 — Preferences ════════════════════════════ */}
          <SettingsGroup>
            <SettingsRow
              position="top"
              icon={<Wind size={17} />}
              label="Wind speed units"
              value={windUnit}
              onClick={() => setActiveModal("wind")}
            />
            <SettingsRow
              position="middle"
              icon={<Thermometer size={17} />}
              label="Temperature"
              value={tempUnit}
              onClick={() => setActiveModal("temp")}
            />
            <SettingsRow
              position="bottom"
              icon={<RefreshCw size={17} />}
              label="Auto Refresh"
              value={refreshInterval}
              onClick={() => setActiveModal("refresh")}
            />
          </SettingsGroup>

          {/* ══ Settings group 2 — App info ═══════════════════════════════ */}
          <SettingsGroup>
            <SettingsRow
              position="top"
              icon={<Shield size={17} />}
              label="Privacy Policy"
              onClick={() => {/* navigate to privacy policy */}}
            />
            <SettingsRow
              position="middle"
              icon={<MessageSquare size={17} />}
              label="Feedback"
              onClick={() => {/* open feedback flow */}}
            />
            <SettingsRow
              position="bottom"
              icon={<Info size={17} />}
              label="About VamiWeather"
              onClick={() => {/* navigate to about */}}
            />
          </SettingsGroup>

        </div>
      </div>

      {/* ══ Option modals (bottom sheets) ══════════════════════════════════ */}
      <OptionModal
        open={activeModal === "wind"}
        title="Wind speed units"
        options={["km/h", "mph", "m/s"]}
        selected={windUnit}
        onSelect={setWindUnit}
        onClose={() => setActiveModal(null)}
      />
      <OptionModal
        open={activeModal === "temp"}
        title="Temperature"
        options={["°C", "°F"]}
        selected={tempUnit}
        onSelect={setTempUnit}
        onClose={() => setActiveModal(null)}
      />
      <OptionModal
        open={activeModal === "refresh"}
        title="Auto Refresh"
        options={["Every 15 minutes", "Every 30 minutes", "Every hour", "Manual"]}
        selected={refreshInterval}
        onSelect={setRefreshInterval}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}

// ─── SettingsGroup ────────────────────────────────────────────────────────────
// Wraps rows in a single frosted-glass card with overflow:hidden so the
// container clips the corner radius — individual rows never get their own
// border-radius on top/bottom independently.

function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...glass, overflow: "hidden" }}>
      {children}
    </div>
  );
}

// ─── SettingsRow ──────────────────────────────────────────────────────────────
// position drives which corners are rounded for the hover highlight, and
// whether a divider line is drawn at the bottom.

type RowPosition = "top" | "middle" | "bottom" | "only";

function rowRadius(pos: RowPosition): string {
  const r = CARD_RADIUS;
  if (pos === "top")    return `${r}px ${r}px 0 0`;
  if (pos === "bottom") return `0 0 ${r}px ${r}px`;
  if (pos === "only")   return `${r}px`;
  return "0";
}

interface SettingsRowProps {
  position: RowPosition;
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

function SettingsRow({ position, icon, label, value, onClick }: SettingsRowProps) {
  const [hovered, setHovered] = useState(false);
  const hasDivider = position === "top" || position === "middle";

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px",
          background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
          border: "none",
          borderRadius: rowRadius(position),
          cursor: onClick ? "pointer" : "default",
          transition: "background 0.15s ease",
          textAlign: "left",
        }}
      >
        {icon && (
          <span style={{ color: "rgba(255,255,255,0.92)", flexShrink: 0, display: "flex" }}>
            {icon}
          </span>
        )}
        <span style={{ flex: 1, color: "rgba(255,255,255,0.92)", fontSize: 15.5, fontWeight: 450 }}>
          {label}
        </span>
        {value && (
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, fontWeight: 400, marginRight: 4 }}>
            {value}
          </span>
        )}
        <ChevronRight size={15} color="rgba(255,255,255,0.28)" style={{ flexShrink: 0 }} />
      </button>

      {/* Divider — inset from left to align under text, not icon */}
      {hasDivider && (
        <div style={{
          position: "absolute", bottom: 0,
          left: icon ? 44 : 16, right: 0,
          height: "0.5px",
          background: "rgba(255,255,255,0.09)",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
}

// ─── OptionModal — Vamora UI style ───────────────────────────────────────────
// Matches the "Choose platform" dialog: solid dark card, centered float,
// icon+label left / muted action right, hairline dividers between rows.

interface OptionModalProps {
  open: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}

// Small checkmark icon used as the "Selected" indicator on the right
function CheckIcon() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
      <path d="M1.5 5L5 8.5L11.5 1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OptionModal({ open, title, options, selected, onSelect, onClose }: OptionModalProps) {
  return (
    <>
      {/* Backdrop — subtle dark dim, no blur to keep Vamora's clean feel */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 900,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Card — centered floating dialog, solid dark, large radius */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: open
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.94)",
          zIndex: 901,
          width: "min(360px, calc(100vw - 48px))",
          background: "#1c1c1e",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
          overflow: "hidden",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px 16px",
        }}>
          <span style={{
            color: "rgba(255,255,255,0.95)",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 0.1,
          }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer", padding: 4, lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Divider under header */}
        <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", margin: "0 0" }} />

        {/* Option rows */}
        <div>
          {options.map((opt, i) => {
            const isSelected = opt === selected;
            return (
              <div key={opt} style={{ position: "relative" }}>
                <button
                  onClick={() => { onSelect(opt); onClose(); }}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "15px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.12s ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Label */}
                  <span style={{
                    color: isSelected ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.82)",
                    fontSize: 15,
                    fontWeight: isSelected ? 500 : 400,
                  }}>
                    {opt}
                  </span>

                  {/* Right side: checkmark if selected, nothing otherwise */}
                  {isSelected && <CheckIcon />}
                </button>

                {/* Hairline divider between rows, not after last */}
                {i < options.length - 1 && (
                  <div style={{
                    height: "0.5px",
                    background: "rgba(255,255,255,0.07)",
                    margin: "0 20px",
                    pointerEvents: "none",
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom padding for breathing room */}
        <div style={{ height: 8 }} />
      </div>
    </>
  );
}
