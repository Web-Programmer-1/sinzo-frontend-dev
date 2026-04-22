"use client";

import Link from "next/link";

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{CSS}</style>
      <footer className="ft-root">
        <div className="ft-inner">

          {/* ── Col 1 : Brand ── */}
          <div className="ft-brand">
            <Link href="/" className="ft-logo">SINZO</Link>
            <p className="ft-tagline">
              Premium fashion delivered to your door. Style that speaks before you do.
            </p>
            <div className="ft-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ft-social" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="ft-social" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://wa.me/8801576450711" target="_blank" rel="noopener noreferrer" className="ft-social" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* ── Policies & Quick Links Wrapper ── */}
          <div className="ft-links-wrapper">
            {/* ── Col 2 : Policies ── */}
            <div className="ft-col">
              <p className="ft-col-title">Policies</p>
              <nav className="ft-nav">
                <Link href="/about" className="ft-link">About Us</Link>
                <Link href="/privacy-policy" className="ft-link">Privacy Policy</Link>
                <Link href="/terms" className="ft-link">Terms &amp; Conditions</Link>
                <Link href="/return-policy" className="ft-link">Return &amp; Cancellation</Link>
              </nav>
            </div>

            {/* ── Col 3 : Quick Links ── */}
            <div className="ft-col">
              <p className="ft-col-title">Quick Links</p>
              <nav className="ft-nav">
                <Link href="/" className="ft-link">Home</Link>
                <Link href="/product" className="ft-link">All Products</Link>
                <Link href="/cart/my-cart" className="ft-link">My Cart</Link>
                <Link href="/userDashboard/order" className="ft-link">Track Order</Link>
              </nav>
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        <div className="ft-divider" />

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <p className="ft-copy">© {year} SINZO. All rights reserved.</p>
          <div className="ft-pay">
            <span className="ft-pay-label">We accept</span>
            <BkashBadge />
            <NagadBadge />
            <CodBadge />
          </div>
        </div>
      </footer>
    </>
  );
}

/* ─── SVG Icons ─────────────────────────────────────── */
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}

/* ── Payment badges ── */
function BkashBadge() {
  return (
    <span className="ft-pay-badge" style={{ background:"#e2136e", color:"#fff" }}>bKash</span>
  );
}
function NagadBadge() {
  return (
    <span className="ft-pay-badge" style={{ background:"#f4821f", color:"#fff" }}>Nagad</span>
  );
}
function CodBadge() {
  return (
    <span className="ft-pay-badge" style={{ background:"#1a7f4b", color:"#fff" }}>COD</span>
  );
}

/* ══════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

  .ft-root {
    background: #111;
    color: #d4d4d4;
    font-family: 'DM Sans', sans-serif;
    padding: 56px 20px 0;
  }

  /* inner grid */
  .ft-inner {
    max-width: 1300px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr 1.4fr;
    gap: 40px 32px;
  }
  
  /* Links wrapper for Policies + Quick Links */
  .ft-links-wrapper {
    display: contents;
  }
  
  @media (max-width: 900px) {
    .ft-inner {
      grid-template-columns: 1fr;
      gap: 32px 24px;
    }
    .ft-brand { 
      grid-column: 1; 
      text-align: center;
    }
    .ft-tagline {
      max-width: 100%;
      margin: 0 auto 20px;
    }
    .ft-socials {
      justify-content: center;
    }
    
    /* Policies and Quick Links side by side */
    .ft-links-wrapper {
      display: flex;
      flex-direction: row;
      gap: 20px;
      grid-column: 1;
    }
    
    .ft-links-wrapper .ft-col {
      flex: 1;
      min-width: 0;
    }
  }
  
  @media (max-width: 480px) {
    .ft-inner {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .ft-brand { 
      grid-column: 1; 
    }
    
    /* Keep them side by side on very small screens */
    .ft-links-wrapper {
      display: flex;
      flex-direction: row;
      gap: 15px;
    }
    
    .ft-links-wrapper .ft-col {
      flex: 1;
      min-width: 0;
    }
    
    .ft-col-title {
      font-size: 0.7rem;
      margin-bottom: 12px;
    }
    
    .ft-nav {
      gap: 8px;
    }
    
    .ft-link {
      font-size: 0.75rem;
    }
  }

  /* brand col */
  .ft-logo {
    display: inline-block;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.55rem;
    color: #fff;
    text-decoration: none;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
  }
  .ft-tagline {
    font-size: 0.83rem;
    color: #888;
    line-height: 1.6;
    margin: 0 0 20px;
    max-width: 260px;
  }
  .ft-socials {
    display: flex;
    gap: 10px;
  }
  .ft-social {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    border: 1px solid #2a2a2a;
    background: #1a1a1a;
    color: #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
  }
  .ft-social:hover {
    background: #fff;
    color: #111;
    border-color: #fff;
    transform: translateY(-2px);
  }

  /* columns */
  .ft-col-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fff;
    margin: 0 0 16px;
  }
  .ft-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ft-link {
    font-size: 0.85rem;
    color: #888;
    text-decoration: none;
    transition: color 0.18s, padding-left 0.18s;
    width: fit-content;
  }
  .ft-link:hover {
    color: #fff;
    padding-left: 4px;
  }

  /* divider */
  .ft-divider {
    max-width: 1300px;
    margin: 40px auto 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #2a2a2a 20%, #2a2a2a 80%, transparent);
  }

  /* bottom bar */
  .ft-bottom {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ft-copy {
    font-size: 0.78rem;
    color: #555;
    margin: 0;
  }
  .ft-pay {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-wrap: wrap;
  }
  .ft-pay-label {
    font-size: 0.72rem;
    color: #555;
    margin-right: 2px;
  }
  .ft-pay-badge {
    padding: 3px 9px;
    border-radius: 5px;
    font-size: 0.68rem;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    letter-spacing: 0.02em;
  }

  @media (max-width: 480px) {
    .ft-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
  }
`;