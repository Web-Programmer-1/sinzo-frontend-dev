







"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import { useGetMyCart } from "../../Apis/cart";
import { useGlobalProductSearch } from "../../lib/GlobalSearch";
import { useGetMe } from "../../Apis/user/queries";
import { useGetSetting } from "../../Apis/logo";
import { useLogoutUser } from "../../Apis/user/mutations";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/product" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const AdminIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: settingData } = useGetSetting();
  const logoUrl = settingData?.data?.logo;

  const { data: meData } = useGetMe();
  const user = meData?.data;
  const isLoggedIn = !!user?.id;
  const isAdmin = user?.role === "ADMIN";

  const { mutate: logout, isPending: isLoggingOut } = useLogoutUser();

  const displayName = user?.fullName || user?.name || "Guest User";
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join("") || "U";

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistActive, setWishlistActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    trimmedQuery,
    products: searchedProducts,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useGlobalProductSearch();

  const POPULAR_SEARCHES = useMemo(
    () => ["New arrivals", "Kurtis", "Sarees", "Panjabi", "Eid collection", "Sale"],
    []
  );

  const { data: cartData } = useGetMyCart();
  const cartCount =
    cartData?.data?.items?.length ??
    cartData?.data?.cartItems?.length ??
    0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (value?: string) => {
    const finalQuery = (value ?? searchQuery).trim();
    if (!finalQuery) return;
    if (searchLoading || searchFetching) return;
    if (searchedProducts.length === 0) return;
    setSearchOpen(false);
    router.push(`/shop?searchTerm=${encodeURIComponent(finalQuery)}`);
  };

  const handleProductClick = (slug: string) => {
    setSearchOpen(false);
    router.push(`/product/${slug}`);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setProfileDropdownOpen(false);
        setMenuOpen(false);
        toast.success("Logout successful");
        router.push("/login");
      },
      onError: () => {
        toast.error("Logout failed");
      },
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        :root {
          --nav-bg: #FAFAF8;
          --nav-bg-scrolled: rgba(250,250,248,0.95);
          --nav-text: #1a1a18;
          --nav-accent: black;
          --nav-accent-light: #C9A84C;
          --nav-muted: #6b6b67;
          --nav-border: rgba(139,105,20,0.15);
          --nav-overlay: rgba(10,10,8,0.55);
          --nav-drawer-bg: #F5F3EE;
          --nav-height: 68px;
          --nav-height-sm: 60px;
          --transition: 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        .zaman-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: var(--nav-height);
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          transition: background var(--transition), box-shadow var(--transition), height var(--transition);
        }

        .zaman-nav.scrolled {
          background: var(--nav-bg-scrolled);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 1px 24px rgba(0,0,0,0.07);
        }

        .zaman-nav__inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 100%;
          padding: 0 1.25rem;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1rem;
        }

        .zaman-nav__links {
          display: none;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 2.25rem;
          align-items: center;
        }

        @media(min-width:1024px){ .zaman-nav__links { display: flex; } }

        .zaman-nav__links a {
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: var(--nav-muted);
          text-decoration: none;
          position: relative;
          padding-bottom: 3px;
          transition: color var(--transition);
        }

        .zaman-nav__links a::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: var(--nav-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--transition);
        }

        .zaman-nav__links a:hover,
        .zaman-nav__links a.active { color: var(--nav-text); }

        .zaman-nav__links a:hover::after,
        .zaman-nav__links a.active::after { transform: scaleX(1); }

        .zaman-nav__actions, .zaman-nav__left {
          display: flex;
          align-items: center;
          gap: 0.1rem;
        }

        .zaman-nav__actions { justify-content: flex-end; }
        .zaman-nav__left { justify-content: flex-start; }

        .zaman-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 50%;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--nav-text);
          position: relative;
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }

        .zaman-icon-btn:hover {
          background: rgba(0,0,0,0.04);
          color: #111;
          transform: scale(1.08);
        }

        .zaman-icon-btn.active { color: var(--nav-accent); }
        .zaman-icon-btn.wishlist.active svg { fill: var(--nav-accent); }

        .zaman-admin-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 8px;
          background: #111;
          color: #fff;
          border: none;
          cursor: pointer;
          margin-right: 0.25rem;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
          flex-shrink: 0;
        }

        .zaman-admin-btn:hover {
          background: #333;
          transform: scale(1.05);
        }

        @media(min-width:1024px){ .zaman-admin-btn { display: flex; } }

        .zaman-cart-badge {
          position: absolute;
          top: 5px; right: 5px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--nav-accent);
          color: #fff;
          font-size: 0.58rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          pointer-events: none;
        }

        .zaman-hamburger { display: flex; }
        @media(min-width:1024px){ .zaman-hamburger { display: none; } }

        .zaman-drawer-overlay {
          position: fixed; inset: 0; z-index: 1100;
          background: var(--nav-overlay);
          opacity: 0; pointer-events: none;
          transition: opacity var(--transition);
        }
        .zaman-drawer-overlay.open { opacity: 1; pointer-events: all; }

        .zaman-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: min(320px, 88vw);
          z-index: 1200;
          background: var(--nav-drawer-bg);
          transform: translateX(-100%);
          transition: transform var(--transition);
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 40px rgba(0,0,0,0.12);
        }
        .zaman-drawer.open { transform: translateX(0); }

        .zaman-drawer__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          height: var(--nav-height-sm);
          border-bottom: 1px solid var(--nav-border);
          flex-shrink: 0;
        }

        .zaman-drawer__nav {
          flex: 1;
          padding: 2rem 0;
          overflow-y: auto;
        }

        .zaman-drawer__nav ul { list-style: none; margin: 0; padding: 0; }
        .zaman-drawer__nav li { border-bottom: 1px solid var(--nav-border); }

        .zaman-drawer__nav a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.5rem;
          font-size: 0.90rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--nav-muted);
          text-decoration: none;
          transition: color 0.2s, padding-left 0.2s, background 0.2s;
        }

        .zaman-drawer__nav a:hover,
        .zaman-drawer__nav a.active {
          color: var(--nav-accent);
          background: rgba(139,105,20,0.04);
          padding-left: 1.85rem;
        }

        .zaman-drawer__nav a .arrow { opacity: 0; transition: opacity 0.2s, transform 0.2s; }
        .zaman-drawer__nav a:hover .arrow,
        .zaman-drawer__nav a.active .arrow { opacity: 1; transform: translateX(3px); }

        .zaman-drawer__admin-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.75rem 1.25rem;
          padding: 0.85rem 1rem;
          background: #111;
          color: #fff;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: background 0.2s;
        }

        .zaman-drawer__admin-link:hover { background: #333; }

        .zaman-drawer__footer {
          padding: 1.5rem;
          border-top: 1px solid var(--nav-border);
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .zaman-drawer__footer-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 0.5rem;
          border-radius: 6px;
          border: 1px solid var(--nav-border);
          background: transparent;
          cursor: pointer;
          color: var(--nav-muted);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.2s;
        }

        .zaman-drawer__footer-btn:hover {
          background: var(--nav-accent);
          color: #fff;
          border-color: var(--nav-accent);
        }

        .zaman-drawer__footer-btn.logout-btn {
          color: #dc2626;
        }

        .zaman-drawer__footer-btn.logout-btn:hover {
          background: #dc2626;
          color: #fff;
          border-color: #dc2626;
        }

        .zaman-search-overlay {
          position: fixed; inset: 0; z-index: 1300;
          background: var(--nav-overlay);
          opacity: 0; pointer-events: none;
          transition: opacity var(--transition);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 80px;
        }
        .zaman-search-overlay.open { opacity: 1; pointer-events: all; }

        .zaman-search-modal {
          width: min(720px, 92vw);
          background: var(--nav-bg);
          border-radius: 12px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
          overflow: hidden;
          transform: translateY(-24px) scale(0.97);
          transition: transform var(--transition);
        }
        .zaman-search-overlay.open .zaman-search-modal { transform: translateY(0) scale(1); }

        .zaman-search-modal__top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--nav-border);
        }

        .zaman-search-modal__input {
          flex: 1;
          border: none; outline: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 300;
          color: var(--nav-text);
          letter-spacing: 0.04em;
        }
        .zaman-search-modal__input::placeholder { color: #b0ae9d; }

        .zaman-search-modal__hint {
          padding: 1.5rem 1.25rem 1.75rem;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--nav-muted);
        }
        .zaman-search-modal__hint strong {
          display: block;
          margin-bottom: 0.75rem;
          color: var(--nav-text);
          font-weight: 500;
        }

        .zaman-search-body { max-height: min(65vh, 520px); overflow-y: auto; }
        .zaman-search-results { padding: 0.75rem 0 1rem; }

        .zaman-search-results__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem 0.75rem;
          border-bottom: 1px solid var(--nav-border);
          font-size: 0.78rem;
          color: var(--nav-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .zaman-search-result-list { display: flex; flex-direction: column; }

        .zaman-search-result-item {
          width: 100%;
          display: grid;
          grid-template-columns: 64px 1fr auto;
          gap: 0.9rem;
          align-items: center;
          padding: 0.85rem 1.25rem;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          cursor: pointer;
          text-align: left;
          transition: background 0.2s ease;
        }
        .zaman-search-result-item:hover { background: rgba(0,0,0,0.03); }

        .zaman-search-result-item__image {
          position: relative;
          width: 64px; height: 76px;
          border-radius: 10px;
          overflow: hidden;
          background: #f2f2f2;
        }
        .zaman-search-result-item__fallback { width: 100%; height: 100%; background: #ececec; }
        .zaman-search-result-item__content { min-width: 0; }

        .zaman-search-result-item__title {
          margin: 0 0 0.2rem;
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--nav-text);
          line-height: 1.35;
        }

        .zaman-search-result-item__meta {
          margin: 0;
          font-size: 0.76rem;
          color: var(--nav-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .zaman-search-result-item__right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.28rem;
        }

        .zaman-search-result-item__price {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--nav-text);
        }

        .zaman-search-result-item__stock {
          font-size: 0.7rem;
          color: var(--nav-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .zaman-search-empty {
          padding: 1.5rem 1.25rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          align-items: flex-start;
        }
        .zaman-search-empty p { margin: 0; color: var(--nav-muted); font-size: 0.92rem; }

        .zaman-search-loading { padding: 1rem 1.25rem; display: grid; gap: 0.75rem; }

        .zaman-search-skeleton {
          height: 76px;
          border-radius: 12px;
          background: linear-gradient(90deg, #f2f2f2 25%, #e8e8e8 50%, #f2f2f2 75%);
          background-size: 200% 100%;
          animation: zamanShimmer 1.2s linear infinite;
        }

        @keyframes zamanShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .zaman-login-btn {
          display: none;
        }

        .zaman-desktop-user-wrap {
          position: relative;
          display: none;
        }

        .zaman-desktop-user {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          text-decoration: none;
          color: var(--nav-text);
          margin-right: 0.35rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .zaman-desktop-user__trigger {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .zaman-desktop-user__avatar {
          width: 38px; height: 38px;
          border-radius: 999px;
          overflow: hidden;
          background: #111;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .zaman-desktop-user__avatar img { width: 100%; height: 100%; object-fit: cover; }
        .zaman-desktop-user__info { min-width: 0; }

        .zaman-desktop-user__name {
          margin: 0;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--nav-text);
          line-height: 1.1;
          text-align: left;
        }

        .zaman-desktop-user__meta {
          margin: 0.15rem 0 0;
          font-size: 0.66rem;
          color: var(--nav-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
          text-align: left;
        }

        .zaman-desktop-user__dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 220px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          box-shadow: 0 18px 40px rgba(15,23,42,0.12);
          padding: 0.5rem;
          z-index: 1200;
        }

        .zaman-desktop-user__dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          border: none;
          background: transparent;
          padding: 0.85rem 0.9rem;
          border-radius: 12px;
          color: #1f2937;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .zaman-desktop-user__dropdown-item:hover {
          background: rgba(0,0,0,0.05);
        }

        .zaman-desktop-user__dropdown-item.logout {
          color: #dc2626;
        }

        .zaman-desktop-user__dropdown-item.logout:hover {
          background: #fef2f2;
        }

        .zaman-drawer__profile {
          padding: 1rem 1.25rem 1.1rem;
          border-bottom: 1px solid var(--nav-border);
          background: rgba(255,255,255,0.45);
        }

        .zaman-drawer__profile-top {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .zaman-drawer__profile-avatar {
          width: 58px; height: 58px;
          border-radius: 999px;
          overflow: hidden;
          background: #111;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .zaman-drawer__profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .zaman-drawer__profile-info { min-width: 0; flex: 1; }
        .zaman-drawer__profile-info h3 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #111; }
        .zaman-drawer__profile-info p { margin: 0.2rem 0 0; font-size: 0.76rem; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .zaman-drawer__profile-info span { display: block; margin-top: 0.2rem; font-size: 0.72rem; color: #8a8a8a; }

        .zaman-drawer__profile-actions {
          display: flex;
          gap: 0.6rem;
          margin-top: 0.9rem;
        }

        .zaman-drawer__profile-actions a,
        .zaman-drawer__guest a {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .zaman-drawer__profile-actions a:first-child,
        .zaman-drawer__guest a { background: #111; color: #fff; }

        .zaman-drawer__profile-actions a:last-child {
          border: 1px solid var(--nav-border);
          color: var(--nav-text);
          background: transparent;
        }

        .zaman-drawer__guest h3 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #111; }
        .zaman-drawer__guest p { margin: 0.35rem 0 0.9rem; font-size: 0.76rem; color: #666; }

        .zaman-nav::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--nav-accent-light) 40%, var(--nav-accent) 60%, transparent 100%);
        }

        @media(min-width:1024px) {
          .zaman-desktop-user-wrap { display: block; }

          .zaman-login-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 38px;
            padding: 0 14px;
            border-radius: 999px;
            border: 1px solid var(--nav-border);
            text-decoration: none;
            color: var(--nav-text);
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-right: 0.35rem;
            transition: all 0.2s;
          }
          .zaman-login-btn:hover { background: #111; color: #fff; }
        }

        @media(max-width:480px){ .zaman-nav__inner { padding: 0 1rem; } }

        @media (max-width: 640px) {
          .zaman-search-result-item { grid-template-columns: 56px 1fr; }
          .zaman-search-result-item__right { grid-column: 2; align-items: flex-start; }
        }
      `}</style>

      <nav className={`zaman-nav${scrolled ? " scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <div className="zaman-nav__inner">
          <div className="zaman-nav__left">
            <button className="zaman-icon-btn zaman-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
              <MenuIcon />
            </button>

            <ul className="zaman-nav__links" role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={pathname === item.href ? "active" : ""}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/">
            <div style={{ height: "48px", display: "flex", alignItems: "center" }}>
              <Image
                src={logoUrl || "/bg-remove-logo.png"}
                alt="Logo"
                width={120}
                height={48}
                priority
                style={{
                  height: "100%",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          </Link>

          <div className="zaman-nav__actions">
            <button className={`zaman-icon-btn${searchOpen ? " active" : ""}`} onClick={() => setSearchOpen(true)} aria-label="Open search">
              <SearchIcon />
            </button>

            {/* <button
              className={`zaman-icon-btn wishlist${wishlistActive ? " active" : ""}`}
              onClick={() => setWishlistActive((w) => !w)}
              aria-label={wishlistActive ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlistActive}
            >
              <HeartIcon filled={wishlistActive} />
            </button> */}

            {isAdmin && (
              <Link href="/dashboard" className="zaman-admin-btn" title="Admin Dashboard">
                <AdminIcon />
              </Link>
            )}

            {isLoggedIn ? (
              <div className="zaman-desktop-user-wrap" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="zaman-desktop-user"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  aria-expanded={profileDropdownOpen}
                  aria-label="Open user menu"
                >
                  <div className="zaman-desktop-user__trigger">
                    <div className="zaman-desktop-user__avatar">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt={displayName} />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="zaman-desktop-user__info">
                      <p className="zaman-desktop-user__name">{displayName}</p>
                      <p className="zaman-desktop-user__meta">{user?.email}</p>
                    </div>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="zaman-desktop-user__dropdown">
                    <Link
                      href="/userDashboard"
                      className="zaman-desktop-user__dropdown-item"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <DashboardIcon />
                      <span>Dashboard</span>
                    </Link>

                    <button
                      type="button"
                      className="zaman-desktop-user__dropdown-item logout"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogoutIcon />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="zaman-login-btn">Login</Link>
            )}

            <Link href="/cart/my-cart">
              <button className="zaman-icon-btn" aria-label={`Shopping bag, ${cartCount} items`}>
                <BagIcon />
                {cartCount > 0 && (
                  <span className="zaman-cart-badge" aria-hidden="true">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className={`zaman-drawer-overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />

      <aside className={`zaman-drawer${menuOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="zaman-drawer__header">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image
              src={logoUrl || "/bg-remove-logo.png"}
              height={500}
              width={500}
              alt="Logo"
              priority
              style={{
                height: "75px",
                width: "auto",
                maxWidth: "110px",
                objectFit: "contain",
              }}
            />
          </Link>
          <button className="zaman-icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <div className="zaman-drawer__profile">
          {isLoggedIn ? (
            <>
              <div className="zaman-drawer__profile-top">
                <div className="zaman-drawer__profile-avatar">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={displayName} />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="zaman-drawer__profile-info">
                  <h3>{displayName}</h3>
                  <p>{user?.email || "No email"}</p>
                  <span>{user?.phone || "No phone added"}</span>
                </div>
              </div>
              <div className="zaman-drawer__profile-actions">
                <Link href="/userDashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/mobile-profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              </div>
            </>
          ) : (
            <div className="zaman-drawer__guest">
              <h3>Welcome</h3>
              <p>Login to see your profile information.</p>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login Now</Link>
            </div>
          )}
        </div>

        {isAdmin && (
          <Link href="/dashboard" className="zaman-drawer__admin-link" onClick={() => setMenuOpen(false)}>
            <AdminIcon />
            Admin Dashboard
          </Link>
        )}

        <nav className="zaman-drawer__nav">
          <ul role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={pathname === item.href ? "active" : ""} onClick={() => setMenuOpen(false)}>
                  {item.label}
                  <span className="arrow"><ArrowRightIcon /></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="zaman-drawer__footer">
          {isLoggedIn ? (
            <button
              className="zaman-drawer__footer-btn logout-btn"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
            >
              <LogoutIcon />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          ) : (
            <Link href="/login" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
              <button className="zaman-drawer__footer-btn" aria-label="Login">
                <span>Login</span>
              </button>
            </Link>
          )}

          <Link href={"/cart/my-cart"}>
            <button
              className="zaman-drawer__footer-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Cart"
            >
              <BagIcon />
              <span>Bag {cartCount > 0 && `(${cartCount})`}</span>
            </button>
          </Link>
        </div>
      </aside>

      <div
        className={`zaman-search-overlay${searchOpen ? " open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        role="dialog" aria-modal="true" aria-label="Search"
      >
        <div className="zaman-search-modal">
          <div className="zaman-search-modal__top">
            <SearchIcon />
            <input
              ref={searchInputRef}
              className="zaman-search-modal__input"
              type="search"
              placeholder="Search for products, collections…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearchSubmit();
                }
              }}
              aria-label="Search"
            />
            <button className="zaman-icon-btn" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <CloseIcon />
            </button>
          </div>

          <div className="zaman-search-body">
            {!trimmedQuery ? (
              <div className="zaman-search-modal__hint">
                <strong>Search for products, collections…</strong>
              </div>
            ) : (
              <div className="zaman-search-results">
                <div className="zaman-search-results__head">
                  <span>
                    {searchLoading || searchFetching
                      ? "Searching..."
                      : `${searchedProducts.length} result${searchedProducts.length === 1 ? "" : "s"} found`}
                  </span>
                </div>

                {searchLoading || searchFetching ? (
                  <div className="zaman-search-loading">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="zaman-search-skeleton" />
                    ))}
                  </div>
                ) : searchedProducts.length > 0 ? (
                  <div className="zaman-search-result-list">
                    {searchedProducts.map((product) => (
                      <button key={product.id} className="zaman-search-result-item" onClick={() => handleProductClick(product.slug)}>
                        <div className="zaman-search-result-item__image">
                          {product.productCardImage ? (
                            <Image src={product.productCardImage} alt={product.title} fill sizes="64px" style={{ objectFit: "cover" }} />
                          ) : (
                            <div className="zaman-search-result-item__fallback" />
                          )}
                        </div>
                        <div className="zaman-search-result-item__content">
                          <p className="zaman-search-result-item__title">{product.title}</p>
                          <p className="zaman-search-result-item__meta">{product.cardShortTitle || "Product"}</p>
                        </div>
                        <div className="zaman-search-result-item__right">
                          <span className="zaman-search-result-item__price">৳ {Number(product.price || 0).toLocaleString()}</span>
                          <span className="zaman-search-result-item__stock">{product.stock > 0 ? "In stock" : "Out of stock"}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="zaman-search-empty">
                    <p>No products found for &quot;{trimmedQuery}&quot;</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}