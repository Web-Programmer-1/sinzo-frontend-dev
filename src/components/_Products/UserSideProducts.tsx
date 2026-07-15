
"use client";

import { Suspense, useState, useRef, useEffect, useCallback, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { useGetAllCategories } from "../../Apis/category/queries";
import { useGetAllProducts } from "../../Apis/products/queries";

export default function UserSideProducts() {
  return (
    <Suspense fallback={null}>
      <ProductsPage />
    </Suspense>
  );
}

interface Category {
  id: string;
  title: string;
  thumbnailImage: string;
}
interface Product {
  id: string;
  slug: string;
  productCardImage: string;
  title: string;
  cardShortTitle: string;
  price: number;
  stock: number;
  totalReviews: number;
  badge?: "SALE" | "BEST_SELLER" | "LOW_STOCK" | "OUT_OF_STOCK" | "NEW" | null;
  category: { title: string; thumbnailImage: string };
}
interface Meta { page: number; limit: number; total: number; }
type TColorOption = { value: string; hex: string; border?: string; };

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const COLORS: TColorOption[] = [
  { value: "Black", hex: "#111111", border: "#111111" },
  { value: "White", hex: "#ffffff", border: "#d1d5db" },
  { value: "Blue", hex: "#2563eb", border: "#2563eb" },
  { value: "Red", hex: "#ef4444", border: "#ef4444" },
  { value: "Green", hex: "#22c55e", border: "#22c55e" },
  { value: "Grey", hex: "#9ca3af", border: "#9ca3af" },
  { value: "Brown", hex: "#8b5e3c", border: "#8b5e3c" },
  { value: "Navy", hex: "#1e3a8a", border: "#1e3a8a" },
];

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_high", label: "Price: High → Low" },
] as const;

const ALL_CAT_ID = "__all__";

