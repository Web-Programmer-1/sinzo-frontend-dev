"use client";

import { memo, useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useGetSingleProduct } from "../../Apis/products/queries";
import {
  TReactionType,
  TReview,
  useAddReplyToReview,
  useCreateReview,
  useDeleteReview,
  useGetReviewsByProduct,
  useReactToReview,
  useRelatedProducts,
  useUpdateReview,
} from "../../Apis/review";
import { usePathname, useRouter } from "next/navigation";
import { useAddToCart } from "../../Apis/cart";
import { toast } from "sonner";
import ProductImageGallery from "./ProductZoom";

/* ══════════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════ */
interface ColorVariant {
  color: string;
  images: string[];
}
interface RelatedProduct {
  id: string;
  slug: string;
  productCardImage: string;
  title: string;
  price: number;
  badge: string | null;
  stock: number;
  totalReviews: number;
  averageRating?: number;
  cardShortTitle?: string;
}
interface ProductData {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  badge: string | null;
  productCardImage: string;
  galleryImages: string[];
  colorVariants: ColorVariant[] | null;
  sizes: string[];
  sizeType: string;
  sizeGuideImage: string | null;
  sizeGuideData: Record<string, string> | null;
  averageRating: number;
  totalReviews: number;
  category: { id: string; title: string; thumbnailImage: string };
  relatedProducts: RelatedProduct[];
}
interface ReviewReply {
  id: string;
  comment: string;
  createdAt: string;
  user: { name: string; profileImage: string | null };
}
interface ReviewReactions {
  care: number;
  haha: number;
  like: number;
  love: number;
  users: string[];
}
interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  replies: ReviewReply[];
  reactions: ReviewReactions;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; profileImage: string | null };
}

/* ══════════════════════════════════════════════════════
   Constants (module-level — never recreated)
══════════════════════════════════════════════════════ */
const BADGE_BG: Record<string, string> = {
  SALE: "#e53e3e",
  BEST_SELLER: "#c8930a",
  LOW_STOCK: "#e07b39",
  OUT_OF_STOCK: "#888",
  NEW: "#1a7f4b",
};
const BADGE_LABELS: Record<string, string> = {
  SALE: "Sale",
  BEST_SELLER: "Best Seller",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
  NEW: "New",
};

const REACTION_EMOJI: Record<string, string> = {
  like: "👍",
  love: "❤️",
  care: "🤗",
  haha: "😄",
};

const AV_COLORS = ["#c4a882", "#9ab5a0", "#a4b2c4", "#c4a4b4", "#b4a4c4"];

const DRAG_THRESHOLD = 50;

