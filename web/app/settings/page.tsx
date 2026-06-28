"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Wind, Thermometer, RefreshCw, Shield, MessageSquare, Info, ChevronRight, Download, Send } from "lucide-react";
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
  } catch { return fallback; }
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
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: CARD_RADIUS,
  boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
};

// ─── useIsMobile hook ─────────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [bannerDismissed, setBannerDismissed] = useState(true);
  const [platform, setPlatform] = useState<"android" | "linux" | "other">("other");
  const [windUnit, setWindUnitState] = useState<WindUnit>("km/h");
  const [tempUnit, setTempUnitState] = useState<TempUnit>("°C");
  const [refreshInterval, setRefreshIntervalState] = useState<RefreshInterval>("Every hour");
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    setBannerDismissed(getLS("vw_banner_dismissed", false));
    setWindUnitState(getLS<WindUnit>("vw_wind_unit", "km/h"));
    setTempUnitState(getLS<TempUnit>("vw_temp_unit", "°C"));
    setRefreshIntervalState(getLS<RefreshInterval>("vw_refresh_interval", "Every hour"));
    setPlatform(detectPlatform());
  }, []);

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

  return (
    <>
      <Toolbar title="Settings" buttons={false} />
      <SkyBackground color="dark" />
      <BottomNavbar
        items={[
          { id: "home",     href: "/",         icon: "home",     label: "Home"     },
          { id: "settings", href: "/settings", icon: "settings", label: "Settings" },
        ]}
      />

      {/* ── Scrollable content ───────────────────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0,
        overflowY: "auto",
        paddingTop: 72, paddingBottom: 88,
        paddingLeft: 16, paddingRight: 16,
        boxSizing: "border-box",
      }}>
        <div style={{
          maxWidth: 480, margin: "0 auto",
          display: "flex", flexDirection: "column",
          gap: 16, paddingTop: 8, paddingBottom: 16,
        }}>

          {/* ══ Download banner ══════════════════════════════════════════════ */}
          <div style={{
            overflow: "hidden",
            maxHeight: bannerDismissed ? 0 : 200,
            opacity: bannerDismissed ? 0 : 1,
            marginBottom: bannerDismissed ? -16 : 0,
            transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease, margin-bottom 0.38s ease",
            pointerEvents: bannerDismissed ? "none" : "auto",
          }}>
            <div style={{ ...glass, padding: 14, position: "relative", borderRadius: 22 }}>
              <button
                onClick={dismissBanner}
                aria-label="Dismiss"
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://vamora.vercel.app/res/apps/Weather.png"
                  alt="VamiWeather"
                  width={52}
                  height={52}
                  style={{ borderRadius: 18, flexShrink: 0, objectFit: "cover" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.95)", fontSize: 14.5, fontWeight: 600 }}>
                    Get the VamiWeather app
                  </p>
                  <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.5)", fontSize: 12.5, lineHeight: 1.45 }}>
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

          {/* ══ Group 1 — Preferences ══════════════════════════════════════ */}
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

          {/* ══ Group 2 — App info ══════════════════════════════════════════ */}
          <SettingsGroup>
            <SettingsRow
              position="top"
              icon={<Shield size={17} />}
              label="Privacy Policy"
              onClick={() => window.open("https://vamora.vercel.app/blog/privacy", "_blank")}
            />
            <SettingsRow
              position="middle"
              icon={<MessageSquare size={17} />}
              label="Feedback"
              onClick={() => setFeedbackOpen(true)}
            />
            <SettingsRow
              position="bottom"
              icon={<Info size={17} />}
              label="About VamiWeather"
              onClick={() => window.location.href = "/about"}
            />
          </SettingsGroup>

        </div>
      </div>

      {/* ══ Option modals ═══════════════════════════════════════════════════ */}
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

      {/* ══ Feedback modal ══════════════════════════════════════════════════ */}
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}

// ─── SettingsGroup ────────────────────────────────────────────────────────────

function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...glass, overflow: "hidden" }}>
      {children}
    </div>
  );
}

