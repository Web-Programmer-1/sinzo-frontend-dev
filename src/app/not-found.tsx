"use client";
// comment
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingItems = [
    { emoji: "👗", delay: "0s", x: "10%", y: "15%" },
    { emoji: "👠", delay: "0.5s", x: "85%", y: "20%" },
    { emoji: "👜", delay: "1s", x: "5%", y: "70%" },
    { emoji: "🧣", delay: "1.5s", x: "90%", y: "65%" },
    { emoji: "💍", delay: "0.8s", x: "20%", y: "85%" },
    { emoji: "🧥", delay: "1.2s", x: "75%", y: "80%" },
    { emoji: "👒", delay: "0.3s", x: "50%", y: "5%" },
    { emoji: "✨", delay: "1.8s", x: "40%", y: "90%" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --cream: #F8F3EE;
          --sand: #E8DDD0;
          --mocha: #8B6F5E;
          --espresso: #3D2B1F;
          --blush: #C4956A;
          --gold: #C9A96E;
          --charcoal: #2C2C2C;
          --white: #FFFFFF;
          --shadow: rgba(61, 43, 31, 0.15);
        }

        .page-container {
          min-height: 100vh;
          width: 100%;
          background: var(--cream);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Montserrat', sans-serif;
        }

        /* Background texture */
        .page-container::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(196, 149, 106, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(139, 111, 94, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(201, 169, 110, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Grain overlay */
        .page-container::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        /* Floating fashion items */
        .floating-item {
          position: fixed;
          font-size: clamp(1.2rem, 2.5vw, 2rem);
          animation: float 6s ease-in-out infinite, fadeInItem 1s ease forwards;
          opacity: 0;
          pointer-events: none;
          filter: drop-shadow(0 4px 8px rgba(61,43,31,0.2));
          z-index: 0;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-18px) rotate(5deg); }
        }

        @keyframes fadeInItem {
          to { opacity: 0.6; }
        }

        /* Decorative lines */
        .deco-line {
          position: absolute;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          height: 1px;
          opacity: 0;
          animation: lineReveal 1.2s ease forwards;
        }

        @keyframes lineReveal {
          to { opacity: 0.6; }
        }

        /* Main card */
        .card {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: clamp(2rem, 6vw, 5rem) clamp(1.5rem, 8vw, 6rem);
          max-width: min(700px, 92vw);
          width: 100%;
          opacity: 0;
          transform: translateY(30px);
          animation: cardReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }

        @keyframes cardReveal {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Tag label */
        .tag-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--espresso);
          color: var(--cream);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 2px;
          margin-bottom: 2rem;
          opacity: 0;
          animation: tagReveal 0.6s ease 0.6s forwards;
        }

        .tag-dot {
          width: 5px;
          height: 5px;
          background: var(--gold);
          border-radius: 50%;
          animation: pulse 2s ease infinite;
        }

        @keyframes tagReveal {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }

        /* 404 number */
        .error-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(7rem, 22vw, 14rem);
          font-weight: 300;
          line-height: 0.85;
          color: transparent;
          -webkit-text-stroke: 1.5px var(--mocha);
          letter-spacing: -0.04em;
          position: relative;
          display: inline-block;
          margin-bottom: 0.5rem;
          opacity: 0;
          animation: numberReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
          transition: transform 0.1s ease;
        }

        .error-number::after {
          content: '404';
          position: absolute;
          inset: 0;
          color: var(--sand);
          -webkit-text-stroke: 0;
          z-index: -1;
          transform: translate(4px, 4px);
          filter: blur(1px);
          opacity: 0.5;
        }

        @keyframes numberReveal {
          from { opacity: 0; transform: scale(0.85); letter-spacing: 0.1em; }
          to { opacity: 1; transform: scale(1); letter-spacing: -0.04em; }
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem auto;
          width: min(300px, 80%);
          opacity: 0;
          animation: fadeUp 0.6s ease 0.9s forwards;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--mocha));
        }

        .divider-line:last-child {
          background: linear-gradient(90deg, var(--mocha), transparent);
        }

        .divider-icon {
          color: var(--gold);
          font-size: 1rem;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Heading */
        .heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 4vw, 2.4rem);
          font-weight: 400;
          font-style: italic;
          color: var(--espresso);
          margin-bottom: 1rem;
          line-height: 1.3;
          opacity: 0;
          animation: fadeUp 0.6s ease 1s forwards;
        }

        /* Description */
        .description {
          font-size: clamp(0.8rem, 1.8vw, 0.9rem);
          color: var(--mocha);
          font-weight: 300;
          letter-spacing: 0.05em;
          line-height: 1.8;
          max-width: 360px;
          margin: 0 auto 2.5rem;
          opacity: 0;
          animation: fadeUp 0.6s ease 1.1s forwards;
        }

        /* Hanger animation */
        .hanger-wrapper {
          position: relative;
          width: 120px;
          margin: 0 auto 2rem;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.7s forwards;
        }

        .hanger {
          width: 100%;
          height: auto;
          animation: swing 4s ease-in-out infinite;
          transform-origin: top center;
        }

        @keyframes swing {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }

        /* Buttons */
        .btn-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          opacity: 0;
          animation: fadeUp 0.6s ease 1.2s forwards;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--espresso);
          color: var(--cream);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: 2px solid var(--espresso);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-primary:hover::before {
          transform: translateX(0);
        }

        .btn-primary:hover {
          color: var(--espresso);
          border-color: var(--gold);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(201, 169, 110, 0.3);
        }

        .btn-primary span {
          position: relative;
          z-index: 1;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--espresso);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 14px 28px;
          border: 1.5px solid var(--sand);
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          border-color: var(--mocha);
          background: var(--sand);
          transform: translateY(-2px);
        }

        /* Quick links */
        .quick-links {
          margin-top: 3rem;
          opacity: 0;
          animation: fadeUp 0.6s ease 1.4s forwards;
        }

        .quick-links-title {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--mocha);
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .quick-links-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          justify-content: center;
          list-style: none;
        }

        .quick-links-list a {
          display: inline-block;
          font-size: 0.72rem;
          color: var(--espresso);
          text-decoration: none;
          padding: 5px 14px;
          border: 1px solid var(--sand);
          background: var(--white);
          letter-spacing: 0.08em;
          transition: all 0.25s ease;
          font-weight: 400;
        }

        .quick-links-list a:hover {
          background: var(--espresso);
          color: var(--cream);
          border-color: var(--espresso);
          transform: translateY(-1px);
        }

        /* Bottom strip */
        .bottom-strip {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--espresso);
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          overflow: hidden;
          z-index: 20;
        }

        .strip-text {
          display: flex;
          gap: 3rem;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }

        .strip-text span {
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cream);
          opacity: 0.7;
          font-weight: 300;
        }

        .strip-dot {
          color: var(--gold);
          opacity: 1 !important;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Responsive */
        @media (max-width: 480px) {
          .floating-item {
            font-size: 1rem;
          }
          .btn-group {
            flex-direction: column;
            align-items: center;
          }
          .btn-primary, .btn-secondary {
            width: 100%;
            justify-content: center;
            max-width: 280px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="page-container">
        {/* Floating fashion items */}
        {floatingItems.map((item, i) => (
          <div
            key={i}
            className="floating-item"
            style={{
              left: item.x,
              top: item.y,
              animationDelay: item.delay,
              animationDuration: `${5 + i * 0.5}s`,
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Decorative corner lines */}
        <div
          className="deco-line"
          style={{ top: "3%", left: "5%", width: "120px", animationDelay: "1.5s" }}
        />
        <div
          className="deco-line"
          style={{
            bottom: "10%",
            right: "5%",
            width: "120px",
            animationDelay: "1.8s",
          }}
        />

        {/* Main card */}
        <div className="card">
          {/* Tag */}
          <div className="tag-label">
            <div className="tag-dot" />
            Page Not Found
          </div>

          {/* Hanger SVG animation */}
          <div className="hanger-wrapper">
            <svg
              className="hanger"
              viewBox="0 0 120 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hook */}
              <path
                d="M60 8 C60 8 60 2 65 2 C70 2 70 8 65 8 C62 8 60 10 60 12"
                stroke="#3D2B1F"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Bar */}
              <line x1="10" y1="40" x2="110" y2="40" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
              {/* Left arm */}
              <path d="M60 12 L10 40" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
              {/* Right arm */}
              <path d="M60 12 L110 40" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
              {/* Dress hanging */}
              <path
                d="M35 40 Q30 55 28 70 Q40 80 60 80 Q80 80 92 70 Q90 55 85 40"
                stroke="#C9A96E"
                strokeWidth="1.5"
                fill="rgba(201,169,110,0.15)"
              />
              {/* Question mark on dress */}
              <text x="55" y="68" fontFamily="Cormorant Garamond, serif" fontSize="22" fill="#8B6F5E" fontWeight="300">?</text>
            </svg>
          </div>

          {/* 404 */}
          <div
            className="error-number"
            style={
              mounted
                ? {
                    transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
                  }
                : {}
            }
          >
            404
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-icon">✦</span>
            <div className="divider-line" />
          </div>

          {/* Heading */}
          <h1 className="heading">
            This look isn&apos;t in our collection
          </h1>

          {/* Description */}
          <p className="description">
            The page you&apos;re searching for has gone out of style — or perhaps it never existed.
            Let&apos;s get you back to the latest trends.
          </p>

          {/* Buttons */}
          <div className="btn-group">
            <Link href="/" className="btn-primary">
              <span>← Back to Shop</span>
            </Link>
    
          </div>


        </div>

        {/* Bottom marquee strip */}
        <div className="bottom-strip">
          <div className="strip-text">
            {[...Array(2)].map((_, i) =>
              ["Free Shipping Over ৳2000", "New Arrivals Every Week", "Premium Quality Fabric", "Easy Returns & Exchange", "Authentic Fashion"].map(
                (text, j) => (
                  <span key={`${i}-${j}`}>
                    {text} <span className="strip-dot">✦</span>
                  </span>
                )
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}