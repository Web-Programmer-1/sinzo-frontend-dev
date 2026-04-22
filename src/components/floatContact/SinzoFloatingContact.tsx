"use client";

import { useEffect, useRef, useState } from "react";

/* ── SVG Icons ── */
const SupportIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width="22"
    height="22"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="6"
      ry="6"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
    <path
      d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
    <path
      d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
    <path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.07 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const channels = [
  {
    id: "instagram",
    label: "Instagram",
    sublabel: "@sinzo.bd",
    href: "https://instagram.com/sinzo.bd",
    Icon: InstagramIcon,
    gradient: "linear-gradient(135deg, #833AB4 0%, #C13584 50%, #FD1D1D 100%)",
    shadow: "rgba(193,53,132,0.35)",
    bg: "rgba(193,53,132,0.08)",
    border: "rgba(193,53,132,0.2)",
  },
  {
    id: "facebook",
    label: "Facebook",
    sublabel: "SINZO Page",
    href: "https://www.facebook.com/profile.php?id=61575302684345",
    Icon: FacebookIcon,
    gradient: "linear-gradient(135deg, #1877F2 0%, #0D5FD6 100%)",
    shadow: "rgba(24,119,242,0.35)",
    bg: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.2)",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    sublabel: "01576-450711",
    href: "https://wa.me/8801576450711",
    Icon: WhatsappIcon,
    gradient: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
    shadow: "rgba(37,211,102,0.35)",
    bg: "rgba(37,211,102,0.08)",
    border: "rgba(37,211,102,0.2)",
  },
  {
    id: "phone",
    label: "Phone Call",
    sublabel: "01576-450711",
    href: "tel:+8801576450711",
    Icon: PhoneIcon,
    gradient: "linear-gradient(135deg, #8B6914 0%, #C9A84C 100%)",
    shadow: "rgba(139,105,20,0.35)",
    bg: "rgba(139,105,20,0.08)",
    border: "rgba(139,105,20,0.22)",
  },
];