function useFilters(searchParams: ReturnType<typeof useSearchParams>) {
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [size, setSize] = useState(searchParams.get("size") || "");
  const [color, setColor] = useState(searchParams.get("color") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const clearAll = useCallback(() => {
    setCategoryId(""); setMinPrice(""); setMaxPrice("");
    setSize(""); setColor(""); setSort(""); setPage(1);
  }, []);

  const params = {
    ...(categoryId && { categoryId }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(size && { size }),
    ...(color && { color }),
    ...(sort && { sort }),
    page,
    limit: 12,
  };

  const activeCount = [minPrice, maxPrice, size, color, sort].filter(Boolean).length;

  return {
    categoryId, setCategoryId,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    size, setSize,
    color, setColor,
    sort, setSort,
    page, setPage,
    clearAll, params, activeCount,
  };
}

function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = useFilters(searchParams);
  const {
    categoryId, setCategoryId,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    size, setSize,
    color, setColor,
    sort, setSort,
    page, setPage,
    clearAll, params, activeCount,
  } = filters;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState({ minPrice, maxPrice, size, color, sort });

  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
  const observerRef = useRef<HTMLDivElement>(null);

  const { data: catData } = useGetAllCategories();
  const { data: prodData, isLoading, isError, isFetching } = useGetAllProducts(params as any);

  const categories: Category[] = catData?.data ?? [];
  const meta: Meta             = prodData?.meta ?? { page: 1, limit: 12, total: 0 };
  const totalPages             = Math.ceil(meta.total / meta.limit);

  const activeCatName = categories.find((c) => c.id === categoryId)?.title;

  const currentParamsStr = JSON.stringify({
    categoryId,
    minPrice,
    maxPrice,
    size,
    color,
    sort,
  });

  useEffect(() => {
    setAccumulatedProducts([]);
    setPage(1);
  }, [currentParamsStr, setPage]);

  useEffect(() => {
    if (prodData?.data) {
      const newProducts = prodData.data as Product[];
      setAccumulatedProducts((prev) => {
        if (page === 1) {
          return newProducts;
        }
        const existingIds = new Set(prev.map((p) => p.id));
        const filtered = newProducts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });
    }
  }, [prodData, page]);

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [isLoading, isFetching, page, totalPages, setPage]);

  const handleCatSelect = useCallback((id: string) => {
    setCategoryId(id);
    setPage(1);
    router.push(id ? `/?categoryId=${id}` : "/");
  }, [setCategoryId, setPage, router]);

  const openDrawer = useCallback(() => {
    setDraft({ minPrice, maxPrice, size, color, sort });
    setDrawerOpen(true);
  }, [minPrice, maxPrice, size, color, sort]);

  const applyDraft = useCallback(() => {
    setMinPrice(draft.minPrice);
    setMaxPrice(draft.maxPrice);
    setSize(draft.size);
    setColor(draft.color);
    setSort(draft.sort);
    setPage(1);
    setDrawerOpen(false);
  }, [draft, setMinPrice, setMaxPrice, setSize, setColor, setSort, setPage]);

  const handleClearAll = useCallback(() => {
    clearAll();
    setDrawerOpen(false);
    router.push("/");
  }, [clearAll, router]);

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {}
      <div className="pp-mobile-cat">
        <CategorySlider
          categories={categories}
          activeCatId={categoryId}
          onSelect={handleCatSelect}
          showAllCard
        />
      </div>

      <div className="pp-root">
        {}
        <aside className="pp-sidebar">
          <p className="sidebar-title">Filters</p>
          <FilterPanel
            categories={categories}
            categoryId={categoryId}
            minPrice={minPrice}
            maxPrice={maxPrice}
            size={size}
            color={color}
            sort={sort}
            onCategorySelect={handleCatSelect}
            onChange={(key, val) => {
              const map: Record<string, (v: string) => void> = {
                sort: setSort, size: setSize, color: setColor,
                minPrice: setMinPrice, maxPrice: setMaxPrice,
              };
              map[key]?.(val);
              setPage(1);
            }}
            onClear={handleClearAll}
          />
        </aside>

        {}
        <main className="pp-main">
          {}
          <div className="pp-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="pp-mobile-filter-btn filter-btn" onClick={openDrawer}>
                <FilterIcon />
                Filters{activeCount > 0 && <span className="count-dot">{activeCount}</span>}
              </button>
              <p className="result-text">
                <b>{meta.total}</b> {meta.total === 1 ? "product" : "products"}
                {activeCatName && <> in <b>{activeCatName}</b></>}
              </p>
            </div>
            <div className="pp-desktop-sort">
              <span style={{ fontSize: 13, color: "#888" }}>Sort:</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="sort-select"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {}
          {activeCount > 0 && (
            <div className="active-chips">
              {minPrice && <Tag label={`Min ৳${minPrice}`} onX={() => setMinPrice("")} />}
              {maxPrice && <Tag label={`Max ৳${maxPrice}`} onX={() => setMaxPrice("")} />}
              {size && <Tag label={`Size: ${size}`} onX={() => setSize("")} />}
              {color && <Tag label={`Color: ${color}`} onX={() => setColor("")} />}
              {sort && <Tag label={SORT_OPTIONS.find((o) => o.value === sort)?.label || sort} onX={() => setSort("")} />}
            </div>
          )}

          {}
          {isLoading && page === 1 ? (
            <div className="pp-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isError ? (
            <EmptyState text="Failed to load products." />
          ) : accumulatedProducts.length === 0 ? (
            <EmptyState text="No products found.">
              <button className="clear-btn" onClick={handleClearAll}>Clear Filters</button>
            </EmptyState>
          ) : (
            <>
              <div className="pp-grid">
                {accumulatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>

              <div ref={observerRef} className="infinite-scroll-trigger">
                {isFetching && page > 1 && (
                  <div className="infinite-scroll-loader">
                    <span className="spinner"></span>
                    <p>Loading more products...</p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {}
      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <p className="sidebar-title">Filters</p>
              <button className="drawer-x" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>
            <div className="drawer-body">
              <FilterPanel
                isDraft
                categories={categories}
                categoryId={categoryId}
                minPrice={draft.minPrice}
                maxPrice={draft.maxPrice}
                size={draft.size}
                color={draft.color}
                sort={draft.sort}
                onCategorySelect={handleCatSelect}
                onChange={(key, val) => setDraft((d) => ({ ...d, [key]: val }))}
                onClear={handleClearAll}
                onApply={applyDraft}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const FilterPanel = memo(function FilterPanel({
  isDraft = false,
  categories,
  categoryId,
  minPrice, maxPrice, size, color, sort,
  onCategorySelect,
  onChange,
  onClear,
  onApply,
}: {
  isDraft?: boolean;
  categories: Category[];
  categoryId: string;
  minPrice: string; maxPrice: string;
  size: string; color: string; sort: string;
  onCategorySelect: (id: string) => void;
  onChange: (key: string, val: string) => void;
  onClear: () => void;
  onApply?: () => void;
}) {
  return (
    <div className="filter-body">
      {}
      <div className="filter-section">
        <CatBtn active={!categoryId} onClick={() => onCategorySelect("")}>All Products</CatBtn>
        {categories.map((c) => (
          <CatBtn key={c.id} active={categoryId === c.id} onClick={() => onCategorySelect(c.id)}>
            {c.title}
          </CatBtn>
        ))}
      </div>

      {}
      <div className="filter-section">
        <p className="filter-label">Sort By</p>
        {SORT_OPTIONS.map((o) => (
          <CatBtn key={o.value} active={sort === o.value} onClick={() => onChange("sort", o.value)}>
            {o.label}
          </CatBtn>
        ))}
      </div>

      {}
      <div className="filter-section">
        <p className="filter-label">Price Range (৳)</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number" placeholder="Min" value={minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="price-input"
          />
          <input
            type="number" placeholder="Max" value={maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="price-input"
          />
        </div>
      </div>

      {}
      <div className="filter-section">
        <p className="filter-label">Size</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SIZES.map((s) => (
            <Chip key={s} active={size === s} onClick={() => onChange("size", size === s ? "" : s)}>{s}</Chip>
          ))}
        </div>
      </div>

      {}
      <div className="filter-section">
        <p className="filter-label">Color</p>
        <div className="color-wrap">
          {COLORS.map((c) => (
            <ColorSwatch
              key={c.value}
              color={c}
              active={color === c.value}
              onClick={() => onChange("color", color === c.value ? "" : c.value)}
            />
          ))}
        </div>
      </div>

      {isDraft && onApply && (
        <button className="apply-btn" onClick={onApply}>Apply Filters</button>
      )}
      <button className="clear-btn" onClick={onClear}>Clear All</button>
    </div>
  );
});

const CategorySlider = memo(function CategorySlider({
  categories, activeCatId, onSelect, showAllCard = false,
}: {
  categories: Category[];
  activeCatId: string;
  onSelect: (id: string) => void;
  showAllCard?: boolean;
}) {
  const allCard: Category = { id: ALL_CAT_ID, title: "All Products", thumbnailImage: "" };
  const items = showAllCard ? [allCard, ...categories] : categories;
  const total = items.length;

  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const moved = useRef(false);

  const CARD_W = 105, GAP = 8;

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(i, total - 1)));
    setOffset(0);
  }, [total]);

  const next = useCallback(() => goTo(index + 1 < total ? index + 1 : 0), [goTo, index, total]);
  const prev = useCallback(() => goTo(index - 1 >= 0 ? index - 1 : total - 1), [goTo, index, total]);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 2800);
  }, [next]);

  useEffect(() => {
    if (total < 2) return;
    startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [startAuto, total]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    startX.current = e.clientX;
    setOffset(0);
    if (autoRef.current) clearInterval(autoRef.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const d = e.clientX - startX.current;
    if (Math.abs(d) > 5) moved.current = true;
    setOffset(d);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setOffset((prev) => {
      if (prev < -45) next();
      else if (prev > 45) prev_fn();
      return 0;
    });
    startAuto();

  }, [next, prev, startAuto]);

  const prev_fn = prev;

  const handleCardClick = useCallback((cat: Category) => {
    if (moved.current) return;
    if (cat.id === ALL_CAT_ID) { onSelect(""); return; }
    onSelect(activeCatId === cat.id ? "" : cat.id);
  }, [activeCatId, onSelect]);

  const translateX = -(index * (CARD_W + GAP)) + offset;

  return (
    <section className="sl-section">
      <div className="sl-header">
        <h2 className="sl-title">Shop by Category</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="sl-btn" onClick={() => { prev(); startAuto(); }}>‹</button>
          <button className="sl-btn" onClick={() => { next(); startAuto(); }}>›</button>
        </div>
      </div>

      <div className="sl-viewport">
        <div
          className="sl-track"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: dragging.current ? "none" : "transform 0.42s cubic-bezier(0.25,0.8,0.25,1)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {items.map((cat) => {
            const isActive = cat.id === ALL_CAT_ID ? activeCatId === "" : activeCatId === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat)}
                className="sl-card"
                style={{ width: CARD_W, outline: isActive ? "2.5px solid #111" : "none", outlineOffset: 2 }}
              >
                {cat.id === ALL_CAT_ID ? (
                  <div className="sl-img-wrap" style={{ background: isActive ? "#111" : "#e8e8e8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? "#fff" : "#666"} strokeWidth="1.8">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    <span className="sl-all-label" style={{ color: isActive ? "#fff" : "#444" }}>All Products</span>
                  </div>
                ) : (
                  <div className="sl-img-wrap">
                    {cat.thumbnailImage ? (
                      <Image src={cat.thumbnailImage} alt={cat.title} fill sizes="100px" style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="sl-img-fallback" />
                    )}
                    <div className="sl-overlay-top" />
                    <div className="sl-overlay-bottom" />
                    <p className="sl-card-label">{cat.title}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="sl-dots">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); startAuto(); }}
            className={`sl-dot${i === index ? " sl-dot-active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
});

const ProductCard = memo(function ProductCard({
  product, index,
}: {
  product: Product;
  index: number;
}) {
  const [hov, setHov] = useState(false);
  const soldOut = product.stock === 0;
  const router  = useRouter();

  const handleDetailsNavigate = useCallback(() => router.push(`/product/${product.slug}`), [router, product.slug]);

  const showSale = product.badge === "SALE";
  const originalPrice = showSale ? Math.round((product.price * 1.15) / 100) * 100 : null;

  const formatBadge = (badge: string) => {
    if (badge === "BEST_SELLER") return "Best Seller";
    if (badge === "LOW_STOCK") return "Low Stock";
    if (badge === "OUT_OF_STOCK") return "Out of Stock";
    return badge.charAt(0).toUpperCase() + badge.slice(1).toLowerCase();
  };

  return (
    <div
      className="pp-card"
      style={{ animationDelay: `${index * 45}ms` }}
      onClick={handleDetailsNavigate}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="card-img-wrap">
        {product.badge && (
          <div className="card-badge">
            {formatBadge(product.badge)}
          </div>
        )}
        {product.productCardImage ? (
          <Image
            src={product.productCardImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="card-img"
          />
        ) : (
          <div className="card-img-fallback">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {soldOut && <div className="card-dim-overlay" />}
        <div className="card-hover-overlay">
          <span>SHOW DETAILS</span>
        </div>
      </div>

      <div className="card-info">
        <p className="card-title">{product.title}</p>
        {product.category?.title && (
          <span className="card-cat-tag">{product.category.title}</span>
        )}
        <div className="card-price-row">
          {showSale && originalPrice && (
            <span className="card-price-original">Tk {originalPrice.toLocaleString()}</span>
          )}
          <span className="card-price">Tk {product.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
});

const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const CatBtn = memo(({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`cat-btn${active ? " cat-btn-active" : ""}`}>{children}</button>
));
CatBtn.displayName = "CatBtn";

const Chip = memo(({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`chip${active ? " chip-active" : ""}`}>{children}</button>
));
Chip.displayName = "Chip";

const ColorSwatch = memo(({ color, active, onClick }: { color: TColorOption; active: boolean; onClick: () => void }) => {
  const isLight = color.value === "White" || color.value === "Grey";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={color.value}
      title={color.value}
      className="color-swatch"
      style={{
        background: color.hex,
        border: `1.5px solid ${color.border || color.hex}`,
        boxShadow: active ? "0 0 0 2px #111, 0 0 0 5px rgba(17,17,17,0.12)" : color.value === "White" ? "inset 0 0 0 1px #e5e7eb" : "none",
        transform: active ? "scale(1.06)" : "scale(1)",
      }}
    >
      {active && <span style={{ color: isLight ? "#111" : "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
    </button>
  );
});
ColorSwatch.displayName = "ColorSwatch";

const Tag = memo(({ label, onX }: { label: string; onX: () => void }) => (
  <span className="filter-tag">
    {label}
    <button onClick={onX} className="tag-x">✕</button>
  </span>
));
Tag.displayName = "Tag";

const EmptyState = ({ text, children }: { text: string; children?: React.ReactNode }) => (
  <div className="empty-state">
    <p className="empty-text">{text}</p>
    {children}
  </div>
);

const SkeletonCard = () => (
  <div className="pp-card" style={{ overflow: "hidden", animation: "none" }}>
    <div className="sk-base" style={{ aspectRatio: "3/4" }} />
    <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
      <div className="sk-base" style={{ height: 11, width: "45%", borderRadius: 4 }} />
      <div className="sk-base" style={{ height: 13, width: "80%", borderRadius: 4 }} />
      <div className="sk-base" style={{ height: 13, width: "35%", borderRadius: 4 }} />
    </div>
  </div>
);

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  @keyframes fadeUp       { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmerAnim  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .pp-mobile-cat { display: block; }
  .pp-root {
    display: flex; gap: 24px;
    padding: 16px 20px 32px;
    max-width: 1400px; margin: 0 auto;
    background: #f6f6f4; min-height: 60vh;
    font-family: 'DM Sans', sans-serif;
  }
  .pp-sidebar { width: 220px; flex-shrink: 0; display: block; }
  .pp-main    { flex: 1; min-width: 0; }
  .pp-topbar  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }

  .pp-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
  @media (min-width: 640px)  { .pp-grid { grid-template-columns: repeat(2,1fr); gap: 14px; } }
  @media (min-width: 1024px) { .pp-grid { grid-template-columns: repeat(3,1fr); gap: 20px; } }

  .pp-card {
    background: transparent;
    border: 1.5px solid transparent;
    border-radius: 20px;
    padding: 4px;
    overflow: hidden;
    transition: border-color 0.25s ease;
    animation: fadeUp .35s ease both;
    cursor: pointer;
    position: relative;
  }
  .pp-card:hover {
    border-color: #111;
  }
  .card-img-wrap { position: relative; aspect-ratio: 1/1.25; overflow: hidden; background: #fff; border-radius: 16px; }
  .card-img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; border-radius: 16px; }
  .card-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f5f5f5; border-radius: 16px; }
  .card-dim-overlay  { position:absolute; inset:0; background:rgba(255,255,255,0.35); z-index: 2; border-radius: 16px; }
  .card-badge {
    position: absolute;
    top: 6px;
    left: 6px;
    background: rgba(0, 0, 0, 0.65);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 500;
    padding: 5px 14px;
    border-radius: 20px;
    letter-spacing: 0.02em;
    z-index: 3;
    backdrop-filter: blur(4px);
  }
  .card-hover-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.25s ease;
    z-index: 4;
    border-radius: 16px;
  }
  .pp-card:hover .card-hover-overlay {
    opacity: 1;
  }
  .card-hover-overlay span {
    color: #000;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: 1.5px solid #000;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.9);
    transition: background 0.25s ease, color 0.25s ease;
  }
  .card-hover-overlay span:hover {
    background: #000;
    color: #fff;
  }
  .card-info {
    padding: 12px 4px 4px;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    height: 105px;
  }
  .card-title {
    margin: 0 0 4px;
    font-size: 0.95rem;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.01em;
    line-height: 1.35;
    height: 2.6rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .card-cat-tag {
    display: inline-block;
    font-size: 0.78rem;
    font-weight: 400;
    color: #888;
    margin-bottom: 6px;
    height: 1.1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .card-price-row {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    gap: 8px;
    margin-top: auto;
    width: 100%;
  }
  .card-price {
    font-weight: 700;
    font-size: 1.05rem;
    color: #111;
    white-space: nowrap;
  }
  .card-price-original {
    font-size: 0.88rem;
    color: #999;
    text-decoration: line-through;
    white-space: nowrap;
  }

  .sidebar-title { font-weight:700; font-size:1rem; color:#111; margin:0 0 14px; }
  .filter-body   { display:flex; flex-direction:column; gap:0; }
  .filter-section { border-bottom:1px solid #ebebeb; padding-bottom:14px; margin-bottom:14px; }
  .filter-label  { font-size:0.67rem; font-weight:700; letter-spacing:0.08em; color:#999; margin:0 0 8px; }
  .cat-btn { display:block; width:100%; text-align:left; background:none; border:none; padding:7px 10px; font-size:0.85rem; color:#444; cursor:pointer; border-radius:8px; margin-bottom:2px; transition:all 0.15s; }
  .cat-btn-active { background:#111; color:#fff; font-weight:500; }
  .chip        { padding:4px 10px; border:1.5px solid #e0e0e0; border-radius:20px; font-size:0.75rem; background:#fff; color:#444; cursor:pointer; transition:all 0.15s; }
  .chip-active { background:#111; color:#fff; border:1.5px solid #111; }
  .price-input { flex:1; padding:7px 10px; border:1.5px solid #e0e0e0; border-radius:8px; font-size:0.8rem; outline:none; background:#fff; color:#111; min-width:0; }
  .color-wrap  { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
  .color-swatch { width:28px; height:28px; min-width:28px; border-radius:50%; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:all 0.18s ease; padding:0; outline:none; background-clip:padding-box; }
  .apply-btn { width:100%; padding:10px; background:#111; color:#fff; border:none; border-radius:10px; font-family:'Syne',sans-serif; font-weight:700; font-size:0.85rem; cursor:pointer; margin-bottom:8px; }
  .clear-btn  { width:100%; padding:9px; background:transparent; color:#999; border:1.5px solid #e0e0e0; border-radius:10px; font-size:0.82rem; cursor:pointer; }

  .filter-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; background:#111; color:#fff; border:none; border-radius:10px; font-size:0.82rem; font-family:'Syne',sans-serif; font-weight:600; cursor:pointer; }
  .count-dot  { display:inline-flex; align-items:center; justify-content:center; width:17px; height:17px; background:#e53e3e; color:#fff; border-radius:50%; font-size:0.62rem; font-weight:700; }
  .result-text { font-size:0.88rem; color:#555; margin:0; }
  .sort-select { padding:7px 12px; border:1.5px solid #e0e0e0; border-radius:8px; font-size:0.82rem; background:#fff; color:#111; cursor:pointer; outline:none; }

  .active-chips { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
  .filter-tag  { display:inline-flex; align-items:center; gap:5px; padding:4px 10px 4px 12px; background:#111; color:#fff; border-radius:20px; font-size:0.73rem; }
  .tag-x       { background:none; border:none; color:#fff; cursor:pointer; font-size:0.62rem; padding:0; opacity:0.7; }

  .infinite-scroll-trigger { display: flex; justify-content: center; align-items: center; padding: 24px 0; min-height: 50px; width: 100%; }
  .infinite-scroll-loader  { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #666; font-size: 0.85rem; }
  .spinner { width: 28px; height: 28px; border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #111; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .drawer-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.46); z-index:1000; display:flex; align-items:flex-end; }
  .drawer      { width:100%; max-height:88vh; background:#fff; border-radius:20px 20px 0 0; display:flex; flex-direction:column; }
  .drawer-head { display:flex; align-items:center; justify-content:space-between; padding:18px 18px 12px; border-bottom:1px solid #f0f0f0; }
  .drawer-body { overflow-y:auto; flex:1; padding:0 18px 24px; }
  .drawer-x    { background:none; border:none; font-size:1.1rem; color:#555; cursor:pointer; padding:4px; }

  .empty-state { display:flex; flex-direction:column; align-items:center; padding:56px 20px; gap:10px; text-align:center; }
  .empty-text  { font-family:'Syne',sans-serif; font-weight:700; color:#333; margin:0; }

  .sk-base { background:linear-gradient(90deg,#f0f0f0 25%,#e6e6e6 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmerAnim 1.4s infinite; border-radius:0; }

  .sl-section  { padding:16px 16px 8px; user-select:none; -webkit-user-select:none; background:#f6f6f4; }
  .sl-header   { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .sl-title    { font-family:var(--font-roboto); font-size:1.2rem; font-weight:700; margin:0; color:#111; width:100%; }
  .sl-btn      { width:30px; height:30px; border-radius:50%; border:1.5px solid #e0e0e0; background:#fff; color:#222; font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .sl-viewport { overflow:hidden; cursor:grab; touch-action:pan-y; }
  .sl-track    { display:flex; gap:8px; will-change:transform; }
  .sl-card     { border-radius:10px; overflow:hidden; position:relative; background:#f0f0f0; flex-shrink:0; transition:transform 0.3s ease, box-shadow 0.3s ease, outline 0.15s ease; cursor:pointer; }
  .sl-img-wrap { position:relative; width:100%; aspect-ratio:1/1.15; overflow:hidden; }
  .sl-img-fallback { width:100%; height:100%; background:#ddd; }
  .sl-overlay-top    { position:absolute; inset:0; background:linear-gradient(160deg,rgba(0,0,0,0.18) 0%,rgba(0,0,0,0) 45%); pointer-events:none; }
  .sl-overlay-bottom { position:absolute; left:0; right:0; bottom:0; height:55%; background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.3) 55%,rgba(0,0,0,0) 100%); pointer-events:none; }
  .sl-card-label { position:absolute; bottom:8px; left:0; right:0; margin:0; padding:0 8px; font-family:'Syne',sans-serif; font-size:0.75rem; font-weight:700; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,0.5); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sl-all-label  { font-family:'Syne',sans-serif; font-size:0.72rem; font-weight:700; text-align:center; padding:0 4px; }
  .sl-dots       { display:flex; gap:6px; justify-content:center; margin-top:12px; }
  .sl-dot        { width:7px; height:7px; border-radius:50%; border:none; cursor:pointer; padding:0; transition:all 0.25s; background:#d4d4d4; transform:scale(1); }
  .sl-dot-active { background:#111; transform:scale(1.45); }

  .pp-mobile-filter-btn { display: none !important; }
  .pp-desktop-sort      { display: flex; align-items: center; gap: 8px; }

  @media (max-width: 860px) {
    .pp-mobile-cat        { display: block; }
    .pp-sidebar           { display: none !important; }
    .pp-mobile-filter-btn { display: flex !important; }
    .pp-desktop-sort      { display: none !important; }
    .card-badge {
      top: 4px;
      left: 4px;
      font-size: 0.62rem;
      padding: 3px 8px;
    }
    .card-price-row {
      gap: 5px;
    }
    .card-price {
      font-size: 0.85rem;
    }
    .card-price-original {
      font-size: 0.72rem;
    }
  }
  @media (min-width: 861px) {
    .pp-mobile-cat { display: none; }
  }
`;