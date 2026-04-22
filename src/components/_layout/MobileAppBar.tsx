
"use client";

import { useState, useEffect, useRef } from "react";
import { useGetMyCart } from "../../Apis/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TabId = "home" | "shop" | "favorites" | "cart" | "profile";

interface MobileNavProps {
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}


const tabs: { id: TabId; label: string; icon: (active: boolean) => any }[] = [
{
  id: "home",
  label: "Home",
  icon: (active) => (
    
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "#111" : "none"}
      stroke="#111"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path
        d="M9 21V12h6v9"
        fill={active ? "#fff" : "none"}
        stroke="#111"
        strokeWidth="1.8"
      />
    </svg>
  ),
},
  {
    id: "shop",
    label: "Shop",
    icon: (active) => (
      <Link href={"/product"}>
      
            <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "#111" : "none"}
        stroke="#111"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" fill="none" />
      </svg>
      </Link>
    ),
  },
  {
    id: "favorites",
    label: "Favorites",
    icon: (active) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "#111" : "none"}
        stroke="#111"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: "cart",
    label: "Cart",
    icon: (active) => (
       <Link href={"/cart/my-cart"}>
             <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "#111" : "none"}
        stroke="#111"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" fill="#111" />
        <circle cx="20" cy="21" r="1" fill="#111" />
        <path
          d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
          fill="none"
        />
      </svg>
       </Link>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (active) => (
     <Link href={"/mobile-profile"}>

           <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "#111" : "none"}
        stroke="#111"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" fill={active ? "#111" : "none"} />
      </svg>
     
     </Link>
    ),
  },
];

export default function MobileNav({

  
  activeTab = "home",
  onTabChange,
}: MobileNavProps) {

  const router = useRouter();
  const [active, setActive] = useState<TabId>(activeTab);
  const [cartBounce, setCartBounce] = useState(false);
  const [ripple, setRipple] = useState<{ id: TabId; key: number } | null>(null);

  const prevCart = useRef(0);
  const rippleKey = useRef(0);

  const { data: cartData } = useGetMyCart();

  const cartCount =
    cartData?.data?.items?.length ??
    cartData?.data?.cartItems?.length ??
    0;

  useEffect(() => {
    setActive(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (cartCount !== prevCart.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 650);
      prevCart.current = cartCount;
      return () => clearTimeout(t);
    }
  }, [cartCount]);



  const handleTab = (id: TabId) => {
    setActive(id);
    onTabChange?.(id);
    rippleKey.current++;
    setRipple({ id, key: rippleKey.current });

      if (id === "home") {
    router.push("/");
  }
    setTimeout(() => setRipple(null), 500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

        .sinzo-mobile-nav {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          z-index: 999;
          background: #fff;
          border-top: 1.5px solid #111;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        @media (min-width: 1024px) {
          .sinzo-mobile-nav { display: none; }
        }

        .sinzo-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 10px 0;
          border: none;
          background: transparent;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.15s;
          height: 60px;
          min-height: 60px;
          max-height: 60px;
          -webkit-tap-highlight-color: transparent;
        }

        .sinzo-tab:active { background: #f0f0f0; }

        .sinzo-tab-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
        }

        .sinzo-tab.is-active .sinzo-tab-icon {
          transform: translateY(-3px) scale(1.08);
        }

        .sinzo-tab-label {
          font-size: 0.68rem;
          font-weight: 500;
          color: #aaa;
          letter-spacing: 0.03em;
          transition: color 0.2s;
          line-height: 1;
        }

        .sinzo-tab.is-active .sinzo-tab-label {
          color: #111;
          font-weight: 600;
        }

        .sinzo-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 32px;
          height: 2px;
          background: #111;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
        }

        .sinzo-tab.is-active::before {
          transform: translateX(-50%) scaleX(1);
        }

        .sinzo-ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(0,0,0,0.08);
          width: 60px;
          height: 60px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: sinzoRipple 0.45s ease-out forwards;
          pointer-events: none;
        }

        @keyframes sinzoRipple {
          to { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }

        .sinzo-cart-badge {
          position: absolute;
          top: -2px;
          right: -4px;
          min-width: 17px;
          height: 17px;
          background: #111;
          color: #fff;
          font-size: 0.62rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          border: 1.5px solid #fff;
          line-height: 1;
          padding: 0 3px;
          pointer-events: none;
        }

        @keyframes cartPop {
          0%   { transform: translateY(-3px) scale(1.08); }
          25%  { transform: translateY(-6px) scale(1.2) rotate(-10deg); }
          55%  { transform: translateY(-2px) scale(0.95) rotate(6deg); }
          80%  { transform: translateY(-4px) scale(1.05) rotate(-3deg); }
          100% { transform: translateY(-3px) scale(1.08); }
        }

        .sinzo-tab.is-active.cart-bounce .sinzo-tab-icon {
          animation: cartPop 0.6s cubic-bezier(.36,.07,.19,.97);
        }

        @keyframes cartPopIdle {
          0%   { transform: scale(1); }
          25%  { transform: scale(1.25) rotate(-10deg); }
          55%  { transform: scale(0.92) rotate(6deg); }
          80%  { transform: scale(1.08) rotate(-3deg); }
          100% { transform: scale(1); }
        }

        .sinzo-tab:not(.is-active).cart-bounce .sinzo-tab-icon {
          animation: cartPopIdle 0.6s cubic-bezier(.36,.07,.19,.97);
        }
      `}</style>

      <nav
        className="sinzo-mobile-nav"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const isCartBouncing = tab.id === "cart" && cartBounce;

          return (
            <button
              key={tab.id}
              type="button"
              className={`sinzo-tab${isActive ? " is-active" : ""}${isCartBouncing ? " cart-bounce" : ""}`}
              onClick={() => handleTab(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {ripple?.id === tab.id && (
                <span
                  key={ripple.key}
                  className="sinzo-ripple"
                  aria-hidden="true"
                />
              )}

              <span className="sinzo-tab-icon">
                {tab.icon(isActive)}

                {tab.id === "cart" && cartCount > 0 && (
                  <span
                    className="sinzo-cart-badge"
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </span>

              <span className="sinzo-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );


  



}





