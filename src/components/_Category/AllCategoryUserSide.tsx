"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGetAllCategories } from "../../Apis/category/queries";

interface Category {
  id: string | number;
  title: string;
  thumbnailImage: string;
}

export default function AllCategoryList() {
  const { data, isLoading, isError } = useGetAllCategories();
  const categories: Category[] = data?.data ?? [];

  if (isLoading) return <SliderShell><LoadingCards /></SliderShell>;
  if (isError)   return <p style={{ color: "#e53e3e", padding: 12, fontSize: 14 }}>Failed to load categories.</p>;

  return <CategorySlider categories={categories} />;
}

/* ─────────────────────────────────────────────
   Core Slider
───────────────────────────────────────────── */
function CategorySlider({ categories }: { categories: Category[] }) {
  const total = categories.length;

  const [index, setIndex] = useState(0);
  const autoRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // drag state — refs so no re-render during move
  const dragging = useRef(false);
  const startX   = useRef(0);
  const [offset, setOffset] = useState(0);

  const CARD_W = 105;
  const GAP    = 8;

  // ── helpers ──────────────────────────────────
  const clamp = useCallback((i: number) => Math.max(0, Math.min(i, total - 1)), [total]);

  const goTo = useCallback((i: number) => {
    setIndex(clamp(i));
    setOffset(0);
  }, [clamp]);

  const next = useCallback(() => goTo(index + 1 < total ? index + 1 : 0), [goTo, index, total]);
  const prev = useCallback(() => goTo(index - 1 >= 0 ? index - 1 : total - 1), [goTo, index, total]);

  // ── auto-slide ────────────────────────────────
  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 2800);
  }, [next]);

  useEffect(() => {
    if (total < 2) return;
    startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [startAuto, total]);

  // ── Pointer events (mouse + touch unified) ──
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current   = e.clientX;
    setOffset(0);
    if (autoRef.current) clearInterval(autoRef.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setOffset(e.clientX - startX.current);
  };

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const THRESHOLD = 45;
    if      (offset < -THRESHOLD) next();
    else if (offset >  THRESHOLD) prev();
    else setOffset(0);
    startAuto();
  }, [offset, next, prev, startAuto]);

  const translateX = -(index * (CARD_W + GAP)) + offset;

  return (
    <SliderShell>
      {/* header */}
      <div style={S.header}>
        <h2 className="font-poppins" >Shop by Category</h2>
        <div style={S.controls}>
          <button style={S.btn} onClick={() => { prev(); startAuto(); }}>‹</button>
          <button style={S.btn} onClick={() => { next(); startAuto(); }}>›</button>
        </div>
      </div>

      {/* viewport */}
      <div style={S.viewport}>
        <div
          style={{
            ...S.track,
            transform: `translateX(${translateX}px)`,
            transition: dragging.current ? "none" : "transform 0.42s cubic-bezier(0.25,0.8,0.25,1)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {categories.map((cat) => (
            <Card key={cat.id} cat={cat} cardW={CARD_W} />
          ))}
        </div>
      </div>

      {/* dots */}
      <div style={S.dots}>
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); startAuto(); }}
            style={{
              ...S.dot,
              background: i === index ? "#111" : "#d4d4d4",
              transform:  i === index ? "scale(1.45)" : "scale(1)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </SliderShell>
  );
}

/* ─────────────────────────────────────────────
   Card
───────────────────────────────────────────── */
function Card({ cat, cardW }: { cat: Category; cardW: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...S.card,
        width: cardW,
        transform: hovered ? "translateY(-4px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 14px 32px rgba(0,0,0,0.22)"
          : "0 2px 10px rgba(0,0,0,0.10)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.imgWrap}>
        {cat.thumbnailImage ? (
          <img
            src={cat.thumbnailImage}
            alt={cat.title}
            draggable={false}
            style={{
              ...S.img,
              transform: hovered ? "scale(1.09)" : "scale(1)",
            }}
          />
        ) : (
          <div style={S.imgFallback} />
        )}
        <div style={S.overlayTop} />
        <div style={S.overlayBottom} />
        <div style={S.cardInfo}>
          <p style={S.cardLabel}>{cat.title}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Shell
───────────────────────────────────────────── */
function SliderShell({ children }: { children: React.ReactNode }) {
  return (
    <section style={S.section}>
      <style>{FONT_IMPORT}</style>
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────
   Loading skeletons
───────────────────────────────────────────── */
function LoadingCards() {
  return (
    <>
      <div style={S.header}>
        <div style={{ ...S.skeletonBase, width: 150, height: 20, borderRadius: 6 }} />
      </div>
      <div style={S.viewport}>
        <div style={{ ...S.track, transform: "translateX(0)" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ ...S.card, width: 105, flexShrink: 0 }}>
              <div style={{ ...S.skeletonBase, width: "100%", aspectRatio: "3/4", borderRadius: 14 }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500&display=swap');
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const S: Record<string, React.CSSProperties> = {
  section: {
 
    padding: "20px 16px",
    userSelect: "none",
    WebkitUserSelect: "none",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    margin: 0,
    color: "#111",
    letterSpacing: "-0.02em",
  },
  controls: { display: "flex", gap: 8 },
  btn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1.5px solid #e0e0e0",
    background: "#fff",
    color: "#222",
    fontSize: "1.2rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  viewport: {
    overflow: "hidden",
    cursor: "grab",
    touchAction: "pan-y", // ← lets vertical scroll work, captures horizontal drag
  },
  track: {
    display: "flex",
    gap: 12,
    willChange: "transform",
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    background: "#f0f0f0",
    flexShrink: 0,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  imgWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "1/1.15",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.5s ease",
    pointerEvents: "none",
  },
  imgFallback: { width: "100%", height: "100%", background: "#ddd" },
  overlayTop: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(160deg,rgba(0,0,0,0.18) 0%,rgba(0,0,0,0) 45%)",
    pointerEvents: "none",
  },
  overlayBottom: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    height: "55%",
    background: "linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.3) 55%,rgba(0,0,0,0) 100%)",
    pointerEvents: "none",
  },
  cardInfo: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    padding: "10px 10px",
  },
  cardLabel: {
    margin: 0,
    fontFamily: "'Syne', sans-serif",
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "#fff",
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dots: {
    display: "flex",
    gap: 6,
    justifyContent: "center",
    marginTop: 14,
  },
  dot: {
    width: 7, height: 7,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "background 0.25s, transform 0.25s",
  },
  skeletonBase: {
    background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  },
};
