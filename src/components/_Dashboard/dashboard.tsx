"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLogoutUser } from "../../Apis/user/mutations";
import { toast } from "sonner";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────
type DropdownItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

type NavItemType = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  Menu: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Products: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Category: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h8M4 18h8" />
    </svg>
  ),
  Orders: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Customers: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Analytics: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),

  Payment: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      {/* Card body */}
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2"
        ry="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Card top stripe */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 10h20"
      />

      {/* Chip / small detail */}
      <rect
        x="6"
        y="13"
        width="4"
        height="2"
        rx="1"
      />
    </svg>
  ),



  Bell: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),


  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A11.955 11.955 0 0112 15c2.5 0 4.824.765 6.879 2.072M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2 9 9 0 1118 0 2 2 0 01-2 2z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 20H6a2 2 0 01-2-2V6a2 2 0 012-2h7" />
    </svg>
  ),





  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  List: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
};

// ── Nav Config — শুধু এখানে href বদলালেই হবে ─────────────────────────────────
const NAV_ITEMS: NavItemType[] = [
  {
    icon: <Icon.Dashboard />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: <Icon.Products />,
    label: "Products",
    dropdown: [
      {
        label: "Create Product",
        icon: <Icon.Plus />,
        href: "/dashboard/product/create",
      },
      {
        label: "All Products List",
        icon: <Icon.List />,
        href: "/dashboard/product/view-product",
      },
    ],
  },
  {
    icon: <Icon.Category />,
    label: "Category",
    dropdown: [
      { label: "Create Category", icon: <Icon.Plus />, href: "/dashboard/category/create" },
      { label: "All Category List", icon: <Icon.List />, href: "/dashboard/category/category-list" },
    ],
  },
  {
    icon: <Icon.Orders />,
    label: "Orders",
    href: "/dashboard/order",
  },


  {
    icon: <Icon.List />,
    label: "Steadfast",
      href: "/dashboard/steadfast/list",

  },


  {
    icon: <Icon.Customers />,
    label: "Customers",
    href: "/dashboard/customars",
  },
  {
    icon: <Icon.Analytics />,
    label: "checkoutdraf",
    href: "/dashboard/checkoutdraf",
  },
  {
    icon: <Icon.Payment />,
    label: "Online Payment",
    href: "/dashboard/payment",
  },
  {
    icon: <Icon.Settings />,
    label: "Settings",
    dropdown: [
      {
        label: "Logo",
        icon: <Icon.List />,
        href: "/dashboard/settings/logo",
      },
      {
        label: "Banners",
        icon: <Icon.List />,
        href: "/dashboard/settings/banners",
      },
      {
        label: "Payment Setting",
        icon: <Icon.List />,
        href: "/dashboard/settings/paymentSetting",
      },
    ],
  },
];

// ── Page Title Map ─────────────────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/products": "Products",
  "/dashboard/category/create": "Create Category",
  "/dashboard/category": "Category List",
  "/dashboard/orders": "Orders",
  "/dashboard/customers": "Customers",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

// ── NavItem Component ─────────────────────────────────────────────────────────
interface NavItemProps {
  item: NavItemType;
  collapsed: boolean;
  onClose?: () => void;
}

function NavItem({ item, collapsed, onClose }: NavItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = item.href
    ? pathname === item.href
    : item.dropdown?.some((d) => pathname === d.href) ?? false;

  const base = "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200";
  const active = "bg-black text-white shadow-lg shadow-gray-400";
  const inactive = "text-black hover:bg-slate-100 hover:text-slate-800";

  // Dropdown variant
  if (item.dropdown) {
    return (
      <div>
        <button
          onClick={() => !collapsed && setOpen((o) => !o)}
          title={collapsed ? item.label : undefined}
          className={`${base} ${isActive ? active : inactive} ${collapsed ? "justify-center" : "justify-between"}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </div>
          {!collapsed && (
            <span className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
              <Icon.ChevronDown />
            </span>
          )}
        </button>

        {!collapsed && open && (
          <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-violet-100 pl-3">
            {item.dropdown.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                onClick={onClose}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${pathname === d.href
                    ? "bg-gray-200 shadow-lg border-2 border-black/5 text-black"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
              >
                {d.icon}
                {d.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular Link variant
  return (
    <Link
      href={item.href!}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={`${base} ${isActive ? active : inactive} ${collapsed ? "justify-center" : ""}`}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

interface SidebarProps {
  collapsed: boolean;
  mobile?: boolean;
  onClose?: () => void;
  user?: {
    name?: string | null;
    fullName?: string | null;
    email?: string | null;
    profileImage?: string | null;
  };
}

function Sidebar({ collapsed, mobile = false, onClose, user }: SidebarProps) {
  const isCollapsed = collapsed && !mobile;

  const displayName = user?.fullName || user?.name || "User";
  const displayEmail = user?.email || "";
  const profileImage = user?.profileImage || "";
  const fallbackLetter = displayName.charAt(0).toUpperCase() || "U";

  return (
    <aside
      className={`flex flex-col bg-white border-r border-slate-100 h-full transition-all duration-300
        ${mobile ? "w-64" : isCollapsed ? "w-16" : "w-60"}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 h-16 px-4 border-b border-slate-100 flex-shrink-0 ${isCollapsed ? "justify-center" : ""}`}>


                  <Link 
          href={"/"}
          >
          
                      <Image 
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
            src={"/bg-remove-logo.png"}
            >


            </Image>
          </Link>
   


        {mobile && (
          <button onClick={onClose} className="ml-auto p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <Icon.X />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            collapsed={isCollapsed}
            onClose={mobile ? onClose : undefined}
          />
        ))}
      </nav>

      <div className={`border-t border-slate-100 p-3 flex-shrink-0 ${isCollapsed ? "flex justify-center" : ""}`}>
        {isCollapsed ? (
          profileImage ? (
            <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-slate-200">
              <Image
                src={profileImage}
                alt={displayName}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">
              {fallbackLetter}
            </div>
          )
        ) : (
          <div className="flex items-center gap-2.5 px-1">
            {profileImage ? (
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-slate-200">
                <Image
                  src={profileImage}
                  alt={displayName}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {fallbackLetter}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Topbar Component ──────────────────────────────────────────────────────────
interface TopbarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobile: () => void;
}

function Topbar({ collapsed, onToggleSidebar, onOpenMobile }: TopbarProps) {
  const pathname = usePathname();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutUser();
  const router = useRouter();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setProfileOpen(false);
        toast.success("Logout successful");
        router.push("/login");
      },
      onError: () => {
        toast.error("Logout failed");
      },
    });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm">
      <button
        onClick={onOpenMobile}
        className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
      >
        <Icon.Menu />
      </button>

      <button
        onClick={onToggleSidebar}
        className="hidden md:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition items-center justify-center"
      >
        {collapsed ? <Icon.Menu /> : <Icon.X />}
      </button>

      <h1 className="font-bold text-slate-800 text-base flex-1 truncate">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition">
          <Icon.Bell />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-sm hover:scale-[1.03] transition"
          >
            A
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">The Admin Profile</p>
              </div>

              <div className="p-2">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Icon.User />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon.Logout />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
// ── Dashboard Layout ──────────────────────────────────────────────────────────
export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar collapsed={collapsed} mobile={false} />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 h-full">
            <Sidebar collapsed={false} mobile={true} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          onOpenMobile={() => setMobileOpen(true)}
        />

        {/* ✅ Page content এখানে render হবে */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

    </div>
  );
}