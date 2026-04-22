"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   SINZO Logo Component
   ─ Gold shimmer gradient animation
   ─ Glint sweep effect (::before via span)
   ─ Underline reveal stroke animation
   ─ Three variants: default | sm | dark
   ───────────────────────────────────────────── */

type SinzoLogoProps = {
  /** Visual size variant */
  size?: "sm" | "md" | "lg";
  /** Force dark background pill (useful on light navbars) */
  darkPill?: boolean;
  /** Whether to show the tagline below */
  tagline?: boolean;
  href?: string;
  className?: string;
};

export default function SinzoLogo({
  size = "md",
  darkPill = false,
  tagline = false,
  href = "/",
  className = "",
}: SinzoLogoProps) {
  const sizeMap: Record<string, string> = {
    sm: "text-[32px]",
    md: "text-[52px]",
    lg: "text-[72px]",
  };

  return (
    <>
      {/* ── Inject keyframes once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap');

        .sinzo-text {
          font-family: 'Cinzel', Georgia, serif;
          font-weight: 900;
          letter-spacing: 0.18em;
          background: linear-gradient(
            110deg,
            #c8a96e 0%,
            #f5d78e 20%,
            #a07840 35%,
            #e8c97a 50%,
            #6b4f2a 65%,
            #f0d488 80%,
            #c8a96e 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: sinzo-shimmer 3s linear infinite;
          position: relative;
          display: inline-block;
        }

        .sinzo-glint {
          font-family: 'Cinzel', Georgia, serif;
          font-weight: 900;
          letter-spacing: 0.18em;
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 0%,
            rgba(255,255,255,0.55) 48%,
            rgba(255,255,255,0.92) 50%,
            rgba(255,255,255,0.55) 52%,
            transparent 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: sinzo-glint 3s linear infinite;
          pointer-events: none;
          user-select: none;
        }

        .sinzo-underline {
          display: block;
          height: 1.5px;
          width: 0%;
          background: linear-gradient(
            90deg,
            transparent,
            #c8a96e,
            #f5d78e,
            #c8a96e,
            transparent
          );
          margin: 3px auto 0;
          animation: sinzo-line 1.2s cubic-bezier(.4,0,.2,1) 0.3s forwards;
        }

        .sinzo-tagline {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 0.45em;
          color: #a07840;
          text-transform: uppercase;
          text-align: center;
          margin-top: 4px;
          animation: sinzo-fadeup 1s ease 0.8s both;
          display: block;
        }

        @keyframes sinzo-shimmer {
          from { background-position: 200% center; }
          to   { background-position: -50% center; }
        }

        @keyframes sinzo-glint {
          from { background-position: 200% center; }
          to   { background-position: -100% center; }
        }

        @keyframes sinzo-line {
          from { width: 0%; opacity: 0; }
          to   { width: 100%; opacity: 1; }
        }

        @keyframes sinzo-fadeup {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sinzo-logo:hover .sinzo-text {
          animation-duration: 1.2s;
        }

        .sinzo-logo:hover .sinzo-underline {
          background: linear-gradient(
            90deg,
            transparent,
            #f5d78e,
            #fff,
            #f5d78e,
            transparent
          );
        }
      `}</style>

      <Link
        href={href}
        aria-label="SINZO Home"
        className={`sinzo-logo inline-block text-center no-underline select-none ${
          darkPill ? "bg-[#111] px-5 py-2 rounded-md" : ""
        } ${className}`}
      >
        {/* Text wrapper — positions glint overlay */}
        <span className={`sinzo-text ${sizeMap[size]}`}>
          SINZO
          {/* Glint sweep layer */}
          <span className={`sinzo-glint ${sizeMap[size]}`} aria-hidden="true">
            SINZO
          </span>
        </span>

        {/* Animated underline */}
        <span className="sinzo-underline" />

        {/* Optional tagline */}
        {tagline && (
          <span className="sinzo-tagline">Premium · Refined · Timeless</span>
        )}
      </Link>
    </>
  );
}