/* ══════════════════════════════════════════════════════
   CSS — module-level, injected ONCE
══════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  button { cursor: pointer;  }
  a { text-decoration: none; color: inherit; }
  img { display: block; }

  .pd-sec-head--rel {
  justify-content: space-between;
}

.pd-rel-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pd-rel-arrow {
  width: 34px;
  height: 34px;
  border: 1px solid #ddd;
  border-radius: 999px;
  background: #fff;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
}

.pd-rel-arrow:hover {
  background: #111;
  color: #fff;
  border-color: #111;
}

.pd-rel-slider {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
}

.pd-rel-slider::-webkit-scrollbar {
  display: none;
}

.pd-rel-card {
  flex: 0 0 220px;
  min-width: 220px;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f4f1;
  transition: transform 0.18s, box-shadow 0.18s;
  display: block;
}

.pd-rel-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.pd-rel-img {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #edeae5;
}

.pd-rel-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pd-rel-img-empty {
  width: 100%;
  height: 100%;
  background: #e8e5e0;
}

.pd-rel-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 0.54rem;
  font-weight: 700;
  color: #fff;
}

.pd-rel-info {
  padding: 8px 10px 10px;
}

.pd-rel-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pd-rel-short {
  font-size: 0.74rem;
  color: #666;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pd-rel-price {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111;
}

.pd-rel-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.pd-rel-reviews {
  font-size: 0.72rem;
  color: #888;
}

  .pd-wrap {
    background: #f5f5f5;
    min-height: 100dvh;
    color: #1a1a1a;
    padding-top: 100px;
  }

  .pd-hero { display: flex; flex-direction: column; background: #fff; }
  .pd-gallery { display: flex; flex-direction: column; background: #f0efed; }
  .pd-thumbs-col { display: flex; flex-direction: row; gap: 6px; padding: 8px 10px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; order: 2; background: #f0efed; }
  .pd-thumbs-col::-webkit-scrollbar { display: none; }
  .pd-thumb { flex-shrink: 0; width: 60px; height: 60px; border-radius: 8px; border: 2px solid transparent; background: rgba(255,255,255,0.6); overflow: hidden; padding: 0; display: flex; align-items: center; justify-content: center; transition: border-color 0.15s, transform 0.14s; }
  .pd-thumb img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
  .pd-thumb:hover { transform: translateY(-1px); }
  .pd-thumb--on { border-color: #111; background: #fff; }
  .pd-main-img-wrap { position: relative; order: 1; min-height: 300px; }
  .pd-main-img-box { width: 100%; height: 100%; min-height: 300px; overflow: hidden; position: relative; }
  .pd-main-img { width: 100%; height: 100%; min-height: 300px; object-fit: contain; object-position: center; padding: 20px 16px 16px; transition: transform 0.45s ease; }
  .pd-main-img-box:hover .pd-main-img { transform: scale(1.03); }
  .pd-thumb-img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
  .pd-badge { position: absolute; top: 10px; left: 10px; padding: 3px 9px; border-radius: 5px; font-size: 0.6rem; font-weight: 700; color: #fff; letter-spacing: 0.06em; text-transform: uppercase; z-index: 5; }
  .pd-sold-out { position: absolute; inset: 0; background: rgba(0,0,0,0.38); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 0.9rem; z-index: 5; }
  .pd-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; border: none;  color: black; display: flex; align-items: center; justify-content: center;  transition: background 0.15s, transform 0.15s; z-index: 10; }
  .pd-arrow--prev { left: 10px; }
  .pd-arrow--next { right: 10px; }
  .pd-arrow:hover { background: #fff; transform: translateY(-50%) scale(1.08); }
  .pd-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px; z-index: 10; }
  .pd-dot { width: 10px; height: 10px; border-radius: 50%; border: none; background: rgba(255,255,255,0.5); padding: 0; transition: background 0.18s, transform 0.18s; }
  .pd-dot--on { background: #fff; transform: scale(1.3); }
  .pd-info { padding: 20px 16px 24px; display: flex; flex-direction: column; background: #fff; }
  .pd-brand { display: flex; align-items: center; gap: 7px; margin-bottom: 10px; }
  .pd-brand-icon { width: 24px; height: 24px; border-radius: 50%; background: #111; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pd-brand-icon img { width: 100%; height: 100%; object-fit: cover; }
  .pd-brand-icon span { color: #fff; font-size: 20px; font-weight: 700; }
  .pd-brand-name { font-size: 0.8rem; font-weight: 600; color: #666; }
  .pd-title {  font-size: clamp(2rem, 5vw, 5rem); font-weight: 600; color: #111; line-height: 1.2; margin-bottom: 8px; }
  .pd-rating-row { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
  .pd-rating-count { font-size: 0.75rem; color: #999; }
  .pd-price { font-size: clamp(1.3rem, 5vw, 1.85rem); font-weight: 600; color: #111; letter-spacing: -0.02em; margin-bottom: 16px; }
  .pd-divider { height: 1px; background: #efefef; margin-bottom: 16px; }
  .pd-field { margin-bottom: 16px; }
  .pd-field-label { font-size: 0.78rem; color: #555; font-weight: 500; margin-bottom: 8px; display: flex; align-items: center; gap: 3px; }
  .pd-field-sep { color: #ccc; }
  .pd-field-val { color: #333; font-weight: 600; }
  .pd-swatches { display: flex; flex-wrap: wrap; gap: 7px; }
  .pd-swatch { width: 30px; height: 30px; border-radius: 6px; border: 2px solid transparent; transition: all 0.15s; box-shadow: 0 1px 4px rgba(0,0,0,0.18); flex-shrink: 0; }
  .pd-swatch:hover { transform: scale(1.1); }
  .pd-swatch--on { border-color: #111 !important; box-shadow: 0 0 0 3px rgba(0,0,0,0.1); }
  .pd-sizes-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .pd-sizes { display: flex; flex-wrap: wrap; gap: 6px; }
  .pd-sz { min-width: 44px; padding: 8px 10px; border: 1.5px solid #ddd; border-radius: 6px; background: #fff; color: #333; font-size: 0.8rem; font-weight: 500; text-align: center; transition: all 0.14s; }
  .pd-sz:hover { border-color: #888; }
  .pd-sz--on { background: #111; color: #fff; border-color: #111; }
  .pd-size-chart-btn { display: flex; align-items: center; gap: 6px; padding: 10px 18px; border: 1.5px solid #222; border-radius: 6px; background: #111; color: #fff; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; transition: background 0.15s, transform 0.14s; flex-shrink: 0; }
  .pd-size-chart-btn:hover { background: #333; transform: translateY(-1px); }
  .pd-size-chart-btn:active { transform: none; }
  .pd-cta-row { display: flex; gap: 10px; margin-bottom: 10px; align-items: stretch; }
  .pd-qty-wrap { position: relative; display: flex; align-items: center; flex-shrink: 0; }
  .pd-qty-sel { appearance: none; -webkit-appearance: none; width: 80px; height: 100%; min-height: 48px; padding: 0 30px 0 14px; border: 1.5px solid #ddd; border-radius: 8px; background: #fff;  font-size: 0.9rem; color: #111; font-weight: 500; cursor: pointer; outline: none; transition: border-color 0.15s; }
  .pd-qty-sel:focus { border-color: #111; }
  .pd-qty-sel:disabled { opacity: 0.45; cursor: not-allowed; }
  .pd-qty-wrap > svg { position: absolute; right: 9px; pointer-events: none; color: #888; }
  .pd-cart-btn { flex: 1; background: transparent; color: #111; border: 1.5px solid #111; border-radius: 8px; padding: 13px 16px; font-size: 0.88rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; letter-spacing: 0.01em; transition: background 0.18s, color 0.18s, transform 0.14s; }
  .pd-cart-btn:hover:not(:disabled) { background: #111; color: #fff; }
  .pd-cart-btn:active:not(:disabled) { transform: scale(0.98); }
  .pd-cart-btn:disabled { opacity: 0.42; cursor: not-allowed; }
  .pd-buy-btn { width: 100%; background: #111; color: #fff; border: none; border-radius: 8px; padding: 14px 16px; font-size: 0.88rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 14px; transition: background 0.18s, transform 0.14s; }
  .pd-buy-btn:hover:not(:disabled) { background: #2a2a2a; transform: translateY(-1px); }
  .pd-buy-btn:active:not(:disabled) { transform: none; }
  .pd-buy-btn:disabled { opacity: 0.42; cursor: not-allowed; }
  .pd-delivery { display: flex; align-items: center; gap: 7px; font-size: 0.90rem; font-weight: 500; color: #666; padding-top: 4px; }
  .pd-delivery svg { flex-shrink: 0; }
  .pd-section { background: #fff; padding: 20px 16px; margin-top: 8px; }
  .pd-sec-head { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
  .pd-sec-title {font-size: 1.25rem; color: #111; font-weight: 700 }
  .rv-count { font-size: 0.78rem; color: #aaa; }
  .pd-desc-txt { font-size: 0.90rem; line-height: 1.75; color: #555; white-space: pre-wrap; font-weight: 500; word-break: break-word; overflow-wrap: break-word; }
  .rv-controls { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
  .rv-write-btn { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border: 1.5px solid #111; border-radius: 20px; background: #fff; color: #111; font-size: 0.76rem; font-weight: 600; transition: all 0.15s; }
  .rv-write-btn:hover { background: #111; color: #fff; }
  .rv-write-form { background: #f9f9f7; border-radius: 12px; padding: 14px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 10px; border: 1px solid #efefef; }
  .rv-write-label { font-size: 0.78rem; font-weight: 600; color: #555; }
  .rv-star-picker { display: flex; gap: 4px; }
  .rv-star-btn { background: none; border: none; padding: 2px; transition: transform 0.12s; }
  .rv-star-btn:hover { transform: scale(1.18); }
  .rv-write-ta { width: 100%; border: 1px solid #e0e0e0; border-radius: 9px; padding: 9px 11px;  font-size: 0.84rem; resize: none; outline: none; background: #fff; transition: border-color 0.15s; }
  .rv-write-ta:focus { border-color: #111; }
  .rv-write-btns { display: flex; gap: 8px; justify-content: flex-end; }
  .rv-edit-form { background: #f9f9f7; border-radius: 10px; padding: 12px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 8px; }
  .rv-list { display: flex; flex-direction: column; }
  .rv-card { padding: 14px 0; border-bottom: 1px solid #f2f2f2; }
  .rv-card:last-child { border-bottom: none; padding-bottom: 0; }
  .rv-top { display: flex; align-items: flex-start; gap: 9px; margin-bottom: 8px; }
  .rv-av { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .rv-av img { width: 100%; height: 100%; object-fit: cover; }
  .rv-av span { font-size: 0.72rem; font-weight: 700; color: #fff; }
  .rv-av--sm { width: 28px; height: 28px; }
  .rv-av--sm span { font-size: 0.62rem; }
  .rv-meta { flex: 1; min-width: 0; }
  .rv-meta-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px; }
  .rv-name { font-size: 0.8rem; font-weight: 600; color: #111; }
  .rv-when { font-size: 0.68rem; color: #bbb; }
  .rv-txt { font-size: 0.82rem; color: #555; line-height: 1.58; margin-bottom: 9px; }
  .rv-owner-acts { display: flex; gap: 4px; margin-left: auto; flex-shrink: 0; }
  .rv-icon-btn { width: 26px; height: 26px; border: 1px solid #ececec; border-radius: 6px; background: #fff; color: #888; display: flex; align-items: center; justify-content: center; transition: all 0.14s; }
  .rv-icon-btn:hover { border-color: #111; color: #111; }
  .rv-icon-btn--del:hover { border-color: #e53e3e; color: #e53e3e; }
  .rv-reaction-summary { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
  .rv-reaction-chip { font-size: 0.72rem; background: #f5f5f5; border-radius: 20px; padding: 2px 8px; color: #555; }
  .rv-acts { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .rv-action-pill { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border: 1px solid #e8e8e8; border-radius: 20px; background: #fff; font-size: 0.72rem; color: #666; transition: all 0.14s; }
  .rv-action-pill:hover { border-color: #111; color: #111; }
  .rv-action-pill--ghost { color: #aaa; border-color: #f0f0f0; }
  .rv-action-pill--ghost:hover { color: #555; border-color: #ccc; }
  .rv-react-wrap { position: relative; }
  .rv-reaction-panel { position: absolute; bottom: calc(100% + 6px); left: 0; background: #fff; border: 1px solid #e8e8e8; border-radius: 28px; padding: 6px 10px; display: flex; gap: 4px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); z-index: 20; white-space: nowrap; }
  .rv-emoji-btn { font-size: 1.15rem; border: none; background: none; padding: 2px 3px; border-radius: 6px; transition: transform 0.12s; }
  .rv-emoji-btn:hover { transform: scale(1.3); }
  .rv-reply-box { margin-top: 10px; background: #f9f9f7; border-radius: 9px; padding: 10px; display: flex; flex-direction: column; gap: 7px; }
  .rv-reply-ta { width: 100%; border: 1px solid #e0e0e0; border-radius: 7px; padding: 7px 9px;  font-size: 0.8rem; resize: none; outline: none; background: #fff; }
  .rv-reply-ta:focus { border-color: #111; }
  .rv-reply-row { display: flex; gap: 6px; justify-content: flex-end; }
  .rv-reply-item { display: flex; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #f0f0f0; }
  .rv-reply-body { flex: 1; }
  .rv-cancel-btn { padding: 5px 12px; background: transparent; border: 1px solid #e0e0e0; border-radius: 7px; font-size: 0.74rem; color: #888; transition: border-color 0.14s; }
  .rv-cancel-btn:hover { border-color: #999; }
  .rv-send-btn { padding: 5px 14px; background: #111; border: none; border-radius: 7px; font-size: 0.74rem; color: #fff; font-weight: 600; transition: background 0.14s; }
  .rv-send-btn:hover:not(:disabled) { background: #333; }
  .rv-send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .rv-loading { display: flex; flex-direction: column; gap: 14px; }
  .rv-skeleton { display: flex; gap: 10px; padding: 12px 0; }
  .rv-sk-av { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%); background-size: 200% 100%; animation: sk 1.4s infinite; }
  .rv-sk-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%); background-size: 200% 100%; animation: sk 1.4s infinite; }
  @keyframes sk { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .rv-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px 0; color: #bbb; font-size: 0.84rem; }
  .pd-rel-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .sg-bd { position: fixed; inset: 0; background: rgba(0,0,0,0.46); z-index: 1000; display: flex; align-items: flex-end; justify-content: center; }
  .sg-sheet { background: #fff; width: 100%; max-width: 520px; border-radius: 18px 18px 0 0; max-height: 80vh; overflow-y: auto; }
  .sg-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px 12px; border-bottom: 1px solid #f0f0f0; }
  .sg-title { font-size: 0.95rem; color: #111; }
  .sg-close { background: none; border: none; font-size: 1rem; color: #888; cursor: pointer; }
  .sg-body { padding: 16px 18px 28px; display: flex; flex-direction: column; gap: 14px; }
  .sg-img { width: 100%; border-radius: 8px; }
  .sg-tbl { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
  .sg-tbl th { background: #f8f8f8; padding: 8px 12px; text-align: left; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #777; border-bottom: 1px solid #ebebeb; }
  .sg-tbl td { padding: 8px 12px; border-bottom: 1px solid #f5f5f5; color: #444; }
  .sg-note { font-size: 0.68rem; color: #aaa; margin-top: 4px; }

  @media (min-width: 640px) {
    .pd-hero { flex-direction: row; align-items: flex-start; }
    .pd-gallery { flex-direction: row; width: 50%; flex-shrink: 0; min-height: 460px; }
    .pd-thumbs-col { flex-direction: column; order: 1; width: 72px; flex-shrink: 0; padding: 10px 6px; overflow-y: auto; overflow-x: hidden; max-height: 520px; }
    .pd-thumbs-col::-webkit-scrollbar { display: none; }
    .pd-thumb { width: 58px; height: 58px; flex-shrink: 0; }
    .pd-main-img-wrap { flex: 1; order: 2; min-height: 460px; }
    .pd-main-img-box { min-height: 460px; }
    .pd-main-img { min-height: 460px; padding: 24px 18px 18px; }
    .pd-info { flex: 1; padding: 28px 28px 32px 24px; }
    .pd-title { font-size: 1.7rem; margin-bottom: 10px; }
    .pd-price { font-size: 1.8rem; margin-bottom: 20px; }
    .pd-field { margin-bottom: 18px; }
    .pd-swatch { width: 32px; height: 32px; border-radius: 8px; }
    .pd-sz { min-width: 50px; padding: 9px 12px; font-size: 0.84rem; }
    .pd-size-chart-btn { padding: 10px 20px; font-size: 0.75rem; }
    .pd-qty-sel { width: 88px; font-size: 0.92rem; }
    .pd-cart-btn { padding: 14px 18px; font-size: 0.92rem; }
    .pd-buy-btn { padding: 15px 18px; font-size: 0.92rem; }
    .pd-delivery { font-size: 0.82rem; }
  }

  @media (min-width: 900px) {
    .pd-wrap { max-width: 1100px; margin-left: auto; margin-right: auto; }
    .pd-hero { border-radius: 0; }
    .pd-gallery { width: 52%; }
    .pd-thumbs-col { width: 80px; padding: 14px 8px; gap: 8px; max-height: 600px; }
    .pd-thumb { width: 64px; height: 64px; border-radius: 9px; }
    .pd-main-img-wrap { min-height: 540px; }
    .pd-main-img-box { min-height: 540px; }
    .pd-main-img { min-height: 540px; padding: 30px 22px 22px; }
    .pd-info { padding: 36px 40px 40px 32px; }
    .pd-brand-icon { width: 28px; height: 28px; }
    .pd-brand-name { font-size: 0.88rem; }
    .pd-title { font-size: 2rem; margin-bottom: 12px; }
    .pd-price { font-size: 2rem; margin-bottom: 24px; }
    .pd-field { margin-bottom: 20px; }
    .pd-field-label { font-size: 0.84rem; }
    .pd-swatch { width: 34px; height: 34px; }
    .pd-sz { min-width: 52px; padding: 10px 14px; font-size: 0.86rem; border-radius: 8px; }
    .pd-size-chart-btn { padding: 11px 22px; font-size: 0.78rem; }
    .pd-qty-sel { width: 92px; min-height: 52px; font-size: 1rem; }
    .pd-cart-btn { padding: 15px 20px; font-size: 0.95rem; border-radius: 10px; }
    .pd-buy-btn { padding: 16px 20px; font-size: 0.95rem; border-radius: 10px; letter-spacing: 0.06em; }
    .pd-delivery { font-size: 0.84rem; }
    .pd-section { padding: 32px 40px; }
    .pd-sec-title { font-size: 1.3rem; }
    .rv-list { display: grid; grid-template-columns: 1fr 1fr; }
    .rv-card { padding: 18px; border-right: 1px solid #f2f2f2; border-bottom: 1px solid #f2f2f2; }
    .rv-card:nth-child(even) { border-right: none; }
    .sg-bd { align-items: center; }
    .sg-sheet { border-radius: 16px; max-width: 480px; }
  }

  @media (min-width: 1100px) {
    .pd-info { padding: 44px 52px 48px 40px; }
    .pd-section { padding: 36px 52px; }
    .pd-arrow { width: 36px; height: 36px; }
  }
`;

/* ══════════════════════════════════════════════════════
   Inject CSS once at module level (SSR-safe)
══════════════════════════════════════════════════════ */
if (typeof document !== "undefined") {
  if (!document.getElementById("__pd-styles__")) {
    const tag = document.createElement("style");
    tag.id = "__pd-styles__";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }
}

