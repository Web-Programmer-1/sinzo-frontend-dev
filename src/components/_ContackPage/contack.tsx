"use client";

import { useEffect, useRef, useState } from "react";

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, y = 24, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.75s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── SVG Icons ── */
const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.07 2.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="12 5 19 12 12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const channels = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@sinzo.bd",
    desc: "আমাদের latest collection, style inspiration ও নতুন arrivals দেখুন।",
    href: "https://instagram.com/sinzo.bd",
    Icon: IgIcon,
    gradient: "linear-gradient(135deg, #833AB4 0%, #C13584 45%, #E1306C 70%, #FD1D1D 100%)",
    shadowColor: "rgba(193,53,132,0.28)",
    cta: "Follow করুন",
    badge: "5.2K Followers",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "SINZO",
    desc: "আমাদের Facebook page এ like দিন। অফার, আপডেট সবার আগে পাবেন।",
    href: "https://facebook.com/SINZO",
    Icon: FbIcon,
    gradient: "linear-gradient(135deg, #1877F2 0%, #0D5FD6 100%)",
    shadowColor: "rgba(24,119,242,0.28)",
    cta: "Page Visit করুন",
    badge: "Always Open",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: "01576-450711",
    desc: "দ্রুত যোগাযোগের জন্য WhatsApp এ message করুন। আমরা সবসময় সাড়া দেই।",
    href: "https://wa.me/8801576450711",
    Icon: WaIcon,
    gradient: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
    shadowColor: "rgba(37,211,102,0.28)",
    cta: "Message করুন",
    badge: "Quick Reply",
  },
  {
    id: "phone",
    label: "Phone Call",
    handle: "01576-450711",
    desc: "সরাসরি কথা বলতে চাইলে call করুন। অর্ডার, ডেলিভারি বা যেকোনো প্রশ্নের জন্য।",
    href: "tel:+8801576450711",
    Icon: PhoneIcon,
    gradient: "linear-gradient(135deg, #8B6914 0%, #C9A84C 100%)",
    shadowColor: "rgba(139,105,20,0.28)",
    cta: "Call করুন",
    badge: "Always Open",
  },
];

const faqs = [
  { q: "অর্ডার কীভাবে করবো?", a: "আমাদের website বা Facebook/Instagram এ পণ্য দেখে WhatsApp বা call এ অর্ডার confirm করুন।" },
  { q: "ডেলিভারি কতদিনে পাবো?", a: "ঢাকার ভেতরে ২৪ ঘণ্টা, ঢাকার বাইরে সর্বোচ্চ ২ দিনের মধ্যে পৌঁছে দেওয়া হয়।" },
  { q: "পণ্য exchange করা যাবে?", a: "হ্যাঁ, ডেলিভারির ৪৮ ঘণ্টার মধ্যে unused অবস্থায় exchange করা যাবে।" },
  { q: "Payment কীভাবে করবো?", a: "Cash on delivery সুবিধা আছে। ডেলিভারি পাওয়ার সময় payment করতে পারবেন।" },
];

