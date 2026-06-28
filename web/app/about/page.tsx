"use client";

import Toolbar from "@/components/Toolbar";
import BottomNavbar from "@/components/BottomNavbar";
import SkyBackground from "@/components/Background";

// ─── Asset URLs (hosted on vamora.vercel.app) ────────────────────────────────
const WEATHER_ICON   = "https://vamora.vercel.app/res/apps/Weather.png";
const VAMORA_LOGO    = "https://vamora.vercel.app/res/vamoratext.png";
const GITHUB_URL     = "https://github.com/TheVamoraProject/VamoraWeather";
const VAMORA_URL     = "https://vamora.vercel.app";
const MIT_TEXT = `MIT License

Copyright (c) 2024-2026 Vamora

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

// ─── Shared card style — matches Vamora dark UI feel ─────────────────────────
const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 22,
  boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
};

// ─── GitHub icon ──────────────────────────────────────────────────────────────
function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <Toolbar title="About" buttons={false} />
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
        paddingTop: 72, paddingBottom: 88,
        paddingLeft: 20, paddingRight: 20,
        boxSizing: "border-box",
      }}>
        <div style={{
          maxWidth: 480, margin: "0 auto",
          display: "flex", flexDirection: "column",
          gap: 16, paddingTop: 8, paddingBottom: 24,
        }}>

          {/* ══ Hero — icon + name + tagline ═══════════════════════════════ */}
          <div style={{
            ...card,
            padding: "32px 24px 28px",
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", gap: 16,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WEATHER_ICON}
              alt="VamiWeather icon"
              width={88}
              height={88}
              style={{ borderRadius: 24, objectFit: "cover" }}
            />
            <div>
              <h1 style={{
                margin: "0 0 6px",
                color: "rgba(255,255,255,0.95)",
                fontSize: 26, fontWeight: 700, letterSpacing: -0.3,
              }}>
                VamiWeather
              </h1>
              <p style={{
                margin: 0,
                color: "rgba(255,255,255,0.48)",
                fontSize: 14, lineHeight: 1.5,
              }}>
                Weather forecasts and conditions.
              </p>
            </div>

            {/* Version badge */}
            <div style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 999,
              padding: "5px 14px",
              color: "rgba(255,255,255,0.5)",
              fontSize: 12.5, fontWeight: 500, letterSpacing: 0.2,
            }}>
              Version 1.0.0 · June 2026
            </div>
          </div>

          {/* ══ About ══════════════════════════════════════════════════════ */}
          <div style={{ ...card, padding: "20px 20px" }}>
            <p style={{
              margin: "0 0 4px",
              color: "rgba(255,255,255,0.38)",
              fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase",
            }}>
              About this app
            </p>
            <p style={{
              margin: 0,
              color: "rgba(255,255,255,0.78)",
              fontSize: 14.5, lineHeight: 1.65,
            }}>
              VamiWeather gives you fast, accurate forecasts with a clean interface built to
              match the VamoraOS ecosystem. Check current conditions, hourly trends and the
              week ahead at a glance — on Android, Linux, or the web.
            </p>
          </div>

          {/* ══ GitHub ═════════════════════════════════════════════════════ */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...card,
              padding: "16px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              textDecoration: "none",
              transition: "background 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.88)" }}><GithubIcon /></span>
              <div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.92)", fontSize: 15, fontWeight: 500 }}>
                  View on GitHub
                </p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 12.5 }}>
                  TheVamoraProject / VamoraWeather
                </p>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* ══ Open source license ═══════════════════════════════════════ */}
          <div style={{ ...card, padding: "20px 20px" }}>
            <p style={{
              margin: "0 0 12px",
              color: "rgba(255,255,255,0.38)",
              fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase",
            }}>
              Open Source License
            </p>
            <div style={{
              background: "rgba(0,0,0,0.25)",
              borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <pre style={{
                margin: 0,
                color: "rgba(255,255,255,0.45)",
                fontSize: 11.5, lineHeight: 1.7,
                fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {MIT_TEXT}
              </pre>
            </div>
          </div>

          {/* ══ Made with ❤️ by Vamora ═══════════════════════════════════ */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "8px 0 4px",
          }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13.5 }}>
              Made with ❤️ by
            </span>
            <a
              href={VAMORA_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center",
                textDecoration: "none", opacity: 0.85,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={VAMORA_LOGO}
                alt="Vamora"
                height={18}
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