/* ══════════════════════════════════════════════════════
   Export
══════════════════════════════════════════════════════ */
export default function ProductDetailsPage({ slug }: { slug: string }) {
  const { data: res, isLoading, isError } = useGetSingleProduct(slug);
  const product: ProductData | undefined = (res as { data?: ProductData } | undefined)?.data;

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !product)
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
        Product not found.
      </div>
    );
  return <ProductDetails product={product} />;
}

/* ══════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════ */
function ProductDetails({ product }: { product: ProductData }) {
  const colorVariants: ColorVariant[] = product.colorVariants ?? [];

  const [selectedColor, setSelectedColor] = useState<string>(
    colorVariants.length > 0 ? colorVariants[0].color : "",
  );
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const relatedSliderRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const { data: relatedRes } = useRelatedProducts(product.id, 8);
  const relatedProducts: RelatedProduct[] = relatedRes?.data ?? [];

  const router = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();

  // ── Derived values (memoized) ────────────────────
  const soldOut = product.stock === 0;
  const maxQty = useMemo(() => Math.min(product.stock, 10), [product.stock]);

  const activeVariant = useMemo(
    () => colorVariants.find((v) => v.color === selectedColor),
    [colorVariants, selectedColor],
  );

  const displayImages = useMemo(() => {
    const base = [product.productCardImage, ...product.galleryImages].filter(Boolean);
    if (activeVariant?.images?.[0]) {
      return Array.from(new Set([activeVariant.images[0], ...base].filter(Boolean)));
    }
    return Array.from(new Set(base));
  }, [activeVariant, product.productCardImage, product.galleryImages]);

  // ── Shared cart payload ──────────────────────────
  const cartPayload = useMemo(
    () => ({
      productId: product.id,
      quantity,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    }),
    [product.id, quantity, selectedColor, selectedSize],
  );

  // ── Validation ───────────────────────────────────
  const validateSelection = useCallback((): boolean => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Select size first");
      return false;
    }
    if (product.colorVariants?.length > 0 && !selectedColor) {
      toast.error("Select color first");
      return false;
    }
    return true;
  }, [product.sizes, product.colorVariants, selectedSize, selectedColor]);

  // ── Cart handlers ────────────────────────────────
  const handleAddToCart = useCallback(() => {
    if (soldOut || !validateSelection()) return;
    addToCart(cartPayload, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Added to cart");
        router.push("/cart/my-cart");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to add cart");
      },
    });
  }, [soldOut, validateSelection, addToCart, cartPayload, router]);

  const handleBuyNow = useCallback(() => {
    if (soldOut || !validateSelection()) return;
    addToCart(cartPayload, {
      onSuccess: () => router.push("/cart"),
    });
  }, [soldOut, validateSelection, addToCart, cartPayload, router]);

  // ── Color / related slider ───────────────────────
  const handleColorSelect = useCallback((color: string) => setSelectedColor(color), []);

  const scrollRelated = useCallback((direction: "left" | "right") => {
    relatedSliderRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }, []);

  // ── Drag / swipe handlers ────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
  }, []);

  const handleMouseLeave = useCallback(() => setIsDragging(false), []);

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const diff = startX - e.pageX;
      if (Math.abs(diff) > DRAG_THRESHOLD) {
        setActiveImg((prev) =>
          diff > 0
            ? (prev + 1) % displayImages.length
            : (prev - 1 + displayImages.length) % displayImages.length,
        );
      }
      setIsDragging(false);
    },
    [isDragging, startX, displayImages.length],
  );

  const handleMouseMove = useCallback((_e: React.MouseEvent) => {}, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  }, []);

  const handleTouchMove = useCallback((_e: React.TouchEvent) => {}, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].pageX;
      if (Math.abs(diff) > DRAG_THRESHOLD) {
        setActiveImg((prev) =>
          diff > 0
            ? (prev + 1) % displayImages.length
            : (prev - 1 + displayImages.length) % displayImages.length,
        );
      }
      setIsDragging(false);
    },
    [isDragging, startX, displayImages.length],
  );

  // ── Size guide toggle ────────────────────────────
  const openSizeGuide = useCallback(() => setSizeGuideOpen(true), []);
  const closeSizeGuide = useCallback(() => setSizeGuideOpen(false), []);

  return (
    <>
      <div className="pd-wrap">
        {/* ══ HERO: IMAGE + INFO ══ */}
        <div className="pd-hero">
          {/* LEFT: Gallery */}
          <ProductImageGallery
            images={displayImages}
            activeIndex={activeImg}
            onImageChange={setActiveImg}
            productName={product.title}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            galleryRef={galleryRef}
          />

          {/* RIGHT: Info */}
          <div className="pd-info">
            <div className="pd-brand">
              <div className="pd-brand-icon">
                {product.category.thumbnailImage ? (
                  <img
                    src={product.category.thumbnailImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="font-semibold text-5xl">
                    {product.category.title.charAt(0)}
                  </span>
                )}
              </div>
              <span className="pd-brand-name">{product.category.title}</span>
            </div>

            <h1 className="pd-title">{product.title}</h1>

            <div className="pd-rating-row">
              <StarsRow rating={product.averageRating} />
              <span className="pd-rating-count">({product.totalReviews})</span>
            </div>

            <div className="pd-price">৳{product.price.toLocaleString()}</div>

            <div className="pd-divider" />

            {product.sizes?.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[15px] font-medium text-gray-700">
                    Size ({product.sizeType})
                  </p>

                  {(product.sizeGuideImage || product.sizeGuideData) && (
                    <button
                      type="button"
                      onClick={openSizeGuide}
                      className="group relative inline-flex items-center justify-center rounded-full p-[2px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(0,0,0,0.15)] active:scale-95"
                    >
                      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-black via-gray-300 to-white opacity-80 transition-opacity duration-300 group-hover:opacity-100"></span>
                      <span className="relative flex items-center gap-2 rounded-full bg-gradient-to-b from-white to-gray-100 px-4 py-1.5 text-[13px] font-bold tracking-wide text-gray-800 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                        <span className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
                          <span className="h-4 w-4 text-gray-700 group-hover:text-black">
                            <RulerIcon />
                          </span>
                        </span>
                        Size Guide
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize((prev) => (prev === s ? "" : s))}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        selectedSize === s
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COLOR */}
            {product.colorVariants?.length > 0 && (
              <div>
                <div className="mb-2 mt-2 flex items-center justify-between gap-3">
                  <p className="text-[15px] font-medium text-gray-700">Color</p>
                </div>
                <div className="flex items-center gap-3">
                  {product.colorVariants.map((cv) => (
                    <button
                      key={cv.color}
                      type="button"
                      onClick={() => handleColorSelect(cv.color)}
                      aria-label={cv.color}
                      title={cv.color}
                      className={`h-8 w-8 rounded-full border-2 transition ${
                        selectedColor === cv.color
                          ? "scale-105 border-black"
                          : "border-gray-300"
                      }`}
                      style={{ background: cv.color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="pd-cta-row" />

            <div className="pd-cta-row">
              <div className="pd-qty-wrap">
                <select
                  className="pd-qty-sel"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={soldOut || isPending}
                >
                  {Array.from({ length: maxQty || 1 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </div>

              <button
                className="pd-cart-btn"
                disabled={soldOut || isPending}
                onClick={handleAddToCart}
              >
                <CartIcon />
                {soldOut ? "Out of Stock" : isPending ? "Adding..." : "Add to cart"}
              </button>
            </div>

            <button
              className="pd-buy-btn"
              disabled={soldOut || isPending}
              onClick={handleBuyNow}
            >
              {soldOut ? "Unavailable" : isPending ? "Processing..." : "Buy it now"}
            </button>

            <div className="pd-delivery">
              <TruckIcon />
              <span>Free delivery on orders over ৳20,000</span>
            </div>
          </div>
        </div>

        {/* ══ DESCRIPTION ══ */}
        {product.description && (
          <div className="pd-section">
            <div className="pd-sec-head">
              <span className="pd-sec-title">Description</span>
            </div>
            <p className="pd-desc-txt">{product.description}</p>
          </div>
        )}

        {/* ══ REVIEWS ══ */}
        <ReviewsSection productId={product.id} averageRating={product.averageRating} />
      </div>

      {relatedProducts.length > 0 && (
        <div className="pd-section">
          <div className="pd-sec-head pd-sec-head--rel">
            <span className="pd-sec-title">You may also like</span>
            <div className="pd-rel-nav">
              <button
                className="pd-rel-arrow"
                onClick={() => scrollRelated("left")}
                aria-label="Scroll left"
              >
                <ChevronLeft />
              </button>
              <button
                className="pd-rel-arrow"
                onClick={() => scrollRelated("right")}
                aria-label="Scroll right"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="pd-rel-slider" ref={relatedSliderRef}>
            {relatedProducts.map((rp) => (
              <RelatedProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

      {sizeGuideOpen && (
        <SizeGuideModal
          image={product.sizeGuideImage}
          data={product.sizeGuideData}
          onClose={closeSizeGuide}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   Related Product Card — memoized to prevent re-render
   when parent state (qty, color, etc.) changes
══════════════════════════════════════════════════════ */
const RelatedProductCard = memo(function RelatedProductCard({
  product: rp,
}: {
  product: RelatedProduct;
}) {
  return (
    <a href={`/product/${rp.slug}`} className="pd-rel-card">
      <div className="pd-rel-img">
        {rp.productCardImage ? (
          <img src={rp.productCardImage} alt={rp.title} loading="lazy" decoding="async" />
        ) : (
          <div className="pd-rel-img-empty" />
        )}
        {rp.badge && (
          <span className="pd-rel-badge" style={{ background: BADGE_BG[rp.badge] }}>
            {BADGE_LABELS[rp.badge]}
          </span>
        )}
      </div>
      <div className="pd-rel-info">
        <p className="pd-rel-name">{rp.title}</p>
        {rp.cardShortTitle && <p className="pd-rel-short">{rp.cardShortTitle}</p>}
        <p className="pd-rel-price">৳{rp.price.toLocaleString()}</p>
        {rp.averageRating && rp.averageRating > 0 && (
          <div className="pd-rel-rating">
            <StarsRow rating={rp.averageRating} small />
            <span className="pd-rel-reviews">({rp.totalReviews})</span>
          </div>
        )}
      </div>
    </a>
  );
});

/* ══════════════════════════════════════════════════════
   Reviews Section — memoized
══════════════════════════════════════════════════════ */
const ReviewsSection = memo(function ReviewsSection({
  productId,
  averageRating,
}: {
  productId: string;
  averageRating: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [sort, setSort] = useState<string | undefined>(undefined);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const invalidateInput = useMemo(() => ({ productId }), [productId]);

  const { data: reviewsRes, isLoading } = useGetReviewsByProduct(productId, sort);

  type CompatibleReviewType = TReview | Review;
  const reviews: CompatibleReviewType[] = (reviewsRes?.data as CompatibleReviewType[]) ?? [];

  const { mutate: createReview, isPending: isCreating } = useCreateReview(invalidateInput);

  const toggleWriteForm = useCallback(() => setShowWriteForm((v) => !v), []);

  const handleSubmitReview = useCallback(() => {
    if (!newComment.trim()) return;
    createReview(
      { productId, rating: newRating, comment: newComment.trim() },
      {
        onSuccess: () => {
          setNewComment("");
          setNewRating(5);
          setShowWriteForm(false);
          toast.success("Review posted successfully");
        },
        onError: (error: any) => {
          const statusCode =
            error?.response?.status || error?.response?.data?.error?.statusCode;
          const message = error?.response?.data?.message || "Failed to post review";
          if (statusCode === 401) {
            toast.error("আগে login করুন, তারপর review দিন");
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
          }
          toast.error(message);
        },
      },
    );
  }, [newComment, newRating, productId, createReview, router, pathname]);

  return (
    <div className="pd-section">
      <div className="pd-sec-head">
        <span className="pd-sec-title">Reviews</span>
        <StarsRow rating={averageRating} />
        <span className="rv-count">({reviews.length})</span>
      </div>

      <div className="rv-controls">
        <button className="rv-write-btn" onClick={toggleWriteForm}>
          <PenIcon />
          Write a review
        </button>
      </div>

      {showWriteForm && (
        <div className="rv-write-form">
          <p className="rv-write-label">Your Rating</p>
          <div className="rv-star-picker">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`rv-star-btn${n <= newRating ? " rv-star-btn--on" : ""}`}
                onClick={() => setNewRating(n)}
                aria-label={`${n} star`}
              >
                <StarIcon filled={n <= newRating} />
              </button>
            ))}
          </div>
          <textarea
            className="rv-write-ta"
            placeholder="Share your thoughts about this product…"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="rv-write-btns">
            <button type="button" className="rv-cancel-btn" onClick={toggleWriteForm}>
              Cancel
            </button>
            <button
              type="button"
              className="rv-send-btn"
              onClick={handleSubmitReview}
              disabled={isCreating || !newComment.trim()}
            >
              {isCreating ? "Posting…" : "Post Review"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="rv-loading">
          {[1, 2, 3].map((i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rv-empty">
          <EmptyStarIcon />
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="rv-list">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r as Review} productId={productId} />
          ))}
        </div>
      )}
    </div>
  );
});

/* ══════════════════════════════════════════════════════
   Review Card — memoized
══════════════════════════════════════════════════════ */
const ReviewCard = memo(function ReviewCard({
  review,
  productId,
}: {
  review: Review;
  productId: string;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const [showReactionPanel, setShowReactionPanel] = useState(false);

  const invalidateInput = useMemo(() => ({ productId }), [productId]);

  const { mutate: addReply, isPending: isReplying } = useAddReplyToReview(invalidateInput);
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(invalidateInput);
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview(invalidateInput);
  const { mutate: reactToReview } = useReactToReview(invalidateInput);

  const avBg = useMemo(
    () => AV_COLORS[review.user.name.charCodeAt(0) % AV_COLORS.length],
    [review.user.name],
  );

  const initials = useMemo(
    () =>
      review.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [review.user.name],
  );

  const totalReactions = useMemo(
    () =>
      review.reactions.like +
      review.reactions.love +
      review.reactions.care +
      review.reactions.haha,
    [review.reactions],
  );

  const timeAgo = useCallback((iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(iso).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const handleReply = useCallback(() => {
    if (!replyText.trim()) return;
    addReply(
      { reviewId: review.id, payload: { action: "ADD_REPLY", message: replyText.trim() } },
      {
        onSuccess: () => {
          setReplyText("");
          setReplyOpen(false);
          setShowReplies(true);
        },
      },
    );
  }, [replyText, review.id, addReply]);

  const handleUpdate = useCallback(() => {
    updateReview(
      { reviewId: review.id, payload: { rating: editRating, comment: editComment.trim() } },
      { onSuccess: () => setEditOpen(false) },
    );
  }, [review.id, editRating, editComment, updateReview]);

  const handleDelete = useCallback(() => {
    if (!confirm("Delete this review?")) return;
    deleteReview(review.id);
  }, [review.id, deleteReview]);

  const handleReact = useCallback(
    (type: "like" | "love" | "care" | "haha") => {
      reactToReview({
        reviewId: review.id,
        payload: { action: "REACTION", reactionType: type.toUpperCase() as TReactionType },
      });
      setShowReactionPanel(false);
    },
    [review.id, reactToReview],
  );

  const toggleEditOpen = useCallback(() => setEditOpen((v) => !v), []);
  const toggleReplyOpen = useCallback(() => setReplyOpen((v) => !v), []);
  const toggleShowReplies = useCallback(() => setShowReplies((v) => !v), []);
  const toggleReactionPanel = useCallback(() => setShowReactionPanel((v) => !v), []);

  return (
    <div className="rv-card">
      <div className="rv-top">
        <div className="rv-av" style={{ background: avBg }}>
          {review.user.profileImage ? (
            <img src={review.user.profileImage} alt="" loading="lazy" decoding="async" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="rv-meta">
          <div className="rv-meta-row">
            <span className="rv-name">{review.user.name}</span>
            <span className="rv-when">{timeAgo(review.createdAt)}</span>
          </div>
          <StarsRow rating={review.rating} small />
        </div>
        <div className="rv-owner-acts">
          <button className="rv-icon-btn" title="Edit" onClick={toggleEditOpen}>
            <PenIcon size={12} />
          </button>
          <button
            className="rv-icon-btn rv-icon-btn--del"
            title="Delete"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {editOpen ? (
        <div className="rv-edit-form">
          <div className="rv-star-picker">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`rv-star-btn${n <= editRating ? " rv-star-btn--on" : ""}`}
                onClick={() => setEditRating(n)}
              >
                <StarIcon filled={n <= editRating} />
              </button>
            ))}
          </div>
          <textarea
            className="rv-write-ta"
            rows={2}
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
          <div className="rv-write-btns">
            <button className="rv-cancel-btn" onClick={() => setEditOpen(false)}>
              Cancel
            </button>
            <button className="rv-send-btn" onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="rv-txt">{review.comment}</p>
      )}

      {totalReactions > 0 && (
        <div className="rv-reaction-summary">
          {(["like", "love", "care", "haha"] as const)
            .filter((k) => review.reactions[k] > 0)
            .map((k) => (
              <span key={k} className="rv-reaction-chip">
                {REACTION_EMOJI[k]} {review.reactions[k]}
              </span>
            ))}
        </div>
      )}

      <div className="rv-acts">
        <div className="rv-react-wrap">
          <button className="rv-action-pill" onClick={toggleReactionPanel}>
            👍 React
          </button>
          {showReactionPanel && (
            <div className="rv-reaction-panel">
              {(["like", "love", "care", "haha"] as const).map((k) => (
                <button
                  key={k}
                  className="rv-emoji-btn"
                  onClick={() => handleReact(k)}
                  title={k}
                >
                  {REACTION_EMOJI[k]}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="rv-action-pill" onClick={toggleReplyOpen}>
          <ReplyIcon /> Reply
        </button>
        {review.replies.length > 0 && (
          <button
            className="rv-action-pill rv-action-pill--ghost"
            onClick={toggleShowReplies}
          >
            <BubbleIcon />
            {showReplies ? "Hide" : `${review.replies.length}`} replies
          </button>
        )}
      </div>

      {replyOpen && (
        <div className="rv-reply-box">
          <textarea
            className="rv-reply-ta"
            placeholder="Write a reply…"
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="rv-reply-row">
            <button className="rv-cancel-btn" onClick={() => setReplyOpen(false)}>
              Cancel
            </button>
            <button
              className="rv-send-btn"
              onClick={handleReply}
              disabled={isReplying || !replyText.trim()}
            >
              {isReplying ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      )}

      {showReplies &&
        review.replies.map((rep: any) => (
          <div key={rep.replyId} className="rv-reply-item">
            <div
              className="rv-av rv-av--sm"
              style={{
                background: AV_COLORS[rep.userName.charCodeAt(0) % AV_COLORS.length],
              }}
            >
              {rep.userImage ? (
                <img
                  src={rep.userImage}
                  alt={rep.userName}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span>{rep.userName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="rv-reply-body">
              <div className="rv-meta-row">
                <span className="rv-name">{rep.userName}</span>
                <span className="rv-when">{timeAgo(rep.createdAt)}</span>
              </div>
              <p className="rv-txt">{rep.message}</p>
            </div>
          </div>
        ))}
    </div>
  );
});

/* ══════════════════════════════════════════════════════
   Size Guide Modal
══════════════════════════════════════════════════════ */
const SizeGuideModal = memo(function SizeGuideModal({
  image,
  data,
  onClose,
}: {
  image: string | null;
  data: Record<string, string> | null;
  onClose: () => void;
}) {
  return (
    <div className="sg-bd" onClick={onClose}>
      <div className="sg-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sg-head">
          <span className="sg-title">Size Guide</span>
          <button className="sg-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="sg-body">
          {image && (
            <img src={image} alt="Size guide" className="sg-img" loading="lazy" decoding="async" />
          )}
          {data && (
            <div style={{ overflowX: "auto" }}>
              <table className="sg-tbl">
                <thead>
                  <tr>
                    {Object.keys(data).map((k) => (
                      <th key={k}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.values(data).map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <p className="sg-note">* All measurements in inches</p>
            </div>
          )}
          {!image && !data && (
            <p
              style={{
                color: "#aaa",
                textAlign: "center",
                padding: "20px 0",
                fontSize: "0.86rem",
              }}
            >
              No size guide available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

/* ══════════════════════════════════════════════════════
   UI Helpers — all memoized
══════════════════════════════════════════════════════ */
const StarsRow = memo(function StarsRow({
  rating,
  small,
}: {
  rating: number;
  small?: boolean;
}) {
  const s = small ? 12 : 15;
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#f5a623" : "none"}
          stroke="#f5a623"
          strokeWidth="1.8"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
});

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "#f5a623" : "none"}
      stroke="#f5a623"
      strokeWidth="1.8"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ReviewSkeleton() {
  return (
    <div className="rv-skeleton">
      <div className="rv-sk-av" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <div className="rv-sk-line" style={{ width: "40%" }} />
        <div className="rv-sk-line" style={{ width: "80%" }} />
        <div className="rv-sk-line" style={{ width: "60%" }} />
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pointerEvents: "none" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4M7 12v2M12 12v3M17 12v2" />
    </svg>
  );
}

function PenIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

function BubbleIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function EmptyStarIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ddd"
      strokeWidth="1.4"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <style>{`@keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}.sk{background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200% 100%;animation:sk 1.4s infinite;border-radius:6px}`}</style>
      <div style={{ background: "#fff" }}>
        <div style={{ display: "grid", gridTemplateColumns: "48% 1fr" }}>
          <div className="sk" style={{ aspectRatio: "0.85/1" }} />
          <div
            style={{
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 11,
            }}
          >
            {[50, 85, 55, 40, 70, 45, 90].map((w, i) => (
              <div key={i} className="sk" style={{ height: 13, width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div
          className="sk"
          style={{ height: 46, margin: "10px 14px", borderRadius: 10 }}
        />
      </div>
    </>
  );
}