export default function SinzoFloatingContact() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .sfb-overlay {
          position: fixed; inset: 0; z-index: 9998;
          background: rgba(15, 12, 8, 0);
          backdrop-filter: blur(0px);
          pointer-events: none;
          transition: background 0.4s ease, backdrop-filter 0.4s ease;
        }
        .sfb-overlay.open {
          background: rgba(15, 12, 8, 0.45);
          backdrop-filter: blur(4px);
          pointer-events: all;
        }

        /* ── Vertical side tab ── */
        .sfb-fab {
          position: fixed;
          top: 50%;
          right: 0;
          transform: translateY(-50%) translateX(0);
          z-index: 9999;
          border: none; cursor: pointer; outline: none;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-right: none;
          box-shadow: -4px 0 24px rgba(26,22,17,0.12), inset 1px 0 0 rgba(255,255,255,0.35);
          border-radius: 10px 0 0 10px;
          padding: 14px 9px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          color: #1A1611;
          transition: background 0.25s ease, box-shadow 0.25s ease, padding 0.25s ease;
          white-space: nowrap;
        }
        .sfb-fab:hover {
          background: rgba(255, 255, 255, 0.28);
          box-shadow: -6px 0 32px rgba(26,22,17,0.16), inset 1px 0 0 rgba(255,255,255,0.4);
          padding: 14px 11px;
        }
        .sfb-fab:active { opacity: 0.9; }

        .sfb-fab-icon-wrap {
          width: 20px; height: 20px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .sfb-fab-icon {
          position: absolute;
          transition: opacity 0.22s ease, transform 0.28s cubic-bezier(.22,1,.36,1);
          display: flex; align-items: center; justify-content: center;
        }
        .sfb-fab-icon.support { opacity: 1; transform: scale(1); }
        .sfb-fab-icon.close   { opacity: 0; transform: scale(0.4) rotate(-90deg); }
        .sfb-fab.open .sfb-fab-icon.support { opacity: 0; transform: scale(0.4) rotate(90deg); }
        .sfb-fab.open .sfb-fab-icon.close   { opacity: 1; transform: scale(1) rotate(0deg); }

        .sfb-fab-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #1A1611;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          line-height: 1;
          transition: opacity 0.22s ease;
        }
        .sfb-fab.open .sfb-fab-label { opacity: 0; }

        /* No pulse for side tab */
        .sfb-pulse, .sfb-pulse-2 { display: none; }

        /* ── Panel ── */
        .sfb-panel {
          position: fixed;
          top: 50%;
          right: 0;
          transform: translateY(-50%) translateX(100%);
          z-index: 9999;
          width: min(320px, calc(100vw - 24px));
          background: #FDFAF5;
          border: 1px solid rgba(139,105,20,0.14);
          border-radius: 16px 0 0 16px;
          box-shadow:
            -8px 0 40px rgba(26,22,17,0.18),
            0 0 0 1px rgba(255,255,255,0.7) inset;
          overflow: hidden;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s cubic-bezier(.22,1,.36,1), transform 0.38s cubic-bezier(.22,1,.36,1);
          font-family: 'DM Sans', sans-serif;
          max-height: 90svh;
          overflow-y: auto;
        }
        .sfb-panel.open {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
          pointer-events: all;
        }


        /* Panel header */
        .sfb-panel-head {
          padding: 1.1rem 1.3rem 0.9rem;
          background: linear-gradient(135deg, #1A1611 0%, #2C2318 100%);
          position: relative; overflow: hidden;
        }
        .sfb-panel-head::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .sfb-panel-head-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; }
        .sfb-panel-avatar {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #8B6914, #C9A84C);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.95rem;
          color: #fff; letter-spacing: 0.04em;
        }
        .sfb-panel-head-title {
          font-size: 0.9rem; font-weight: 600; color: #F7F3ED; letter-spacing: 0.02em;
        }
        .sfb-panel-head-sub {
          font-size: 0.68rem; color: rgba(247,243,237,0.45); margin-top: 1px;
          display: flex; align-items: center; gap: 5px;
        }
        .sfb-online-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #25D366;
          animation: sfbBlink 2s ease infinite;
        }
        @keyframes sfbBlink {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }

        /* Panel intro */
        .sfb-panel-intro {
          padding: 0.9rem 1.3rem 0.6rem;
          font-size: 0.8rem; font-weight: 300; line-height: 1.6; color: #6B5F51;
          border-bottom: 1px solid rgba(139,105,20,0.09);
        }

        /* Channel buttons */
        .sfb-channels { padding: 0.7rem 0.9rem; display: flex; flex-direction: column; gap: 0.5rem; }

        .sfb-ch {
          display: flex; align-items: center; gap: 0.9rem;
          padding: 0.75rem 0.9rem;
          border-radius: 12px;
          text-decoration: none; color: inherit;
          border: 1px solid transparent;
          transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
          cursor: pointer;
        }
        .sfb-ch:hover { transform: translateX(3px); }

        .sfb-ch-icon {
          width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #fff; transition: box-shadow 0.22s ease;
        }
        .sfb-ch-text { flex: 1; }
        .sfb-ch-label { font-size: 0.82rem; font-weight: 500; color: #1A1611; }
        .sfb-ch-sub { font-size: 0.68rem; color: #9A8E80; margin-top: 1px; }

        .sfb-ch-arrow {
          width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(139,105,20,0.08); color: #8B6914;
          transition: background 0.22s, color 0.22s, transform 0.22s;
        }
        .sfb-ch:hover .sfb-ch-arrow { background: #8B6914; color: #fff; transform: translateX(2px); }

        /* Footer */
        .sfb-panel-foot {
          padding: 0.6rem 1.3rem 0.85rem;
          border-top: 1px solid rgba(139,105,20,0.08);
          display: flex; align-items: center; justify-content: center; gap: 5px;
          font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(139,105,20,0.5);
        }
        .sfb-panel-foot-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(139,105,20,0.3); }

        /* Mobile adjustments */
 @media (max-width: 480px) {
  .sfb-fab {
    padding: 8px 6px;      /* 🔥 smaller */
    gap: 6px;
    border-radius: 8px 0 0 8px;
  }

  .sfb-fab-label {
    font-size: 0.55rem;    /* 🔥 text choto */
    letter-spacing: 0.06em;
  }

  .sfb-fab-icon-wrap {
    width: 16px;
    height: 16px;
  }

  .sfb-fab svg {
    width: 16px;           /* 🔥 icon choto */
    height: 16px;
  }
}
      `}</style>

      {/* ── Overlay (click to close) ── */}
      <div
        ref={overlayRef}
        className={`sfb-overlay${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── Contact Panel ── */}
      <div
        className={`sfb-panel${open ? " open" : ""}`}
        role="dialog"
        aria-label="Contact SINZO"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sfb-panel-head">
          <div className="sfb-panel-head-inner">
            <div className="sfb-panel-avatar">S</div>
            <div>
              <div className="sfb-panel-head-title">SINZO Support</div>
              <div className="sfb-panel-head-sub">
                <span className="sfb-online-dot" />
                We're always here for you
              </div>
            </div>
          </div>
        </div>

        {/* Intro */}
        <p className="sfb-panel-intro">
          Have a question or need help? Reach us through your preferred channel
          below 👇
        </p>

        {/* Channels */}
        <div className="sfb-channels">
          {channels.map((ch, i) => (
            <a
              key={ch.id}
              href={ch.href}
              target={ch.id !== "phone" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="sfb-ch"
              style={{
                transitionDelay: open ? `${i * 0.05 + 0.05}s` : "0s",
                opacity: open ? 1 : 0,
                transform: open ? "translateX(0)" : "translateX(12px)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = ch.bg;
                el.style.borderColor = ch.border;
                el.style.boxShadow = `0 4px 16px ${ch.shadow}`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "";
                el.style.borderColor = "transparent";
                el.style.boxShadow = "";
              }}
              onClick={() => setTimeout(() => setOpen(false), 300)}
            >
              <div
                className="sfb-ch-icon"
                style={{
                  background: ch.gradient,
                  boxShadow: `0 4px 14px ${ch.shadow}`,
                }}
              >
                <ch.Icon />
              </div>
              <div className="sfb-ch-text">
                <div className="sfb-ch-label">{ch.label}</div>
                <div className="sfb-ch-sub">{ch.sublabel}</div>
              </div>
              <div className="sfb-ch-arrow">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="12"
                  height="12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="sfb-panel-foot">
          <span>SINZO</span>
          <div className="sfb-panel-foot-dot" />
          <span>Refined Denim Culture</span>
          <div className="sfb-panel-foot-dot" />
          <span>BD</span>
        </div>
      </div>

      {/* ── Side Tab Button ── */}
      <button
        className={`sfb-fab${open ? " open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close contact menu" : "Open contact menu"}
        aria-expanded={open}
        aria-controls="sfb-panel"
      >
        <div className="sfb-fab-icon-wrap">
          <span className="sfb-fab-icon support" aria-hidden="true">
            <SupportIcon />
          </span>
          <span className="sfb-fab-icon close" aria-hidden="true">
            <CloseIcon />
          </span>
        </div>
        <span className="sfb-fab-label">Chat With Us</span>
      </button>
    </>
  );
}