export default function SinzoContact() {
  const [loaded, setLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .sc {
          font-family: 'DM Sans', sans-serif;
          background: #F7F3ED;
          color: #1A1611;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* ── HERO ── */
        .sc-hero {
          min-height: 56svh;
          padding: clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem);
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; justify-content: flex-end;
          background:
            radial-gradient(ellipse 80% 60% at 100% 0%, rgba(139,105,20,0.13) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 0% 100%, rgba(201,168,76,0.09) 0%, transparent 50%),
            #F7F3ED;
        }
        .sc-hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(139,105,20,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,105,20,0.04) 1px, transparent 1px);
          background-size: 55px 55px;
        }
        .sc-hero-watermark {
          position: absolute; right: -1rem; bottom: -4rem;
          font-family: 'Playfair Display', serif;
          font-size: clamp(12rem,28vw,24rem); font-weight: 700;
          line-height: 1; letter-spacing: -0.05em;
          color: rgba(139,105,20,0.05); user-select: none; pointer-events: none;
        }
        .sc-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px; margin-bottom: 1.4rem;
        }
        .sc-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #8B6914; }
        .sc-eyebrow-text { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: #8B6914; font-weight: 500; }
        .sc-eyebrow-rule { width: 36px; height: 1px; background: rgba(139,105,20,0.3); }
        .sc-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem,8vw,6.5rem); font-weight: 700;
          line-height: 0.92; letter-spacing: -0.025em; color: #1A1611;
          max-width: 700px; margin-bottom: 1.6rem;
        }
        .sc-hero-title em { font-style: italic; color: #8B6914; }
        .sc-hero-sub {
          font-size: clamp(0.88rem,2vw,1rem); font-weight: 300;
          line-height: 1.8; color: #7A6E60; max-width: 500px;
        }
        .sc-hero-info {
          display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; margin-top: 2rem;
        }
        .sc-hero-info-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.78rem; color: #7A6E60; font-weight: 400;
        }
        .sc-hero-info-item svg { color: #8B6914; flex-shrink: 0; }

        /* ── CHANNELS ── */
        .sc-channels {
          padding: clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem);
          background:
            radial-gradient(ellipse 60% 50% at 100% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
            #F7F3ED;
        }
        .sc-channels-hdr { margin-bottom: clamp(2.5rem,5vw,4rem); }
        .sc-section-tag {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(139,105,20,0.08); border: 1px solid rgba(139,105,20,0.14);
          border-radius: 100px; padding: 0.32rem 0.85rem;
          font-size: 0.6rem; letter-spacing: 0.26em; text-transform: uppercase;
          color: #8B6914; font-weight: 500; margin-bottom: 1.2rem;
        }
        .sc-tag-dot { width: 5px; height: 5px; background: #8B6914; border-radius: 50%; }
        .sc-section-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem,4.5vw,3.2rem); font-weight: 500;
          line-height: 1.1; color: #1A1611; letter-spacing: -0.02em;
        }
        .sc-section-heading em { font-style: italic; color: #8B6914; }

        .sc-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.2rem;
          max-width: 1100px;
        }
        @media (max-width: 680px) { .sc-grid { grid-template-columns: 1fr; } }

        .sc-channel-card {
          background: #fff;
          border: 1px solid rgba(139,105,20,0.10);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(26,22,17,0.05);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
          text-decoration: none; color: inherit; display: block;
          cursor: pointer;
        }
        .sc-channel-card:hover { transform: translateY(-5px); }
        .sc-channel-top {
          padding: 1.6rem 1.8rem 1.3rem;
          display: flex; align-items: flex-start; gap: 1rem;
        }
        .sc-channel-icon {
          width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #fff; position: relative;
        }
        .sc-channel-icon-inner { position: relative; z-index: 1; }
        .sc-channel-badge {
          position: absolute; top: -6px; right: -6px;
          background: #fff; border: 1.5px solid rgba(139,105,20,0.15);
          border-radius: 100px; padding: 0.18rem 0.5rem;
          font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: #8B6914; font-weight: 500; white-space: nowrap;
          box-shadow: 0 2px 8px rgba(26,22,17,0.08);
        }
        .sc-channel-info { flex: 1; }
        .sc-channel-label { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #B0A090; margin-bottom: 2px; }
        .sc-channel-name { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 500; color: #1A1611; margin-bottom: 1px; }
        .sc-channel-handle { font-size: 0.8rem; color: #8B6914; font-weight: 400; }
        .sc-channel-body {
          padding: 0 1.8rem 1.4rem;
          border-top: 1px solid rgba(139,105,20,0.07);
          padding-top: 1rem;
        }
        .sc-channel-desc { font-size: 0.83rem; font-weight: 300; line-height: 1.7; color: #6B5F51; margin-bottom: 1.1rem; }
        .sc-channel-cta {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 0.75rem; font-weight: 500; letter-spacing: 0.05em;
          color: #fff; border: none; border-radius: 7px;
          padding: 0.6rem 1.2rem; cursor: pointer;
          transition: opacity 0.25s, transform 0.25s;
          text-decoration: none;
        }
        .sc-channel-cta:hover { opacity: 0.9; transform: translateX(2px); }

        /* ── STATS BAND ── */
        .sc-band {
          background: linear-gradient(135deg, #1A1611 0%, #2C2318 100%);
          padding: clamp(2.5rem,5vw,4rem) clamp(1.5rem,6vw,5rem);
          position: relative; overflow: hidden;
        }
        .sc-band::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .sc-band-inner {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 2rem; max-width: 1100px;
        }
        .sc-band-left { flex: 1; min-width: 260px; }
        .sc-band-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem,3.5vw,2.4rem); font-weight: 500;
          color: rgba(247,243,237,0.92); line-height: 1.2; margin-bottom: 0.5rem;
        }
        .sc-band-heading em { font-style: italic; color: #C9A84C; }
        .sc-band-sub { font-size: 0.83rem; font-weight: 300; color: rgba(247,243,237,0.45); }
        .sc-band-contacts { display: flex; gap: 1rem; flex-wrap: wrap; }
        .sc-band-contact {
          display: flex; align-items: center; gap: 8px;
          background: rgba(247,243,237,0.06); border: 1px solid rgba(247,243,237,0.09);
          border-radius: 8px; padding: 0.75rem 1.1rem;
          text-decoration: none; color: rgba(247,243,237,0.8);
          font-size: 0.8rem; font-weight: 400;
          transition: background 0.25s, border-color 0.25s;
        }
        .sc-band-contact:hover { background: rgba(201,168,76,0.12); border-color: rgba(201,168,76,0.25); }
        .sc-band-contact svg { color: #C9A84C; flex-shrink: 0; }

        /* ── FAQ ── */
        .sc-faq {
          padding: clamp(4rem,8vw,6.5rem) clamp(1.5rem,6vw,5rem);
          background:
            radial-gradient(ellipse 55% 45% at 0% 60%, rgba(139,105,20,0.05) 0%, transparent 55%),
            #EFE9DF;
        }
        .sc-faq-inner { max-width: 780px; }
        .sc-faq-list { display: flex; flex-direction: column; gap: 0.8rem; margin-top: 2.5rem; }
        .sc-faq-item {
          background: #fff; border: 1px solid rgba(139,105,20,0.11);
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 1px 8px rgba(26,22,17,0.04);
          transition: box-shadow 0.25s;
        }
        .sc-faq-item.open { box-shadow: 0 6px 28px rgba(26,22,17,0.09); }
        .sc-faq-q {
          width: 100%; background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 1.2rem 1.5rem; text-align: left;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
          color: #1A1611; transition: color 0.2s;
        }
        .sc-faq-q:hover { color: #8B6914; }
        .sc-faq-chevron {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          background: rgba(139,105,20,0.08); display: flex; align-items: center; justify-content: center;
          transition: background 0.25s, transform 0.3s;
          color: #8B6914;
        }
        .sc-faq-item.open .sc-faq-chevron { background: #8B6914; color: #fff; transform: rotate(45deg); }
        .sc-faq-a {
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s cubic-bezier(.22,1,.36,1), padding 0.3s;
          font-size: 0.85rem; font-weight: 300; line-height: 1.75; color: #6B5F51;
          padding: 0 1.5rem;
        }
        .sc-faq-item.open .sc-faq-a { max-height: 200px; padding: 0 1.5rem 1.3rem; }

        /* ── PROMISE STRIP ── */
        .sc-promise {
          padding: clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem);
          background: linear-gradient(135deg, #8B6914 0%, #A07820 40%, #C9A84C 100%);
          position: relative; overflow: hidden;
        }
        .sc-promise::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.04'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
        }
        .sc-promise-inner {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          gap: 2rem; flex-wrap: wrap; max-width: 1100px;
        }
        .sc-promise-left {}
        .sc-promise-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem,3.5vw,2.4rem); font-weight: 700;
          color: #fff; line-height: 1.15; margin-bottom: 0.5rem;
        }
        .sc-promise-sub { font-size: 0.85rem; font-weight: 300; color: rgba(255,255,255,0.7); }
        .sc-promise-items { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .sc-promise-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.8rem; color: rgba(255,255,255,0.9); font-weight: 400;
        }
        .sc-promise-check {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;
        }
      `}</style>

      <div className="sc">

        {/* ── HERO ── */}
        <section className="sc-hero">
          <div className="sc-hero-grid" />
          <div className="sc-hero-watermark">C</div>

          <div className="sc-hero-eyebrow lg:mt-8 mt-4"
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}>
            <div className="sc-eyebrow-dot" />
            <span className="sc-eyebrow-text">Contact Us</span>
            <div className="sc-eyebrow-rule" />
            <span className="sc-eyebrow-text">SINZO</span>
          </div>

          <h1 className="sc-hero-title"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(32px)",
              transition: "opacity 0.9s ease 0.45s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.45s",
            }}>
            আমাদের সাথে<br /><em>যোগাযোগ</em><br />করুন
          </h1>

          <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.75s" }}>
            <p className="sc-hero-sub">
              যেকোনো প্রশ্ন, অর্ডার বা সমস্যার জন্য আমরা সবসময় আছি। Instagram, Facebook, WhatsApp বা Phone — যেভাবে স্বাচ্ছন্দ্য সেভাবেই যোগাযোগ করুন।
            </p>
            <div className="sc-hero-info">
              <div className="sc-hero-info-item">
                <ClockIcon />
                Always Open
              </div>
              <div className="sc-hero-info-item">
                <MapIcon />
                Dhaka, Bangladesh 1211
              </div>
            </div>
          </div>
        </section>

        {/* ── CHANNELS ── */}
        <section className="sc-channels">
          <Reveal className="sc-channels-hdr">
            <div className="sc-section-tag">
              <div className="sc-tag-dot" />
              যোগাযোগের মাধ্যম
            </div>
            <h2 className="sc-section-heading">
              Choose your <em>preferred</em><br />channel
            </h2>
          </Reveal>

          <div className="sc-grid">
            {channels.map((ch, i) => (
              <Reveal key={ch.id} delay={i * 0.08}>
                <a href={ch.href} target="_blank" rel="noopener noreferrer" className="sc-channel-card"
                  style={{ ["--hover-shadow" as string]: `0 20px 60px ${ch.shadowColor}` }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 20px 60px ${ch.shadowColor}`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(26,22,17,0.05)")}>
                  <div className="sc-channel-top">
                    <div className="sc-channel-icon" style={{ background: ch.gradient, boxShadow: `0 8px 24px ${ch.shadowColor}` }}>
                      <div className="sc-channel-icon-inner"><ch.Icon /></div>
                      <div className="sc-channel-badge">{ch.badge}</div>
                    </div>
                    <div className="sc-channel-info">
                      <div className="sc-channel-label">{ch.label}</div>
                      <div className="sc-channel-name">{ch.handle}</div>
                    </div>
                  </div>
                  <div className="sc-channel-body">
                    <p className="sc-channel-desc">{ch.desc}</p>
                    <span className="sc-channel-cta" style={{ background: ch.gradient, boxShadow: `0 4px 16px ${ch.shadowColor}` }}>
                      {ch.cta} <ArrowIcon />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── DARK BAND ── */}
        <div className="sc-band">
          <div className="sc-band-inner">
            <div className="sc-band-left">
              <div className="sc-band-heading">
                সরাসরি <em>contact</em><br />করুন আমাদের
              </div>
              <p className="sc-band-sub">দ্রুত সাড়া পেতে WhatsApp বা call করুন</p>
            </div>
            <div className="sc-band-contacts">
              <a href="tel:+8801576450711" className="sc-band-contact">
                <PhoneIcon /> 01576-450711
              </a>
              <a href="mailto:sinzo.bd@gmail.com" className="sc-band-contact">
                <EmailIcon /> sinzo.bd@gmail.com
              </a>
              <a href="https://wa.me/8801576450711" target="_blank" rel="noopener noreferrer" className="sc-band-contact">
                <WaIcon /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <section className="sc-faq">
          <Reveal className="sc-faq-inner">
            <div className="sc-section-tag">
              <div className="sc-tag-dot" />
              সাধারণ প্রশ্ন
            </div>
            <h2 className="sc-section-heading">
              কিছু জানার<br />থাকলে <em>দেখুন</em>
            </h2>
            <div className="sc-faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`sc-faq-item${openFaq === i ? " open" : ""}`}>
                  <button className="sc-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {faq.q}
                    <div className="sc-faq-chevron">
                      <svg viewBox="0 0 24 24" fill="none" width="12" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </div>
                  </button>
                  <div className="sc-faq-a">{faq.a}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── PROMISE STRIP ── */}
        <section className="sc-promise">
          <div className="sc-promise-inner">
            <div className="sc-promise-left">
              <div className="sc-promise-title">আমাদের প্রতিশ্রুতি</div>
              <p className="sc-promise-sub">প্রতিটি customer আমাদের কাছে বিশেষ</p>
            </div>
            <div className="sc-promise-items">
              {["দ্রুত সাড়া", "সৎ সেবা", "সহজ Exchange", "নিরাপদ ডেলিভারি"].map(p => (
                <div key={p} className="sc-promise-item">
                  <div className="sc-promise-check"><CheckIcon /></div>
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}