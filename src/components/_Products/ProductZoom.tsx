


"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  activeIndex: number;
  onImageChange: (index: number) => void;
  productName: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  galleryRef?: React.RefObject<HTMLDivElement>;
}

const SWIPE_THRESHOLD = 40;
const SWIPE_MAX_TIME = 400;

export default function ProductImageGallery({
  images,
  activeIndex,
  onImageChange,
  productName,
  onMouseDown,
  onMouseLeave: onExternalMouseLeave,
  onMouseUp,
  onMouseMove: onExternalMouseMove,
  onTouchStart: onExternalTouchStart,
  onTouchMove: onExternalTouchMove,
  onTouchEnd: onExternalTouchEnd,
  galleryRef,
}: ProductImageGalleryProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [mobileZoomImage, setMobileZoomImage] = useState<string | null>(null);
  const [imgVisible, setImgVisible] = useState(true);

  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const mouseStartX = useRef(0);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll active thumbnail into view
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const thumb = strip.children[activeIndex] as HTMLElement | undefined;
    if (!thumb) return;
    thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  // Crossfade on image change
  const changeImage = useCallback(
    (idx: number) => {
      setImgVisible(false);
      setTimeout(() => {
        onImageChange((idx + images.length) % images.length);
        setImgVisible(true);
      }, 130);
    },
    [images.length, onImageChange],
  );

  /* ── Desktop zoom ── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    onExternalMouseMove?.(e);
    const ref = galleryRef?.current || imageWrapperRef.current;
    if (!ref || !isDesktop || !isZoomed) return;
    const rect = ref.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPosition({ x: e.clientX - rect.left - 50, y: e.clientY - rect.top - 50 });
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => { if (isDesktop) setIsZoomed(true); };
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isDesktop) setIsZoomed(false);
    onExternalMouseLeave?.(e);
  };

  /* ── Mobile tap-to-zoom ── */
  const handleImageClick = () => {
    if (!isDesktop) setMobileZoomImage(images[activeIndex]);
  };

  /* ── Swipe on main preview ── */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    onExternalTouchStart?.(e);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const elapsed = Date.now() - touchStartTime.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD && elapsed < SWIPE_MAX_TIME) {
      changeImage(activeIndex + (diff > 0 ? 1 : -1));
    }
    onExternalTouchEnd?.(e);
  };

  /* ── Mouse drag on main preview ── */
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    onMouseDown?.(e);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      changeImage(activeIndex + (diff > 0 ? 1 : -1));
    }
    onMouseUp?.(e);
  };

  const showThumbs = images.length > 1;

  return (
    <>
      <style>{`
        .pgal-root {
          display: flex;
          flex-direction: column;
          background: #f0efed;
          width: 100%;
        }

        /* ── Main preview ── */
        .pgal-preview {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #f5f4f1;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          order: 1;
        }
        .pgal-preview:active { cursor: grabbing; }
        .pgal-preview.desktop-zoom { cursor: crosshair; }
        .pgal-preview.desktop-zoom-active { cursor: none; }

        .pgal-main-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 18px;
          pointer-events: none;
         
          -webkit-user-drag: none;
          transition: opacity 0.13s ease;
        }
        .pgal-main-img.fade-out { opacity: 0; }
        .pgal-main-img.clickable { cursor: zoom-in; }

        /* dots */
        .pgal-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: none;
          gap: 5px;
          z-index: 5;
        }
        .pgal-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          padding: 0;
          background: rgba(0,0,0,0.22);
          transition: background 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .pgal-dot.on {
          background: #111;
          transform: scale(1.35);
        }

        /* zoom lens (desktop) */
        .pgal-lens {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 1.5px solid rgba(0,0,0,0.35);
          background: rgba(255,255,255,0.2);
          pointer-events: none;
          z-index: 20;
          border-radius: 4px;
        }
        .pgal-zoom-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 15;
          overflow: hidden;
        }
        .pgal-zoom-overlay img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 18px;
        }

        /* ── Thumbnail strip ── */
        .pgal-strip-wrap {
          position: relative;
          background: #f5f4f1;
          flex-shrink: 0;
          order: 2;
        }
        .pgal-strip-wrap::after {
          display: none;
        }
        .pgal-strip {
          display: flex;
          gap: 2px;
          padding: 0 8px 2px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .pgal-strip::-webkit-scrollbar { display: none; }

        .pgal-thumb {
          flex: 0 0 calc((100% - 4px) / 3);
          min-width: calc((100% - 4px) / 3);
          aspect-ratio: 1 / 1;
          border-radius: 10px;
          border: 2px solid #e0ddd8;
          background: #f0efed;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          cursor: pointer;
          transition: border-color 0.18s, transform 0.14s, background 0.18s;
          padding: 0;
        }
        .pgal-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 6px;
          pointer-events: none;
        }
        .pgal-thumb.on {
          border-color: #111;
          background: #fff;
        }
        .pgal-thumb:active { transform: scale(0.96); }

        /* ── Mobile zoom modal ── */
        .pgal-modal-bd {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.94);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .pgal-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          border: none;
          color: #fff;
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }
        .pgal-modal-img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
        }
        .pgal-modal-hint {
          position: absolute;
          bottom: 28px;
          color: rgba(255,255,255,0.55);
          font-size: 13px;
        }

        /* ── Desktop layout ── */
        @media (min-width: 640px) {
          .pgal-root {
            flex-direction: row;
            width: 50%;
            flex-shrink: 0;
            min-height: 460px;
          }
          .pgal-strip-wrap {
            width: 82px;
            flex-shrink: 0;
            order: 1 !important;
          }
          .pgal-strip-wrap::after { display: none; }
          .pgal-strip {
            flex-direction: column;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 10px 8px;
            gap: 8px;
            max-height: 520px;
            scroll-snap-type: none;
          }
          .pgal-thumb {
            flex: 0 0 64px;
            min-width: unset;
            height: 64px;
            width: 64px;
            border-radius: 8px;
            border-color: transparent;
            background: #fff;
            aspect-ratio: unset;
          }
          .pgal-thumb.on {
            border-color: #111;
          }
          .pgal-preview {
            flex: 1;
            order: 2 !important;
            aspect-ratio: unset;
            min-height: 460px;
          }
        }

        @media (min-width: 900px) {
          .pgal-root { width: 52%; min-height: 540px; }
          .pgal-strip-wrap { width: 90px; }
          .pgal-strip { padding: 14px 10px; gap: 10px; max-height: 600px; }
          .pgal-thumb { flex: 0 0 68px; min-width: unset; height: 68px; width: 68px; border-radius: 10px; border-color: transparent; background: #fff; aspect-ratio: unset; }
          .pgal-thumb.on { border-color: #111; }
          .pgal-preview { min-height: 540px; }
        }

        @media (max-width: 1023px) {
          .pgal-lens,
          .pgal-zoom-overlay { display: none !important; }
        }
      `}</style>

      <div className="pgal-root">
        {/* Thumbnail strip */}
        {showThumbs && (
          <div className="pgal-strip-wrap">
            <div className="pgal-strip" ref={thumbStripRef}>
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pgal-thumb${i === activeIndex ? " on" : ""}`}
                  onClick={() => changeImage(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${productName} ${i + 1}`}
                    width={68}
                    height={68}
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main preview */}
        <div
          ref={galleryRef || imageWrapperRef}
          className={`pgal-preview${isDesktop ? " desktop-zoom" : ""}${isDesktop && isZoomed ? " desktop-zoom-active" : ""}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={onExternalTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleImageClick}
        >
          <Image
            src={images[activeIndex]}
            alt={productName}
            fill
            className={`pgal-main-img${!imgVisible ? " fade-out" : ""}${!isDesktop ? " clickable" : ""}`}
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 42vw"
            priority
            unoptimized
          />

          {/* Desktop zoom lens */}
          {isDesktop && isZoomed && (
            <>
              <div
                className="pgal-lens"
                style={{ left: lensPosition.x, top: lensPosition.y }}
              />
              <div className="pgal-zoom-overlay">
                <Image
                  src={images[activeIndex]}
                  alt={`${productName} zoomed`}
                  fill
                  style={{
                    transform: `scale(2.5)`,
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    objectFit: "contain",
                  }}
                  unoptimized
                />
              </div>
            </>
          )}

          {/* Dots (mobile only — hidden on desktop via CSS on strip) */}
          {showThumbs && (
            <div className="pgal-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pgal-dot${i === activeIndex ? " on" : ""}`}
                  onClick={(e) => { e.stopPropagation(); changeImage(i); }}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile full-screen zoom */}
      {mobileZoomImage && (
        <div className="pgal-modal-bd" onClick={() => setMobileZoomImage(null)}>
          <button
            className="pgal-modal-close"
            onClick={() => setMobileZoomImage(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <Image
            src={mobileZoomImage}
            alt={`${productName} zoomed`}
            width={700}
            height={900}
            className="pgal-modal-img"
            unoptimized
          />
          <p className="pgal-modal-hint">Tap anywhere to close</p>
        </div>
      )}
    </>
  );
}