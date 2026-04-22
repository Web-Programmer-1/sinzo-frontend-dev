"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useGetAllBanners } from "../../Apis/banner";

const AUTO_PLAY_MS = 3000;
const TRANSITION_MS = 700;

export default function HeroBannerCarousel() {
  const { data, isLoading } = useGetAllBanners();

  const IMAGES = useMemo(() => {
    const banners = data?.data ?? [];

    return banners
      .sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder)
      .map((banner: { id: string; image: string; sortOrder: number }) => ({
        src: banner.image,
        alt: `Banner ${banner.sortOrder + 1}`,
        id: banner.id,
      }));
  }, [data]);

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [sliding, setSliding] = useState(false);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = IMAGES.length;

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev" = "next") => {
      if (sliding || total <= 1) return;

      const next = (idx + total) % total;
      if (next === current) return;

      setDirection(dir);
      setPrev(current);
      setSliding(true);
      setCurrent(next);

      setTimeout(() => {
        setPrev(null);
        setSliding(false);
      }, TRANSITION_MS);
    },
    [sliding, current, total]
  );

  const goNext = useCallback(() => {
    if (total > 1) goTo(current + 1, "next");
  }, [current, goTo, total]);

  const goPrev = useCallback(() => {
    if (total > 1) goTo(current - 1, "prev");
  }, [current, goTo, total]);

  useEffect(() => {
    setCurrent(0);
    setPrev(null);
    setSliding(false);
  }, [total]);

  // Auto-play
  useEffect(() => {
    if (paused || total <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(goNext, AUTO_PLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, goNext, total]);

  // Touch/swipe support
  const touchStartX = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev();
  };

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  if (isLoading) {
    return (
      <div className="w-full aspect-[16/6] rounded-xl bg-slate-100 animate-pulse" />
    );
  }

  if (!IMAGES.length) {
    return null;
  }

  return (
    <>
      <style>{CSS(TRANSITION_MS)}</style>

      <div
        className="hbc-root"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-label="Banner carousel"
        aria-roledescription="carousel"
      >
        <div className="hbc-track">
          {prev !== null && IMAGES[prev] && (
            <div
              key={`prev-${IMAGES[prev].id}`}
              className={`hbc-slide hbc-slide--exit hbc-slide--exit-${direction}`}
              aria-hidden="true"
            >
              <Image
                src={IMAGES[prev].src}
                alt={IMAGES[prev].alt}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                style={{ objectFit: "cover", objectPosition: "center" }}
                priority={false}
                draggable={false}
              />
            </div>
          )}

          <div
            key={`curr-${IMAGES[current].id}`}
            className={`hbc-slide hbc-slide--enter hbc-slide--enter-${direction} ${
              sliding ? "hbc-slide--entering" : "hbc-slide--entered"
            }`}
            aria-roledescription="slide"
            aria-label={`${current + 1} of ${total}: ${IMAGES[current].alt}`}
          >
            <Image
              src={IMAGES[current].src}
              alt={IMAGES[current].alt}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={current === 0}
              draggable={false}
            />
          </div>
        </div>

        {total > 1 && (
          <>
            <button
              className="hbc-arrow hbc-arrow--left"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              className="hbc-arrow hbc-arrow--right"
              onClick={goNext}
              aria-label="Next slide"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {total > 1 && (
          <div className="hbc-dots" role="tablist" aria-label="Slides">
            {IMAGES.map((img, i) => (
              <button
                key={img.id}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}: ${img.alt}`}
                className={`hbc-dot ${i === current ? "hbc-dot--active" : ""}`}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
              />
            ))}
          </div>
        )}

        {!paused && total > 1 && (
          <div className="hbc-progress-wrap">
            <div
              key={current}
              className="hbc-progress-bar"
              style={{ animationDuration: `${AUTO_PLAY_MS}ms` }}
            />
          </div>
        )}
      </div>
    </>
  );
}

const CSS = (ms: number) => `
  .hbc-root {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #111;
    aspect-ratio: 16 / 6;
    user-select: none;
    -webkit-user-select: none;
  }
  @media (max-width: 640px) {
    .hbc-root { aspect-ratio: 4 / 3; border-radius: 8px; }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .hbc-root { aspect-ratio: 16 / 7; }
  }

  .hbc-track {
    position: absolute;
    inset: 0;
  }

  .hbc-slide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .hbc-slide--enter-next  { transform: translateX(100%); }
  .hbc-slide--enter-prev  { transform: translateX(-100%); }
  .hbc-slide--entering    {
    transform: translateX(0);
    transition: transform ${ms}ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .hbc-slide--entered     { transform: translateX(0); }

  .hbc-slide--exit-next {
    transform: translateX(0);
    animation: hbc-exit-next ${ms}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  .hbc-slide--exit-prev {
    transform: translateX(0);
    animation: hbc-exit-prev ${ms}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes hbc-exit-next {
    from { transform: translateX(0); }
    to   { transform: translateX(-100%); }
  }
  @keyframes hbc-exit-prev {
    from { transform: translateX(0); }
    to   { transform: translateX(100%); }
  }

  .hbc-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 40px; height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    color: #fff;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.2s;
    opacity: 0;
  }
  .hbc-root:hover .hbc-arrow { opacity: 1; }
  .hbc-arrow:hover  { background: rgba(255,255,255,0.35); }
  .hbc-arrow:active { transform: translateY(-50%) scale(0.93); }
  .hbc-arrow--left  { left: 14px; }
  .hbc-arrow--right { right: 14px; }

  @media (max-width: 640px) {
    .hbc-arrow { width: 32px; height: 32px; opacity: 1; }
    .hbc-arrow--left  { left: 8px; }
    .hbc-arrow--right { right: 8px; }
    .hbc-arrow svg { width: 16px; height: 16px; }
  }

  .hbc-dots {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  @media (max-width: 640px) {
    .hbc-dots { bottom: 8px; gap: 5px; }
  }

  .hbc-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.7);
    background: transparent;
    cursor: pointer;
    padding: 0;
    transition: all 0.25s ease;
  }
  .hbc-dot--active {
    background: #fff;
    border-color: #fff;
    width: 22px;
    border-radius: 4px;
  }
  @media (max-width: 640px) {
    .hbc-dot { width: 6px; height: 6px; }
    .hbc-dot--active { width: 16px; }
  }

  .hbc-progress-wrap {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: rgba(255,255,255,0.15);
    z-index: 10;
  }
  .hbc-progress-bar {
    height: 100%;
    background: rgba(255,255,255,0.7);
    width: 0%;
    animation: hbc-progress linear forwards;
  }
  @keyframes hbc-progress {
    from { width: 0%; }
    to   { width: 100%; }
  }
`;