// ─── SettingsRow ──────────────────────────────────────────────────────────────

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
          background: hovered ? "rgba(255,255,255,0.05)" : "transparent",
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
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, fontWeight: 400, marginRight: 4 }}>
            {value}
          </span>
        )}
        <ChevronRight size={15} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
      </button>
      {hasDivider && (
        <div style={{
          position: "absolute", bottom: 0,
          left: icon ? 44 : 16, right: 0,
          height: "0.5px", background: "rgba(255,255,255,0.08)",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
}

// ─── Shared modal shell — responsive: bottom sheet on mobile, centered on desktop

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function ModalShell({ open, onClose, title, children }: ModalShellProps) {
  const isMobile = useIsMobile();

  // Shared backdrop
  const backdrop = (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.38)",
        zIndex: 900,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.22s ease",
      }}
    />
  );

  if (isMobile) {
    // ── Bottom sheet (mobile) ──────────────────────────────────────────────
    return (
      <>
        {backdrop}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 901,
          background: "rgba(18,18,22,0.58)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "none",
          borderRadius: "28px 28px 0 0",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)",
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
          boxShadow: "0 -16px 48px rgba(0,0,0,0.45)",
        }}>
          {/* Drag handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
          </div>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 20px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <span style={{ color: "rgba(255,255,255,0.95)", fontSize: 16, fontWeight: 600 }}>{title}</span>
            <button onClick={onClose} style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.38)", cursor: "pointer",
              display: "flex", padding: 4, transition: "color 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
          {children}
        </div>
      </>
    );
  }

  // ── Centered card (desktop) ────────────────────────────────────────────────
  return (
    <>
      {backdrop}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
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
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <span style={{ color: "rgba(255,255,255,0.95)", fontSize: 16, fontWeight: 600, letterSpacing: 0.1 }}>
            {title}
          </span>
          <button onClick={onClose} style={{
            background: "none", border: "none",
            color: "rgba(255,255,255,0.38)", cursor: "pointer",
            display: "flex", padding: 4, transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

// ─── OptionModal ──────────────────────────────────────────────────────────────

interface OptionModalProps {
  open: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}

function CheckIcon() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
      <path d="M1.5 5L5 8.5L11.5 1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OptionModal({ open, title, options, selected, onSelect, onClose }: OptionModalProps) {
  return (
    <ModalShell open={open} onClose={onClose} title={title}>
      <div style={{ padding: "4px 0 8px" }}>
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
                  background: "transparent", border: "none",
                  cursor: "pointer", textAlign: "left",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{
                  color: isSelected ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.78)",
                  fontSize: 15, fontWeight: isSelected ? 500 : 400,
                }}>
                  {opt}
                </span>
                {isSelected && <CheckIcon />}
              </button>
              {i < options.length - 1 && (
                <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "0 20px" }} />
              )}
            </div>
          );
        })}
      </div>
    </ModalShell>
  );
}

// ─── FeedbackModal ────────────────────────────────────────────────────────────

const FEEDBACK_EMAIL = "Aniserri.vamora@gmail.com";

type FeedbackStatus = "idle" | "sending" | "sent" | "error";

function FeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FeedbackStatus>("idle");
  const emailRef = useRef<HTMLInputElement>(null);

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => { setEmail(""); setMessage(""); setStatus("idle"); }, 300);
    } else {
      setTimeout(() => emailRef.current?.focus(), 350);
    }
  }, [open]);

  const handleSend = () => {
    if (!email.trim() || !message.trim()) return;
    setStatus("sending");
    // mailto: is the most reliable no-backend approach
    const subject = encodeURIComponent("VamiWeather Feedback");
    const body = encodeURIComponent(`From: ${email}\n\n${message}`);
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
    // Optimistically mark as sent after a short delay
    setTimeout(() => { setStatus("sent"); }, 600);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "11px 14px",
    color: "rgba(255,255,255,0.9)",
    fontSize: 14.5,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Send Feedback">
      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {status === "sent" ? (
          <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>✉️</div>
            <p style={{ color: "rgba(255,255,255,0.92)", fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>
              Thanks for your feedback!
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13.5, margin: "0 0 20px", lineHeight: 1.5 }}>
              Your mail app should have opened. If not, email us directly at {FEEDBACK_EMAIL}
            </p>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 12,
                padding: "10px 24px", color: "rgba(255,255,255,0.85)",
                fontSize: 14, fontWeight: 500, cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500, marginBottom: 6, letterSpacing: 0.3 }}>
                YOUR EMAIL
              </label>
              <input
                ref={emailRef}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500, marginBottom: 6, letterSpacing: 0.3 }}>
                FEEDBACK
              </label>
              <textarea
                placeholder="What's on your mind?"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "none",
                  lineHeight: 1.5,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!email.trim() || !message.trim() || status === "sending"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: email.trim() && message.trim()
                  ? "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)"
                  : "rgba(255,255,255,0.08)",
                border: "none", borderRadius: 12,
                padding: "12px",
                color: email.trim() && message.trim() ? "white" : "rgba(255,255,255,0.3)",
                fontSize: 14.5, fontWeight: 600,
                cursor: email.trim() && message.trim() ? "pointer" : "not-allowed",
                transition: "background 0.2s, color 0.2s, opacity 0.15s",
                boxShadow: email.trim() && message.trim() ? "0 2px 12px rgba(37,99,235,0.4)" : "none",
              }}
              onMouseEnter={e => { if (email.trim() && message.trim()) (e.currentTarget.style.opacity = "0.85"); }}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <Send size={15} />
              {status === "sending" ? "Opening mail…" : "Send Feedback"}
            </button>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.3)", fontSize: 11.5, textAlign: "center", lineHeight: 1.5 }}>
              Opens your mail app to send to {FEEDBACK_EMAIL}
            </p>
          </>
        )}
      </div>
    </ModalShell>
  );
}
