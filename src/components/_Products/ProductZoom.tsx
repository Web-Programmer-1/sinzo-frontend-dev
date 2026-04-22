"use client";

import { useState, useRef, useEffect } from "react";
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

export default function ProductImageGallery({
  images,
  activeIndex,
  onImageChange,
  productName,

  onMouseDown,
  onMouseLeave: onExternalMouseLeave,
  onMouseUp,
  onMouseMove: onExternalMouseMove,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  galleryRef,
}: ProductImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileZoomImage, setMobileZoomImage] = useState<string | null>(null);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const ref = galleryRef?.current || imageRef.current;
    if (!ref || !isDesktop || !isZoomed) return;

    const rect = ref.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setLensPosition({
      x: e.clientX - rect.left - 50,
      y: e.clientY - rect.top - 50,
    });
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (isDesktop) {
      setIsZoomed(true);
    }
  };

  const handleMouseLeave = () => {
    if (isDesktop) {
      setIsZoomed(false);
    }
  };

  const handleImageClick = () => {
    if (!isDesktop) {
      setMobileZoomImage(images[activeIndex]);
    }
  };

  const closeMobileZoom = () => {
    setMobileZoomImage(null);
  };

  const showThumbnails = images.length > 1;

  return (
    <div ref={containerRef} className="gallery-container">
      <style>{`
        .gallery-container {
          display: flex;
          flex-direction: column;
          background: #f0efed;
          position: relative;
        }

        .gallery-main {
          display: flex;
          flex-direction: column;
          order: 1;
          position: relative;
        }

        .gallery-thumbnails {
          display: flex;
          flex-direction: row;
          gap: 6px;
          padding: 8px 10px;
          overflow-x: auto;
          scrollbar-width: none;
          order: 2;
          background: #f0efed;
        }

        .gallery-thumbnails::-webkit-scrollbar {
          display: none;
        }

        .gallery-thumb {
          flex-shrink: 0;
          width: 60px;
          height: 60px;
          border-radius: 8px;
          border: 2px solid transparent;
          background: rgba(255,255,255,0.6);
          overflow: hidden;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s, transform 0.14s;
          cursor: pointer;
        }

        .gallery-thumb:hover {
          transform: translateY(-1px);
        }

        .gallery-thumb--active {
          border-color: #111;
          background: #fff;
        }

        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 3px;
        }

        .gallery-image-wrapper {
          position: relative;
          width: 100%;
          min-height: 300px;
          overflow: hidden;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .gallery-image-wrapper:active,
        .gallery-image-wrapper.dragging {
          cursor: grabbing !important;
        }

        .gallery-image-wrapper.desktop-zoom {
          cursor: crosshair;
        }

        .gallery-image-wrapper.desktop-zoom-active {
          cursor: none;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          min-height: 300px;
          object-fit: contain;
          object-position: center;
          padding: 20px 16px 16px;
          transition: transform 0.45s ease;
          user-select: none;
          pointer-events: none;
          -webkit-user-drag: none;
          user-drag: none;
        }

        .gallery-image.mobile-clickable {
          cursor: zoom-in;
        }

        .zoom-lens {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 2px solid rgba(0, 0, 0, 0.4);
          background: rgba(255, 255, 255, 0.25);
          pointer-events: none;
          z-index: 20;
          display: none;
        }

        .zoom-lens.active {
          display: block;
        }

        .zoom-result-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 15;
          display: none;
          overflow: hidden;
          border-radius: inherit;
        }

        .zoom-result-overlay.active {
          display: block;
        }

        .zoom-result-overlay img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 20px 16px 16px;
        }

        .mobile-zoom-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .mobile-zoom-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 24px;
          z-index: 10;
          transition: background 0.2s;
        }

        .mobile-zoom-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .mobile-zoom-image {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .mobile-zoom-hint {
          position: absolute;
          bottom: 30px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          text-align: center;
        }

        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, transform 0.15s;
          z-index: 10;
          cursor: pointer;
        }

        .gallery-nav:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.08);
        }

        .gallery-nav--prev {
          left: 10px;
        }

        .gallery-nav--next {
          right: 10px;
        }

        .gallery-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          z-index: 10;
        }

        .gallery-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.5);
          padding: 0;
          transition: background 0.18s, transform 0.18s;
          cursor: pointer;
        }

        .gallery-dot--active {
          background: #fff;
          transform: scale(1.3);
        }

        @media (min-width: 640px) {
          .gallery-container {
            flex-direction: row;
          }

          .gallery-main {
            flex-direction: row;
            width: 100%;
          }

          .gallery-thumbnails {
            flex-direction: column;
            order: 1;
            width: 72px;
            flex-shrink: 0;
            padding: 10px 6px;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: 520px;
          }

          .gallery-thumb {
            width: 58px;
            height: 58px;
            flex-shrink: 0;
          }

          .gallery-image-wrapper {
            flex: 1;
            order: 2;
            min-height: 460px;
          }

          .gallery-image {
            min-height: 460px;
            padding: 24px 18px 18px;
          }

          .zoom-result-overlay img {
            padding: 24px 18px 18px;
          }
        }

        @media (min-width: 900px) {
          .gallery-container {
            width: 52%;
          }

          .gallery-thumbnails {
            width: 80px;
            padding: 14px 8px;
            gap: 8px;
            max-height: 600px;
          }

          .gallery-thumb {
            width: 64px;
            height: 64px;
            border-radius: 9px;
          }

          .gallery-image-wrapper {
            min-height: 540px;
          }

          .gallery-image {
            min-height: 540px;
            padding: 30px 22px 22px;
          }

          .zoom-result-overlay img {
            padding: 30px 22px 22px;
          }

          .gallery-nav {
            width: 36px;
            height: 36px;
          }
        }

        @media (max-width: 1023px) {
          .zoom-lens,
          .zoom-result-overlay {
            display: none !important;
          }
        }
      `}</style>

      {showThumbnails && (
        <div className="gallery-thumbnails">
          {images.map((img, i) => (
            <button
              key={i}
              className={`gallery-thumb${i === activeIndex ? " gallery-thumb--active" : ""}`}
              onClick={() => onImageChange(i)}
              type="button"
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                width={60}
                height={60}
              />
            </button>
          ))}
        </div>
      )}

      <div className="gallery-main">
        <div
          ref={galleryRef || imageRef}
          className={`gallery-image-wrapper${isDesktop && isZoomed ? " desktop-zoom-active" : ""}${isDesktop ? " desktop-zoom" : ""}`}
          onMouseMove={(e) => {
            handleMouseMove(e);
            onExternalMouseMove?.(e);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={(e) => {
            handleMouseLeave();
            onExternalMouseLeave?.(e);
          }}
          onClick={handleImageClick}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={images[activeIndex]}
            alt={productName}
            fill
            className={`gallery-image${!isDesktop ? " mobile-clickable" : ""}`}
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 40vw"
            unoptimized
          />

          {isDesktop && isZoomed && (
            <>
              <div
                className="zoom-lens active"
                style={{
                  left: `${lensPosition.x}px`,
                  top: `${lensPosition.y}px`,
                }}
              />
              <div className="zoom-result-overlay active">
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

          {showThumbnails && (
            <>
              <button
                className="gallery-nav gallery-nav--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange((activeIndex - 1 + images.length) % images.length);
                }}
                type="button"
                aria-label="Previous image"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="gallery-nav gallery-nav--next"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange((activeIndex + 1) % images.length);
                }}
                type="button"
                aria-label="Next image"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <div className="gallery-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`gallery-dot${i === activeIndex ? " gallery-dot--active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageChange(i);
                    }}
                    type="button"
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {mobileZoomImage && (
        <div className="mobile-zoom-modal" onClick={closeMobileZoom}>
          <button
            className="mobile-zoom-close"
            onClick={closeMobileZoom}
            aria-label="Close zoom"
          >
            ✕
          </button>
          <Image
            src={mobileZoomImage}
            alt={`${productName} zoomed`}
            width={600}
            height={800}
            className="mobile-zoom-image"
            unoptimized
          />
          <div className="mobile-zoom-hint">
            Tap anywhere to close
          </div>
        </div>
      )}
    </div>
  );
}