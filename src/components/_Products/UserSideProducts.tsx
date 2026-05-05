// "use client";

// import { Suspense, useState, useRef, useEffect, useCallback } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// import { useGetAllCategories } from "../../Apis/category/queries";
// import { useGetAllProducts } from "../../Apis/products/queries";
// import Image from "next/image";
// import { useAddToCart, useGetMyCart } from "../../Apis/cart";

// import { toast } from "sonner";

// export default function UserSideProducts() {
//   return (
//     <Suspense fallback={null}>
//       <ProductsPage />
//     </Suspense>
//   );
// }

// /* ══════════════════════════════════════════════════════
//    Types
// ══════════════════════════════════════════════════════ */
// interface Category {
//   id: string;
//   title: string;
//   thumbnailImage: string;
// }
// interface Product {
//   id: string;
//   slug: string;
//   productCardImage: string;
//   title: string;
//   cardShortTitle: string;
//   price: number;
//   stock: number;
//   totalReviews: number;
//   badge?: "SALE" | "BEST_SELLER" | "LOW_STOCK" | "OUT_OF_STOCK" | "NEW" | null;
//   category: { title: string; thumbnailImage: string };
// }
// interface Meta {
//   page: number;
//   limit: number;
//   total: number;
// }

// type TColorOption = {
//   value: string;
//   hex: string;
//   border?: string;
// };

// const BADGE_LABELS: Record<string, string> = {
//   SALE: "Sale",
//   BEST_SELLER: "Best Seller",
//   LOW_STOCK: "Low Stock",
//   OUT_OF_STOCK: "Out of Stock",
//   NEW: "New",
// };
// const BADGE_BG: Record<string, string> = {
//   SALE: "#e53e3e",
//   BEST_SELLER: "#c8930a",
//   LOW_STOCK: "#e07b39",
//   OUT_OF_STOCK: "#888",
//   NEW: "#1a7f4b",
// };
// const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// const COLORS: TColorOption[] = [
//   { value: "Black", hex: "#111111", border: "#111111" },
//   { value: "White", hex: "#ffffff", border: "#d1d5db" },
//   { value: "Blue", hex: "#2563eb", border: "#2563eb" },
//   { value: "Red", hex: "#ef4444", border: "#ef4444" },
//   { value: "Green", hex: "#22c55e", border: "#22c55e" },
//   { value: "Grey", hex: "#9ca3af", border: "#9ca3af" },
//   { value: "Brown", hex: "#8b5e3c", border: "#8b5e3c" },
//   { value: "Navy", hex: "#1e3a8a", border: "#1e3a8a" },
// ];

// const SORT_OPTIONS = [
//   { value: "", label: "Default" },
//   { value: "oldest", label: "Oldest First" },
//   { value: "price_asc", label: "Price: Low → High" },
//   { value: "price_high", label: "Price: High → Low" },
// ];

// /* ══════════════════════════════════════════════════════
//    Main Page
// ══════════════════════════════════════════════════════ */
// function ProductsPage() {
//   const searchParams = useSearchParams();

//   const [categoryId, setCategoryId] = useState(
//     searchParams.get("categoryId") || "",
//   );

//   const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

//   const router = useRouter();

//   const { data: cartData, refetch: refetchCart } = useGetMyCart();

//   const cartItems = cartData?.data?.items || [];
//   const cartSummary = cartData?.data?.summary;

//   const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
//   const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
//   const [size, setSize] = useState(searchParams.get("size") || "");
//   const [color, setColor] = useState(searchParams.get("color") || "");
//   const [sort, setSort] = useState(searchParams.get("sort") || "");
//   const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [draft, setDraft] = useState({ minPrice, maxPrice, size, color, sort });

//   const params = {
//     ...(categoryId && { categoryId }),
//     ...(minPrice && { minPrice }),
//     ...(maxPrice && { maxPrice }),
//     ...(size && { size }),
//     ...(color && { color }),
//     ...(sort && { sort }),
//     page,
//     limit: 12,
//   };

//   const { data: catData } = useGetAllCategories();
//   const {
//     data: prodData,
//     isLoading,
//     isError,
//   } = useGetAllProducts(params as any);

//   const categories: Category[] = catData?.data ?? [];
//   const products: Product[] = (prodData?.data as Product[]) ?? [];
//   const meta: Meta = prodData?.meta ?? { page: 1, limit: 12, total: 0 };
//   const totalPages = Math.ceil(meta.total / meta.limit);

//   const openDrawer = () => {
//     setDraft({ minPrice, maxPrice, size, color, sort });
//     setDrawerOpen(true);
//   };

//   const applyDraft = () => {
//     setMinPrice(draft.minPrice);
//     setMaxPrice(draft.maxPrice);
//     setSize(draft.size);
//     setColor(draft.color);
//     setSort(draft.sort);
//     setPage(1);
//     setDrawerOpen(false);
//   };

//   const clearAll = () => {
//     setDraft({ minPrice: "", maxPrice: "", size: "", color: "", sort: "" });
//     setMinPrice("");
//     setMaxPrice("");
//     setSize("");
//     setColor("");
//     setSort("");
//     setCategoryId("");
//     setPage(1);
//     setDrawerOpen(false);
//   };

//   const activeCount = [minPrice, maxPrice, size, color, sort].filter(
//     Boolean,
//   ).length;
//   const activeCatName = categories.find((c) => c.id === categoryId)?.title;

//   /* ── filter panel (desktop sidebar + mobile drawer share) ── */
//   const FilterBody = ({ isDraft }: { isDraft: boolean }) => {
//     const v = isDraft ? draft : { minPrice, maxPrice, size, color, sort };
//     const set = isDraft
//       ? (k: string, val: string) => setDraft((d) => ({ ...d, [k]: val }))
//       : (k: string, val: string) => {
//           const map: Record<string, (v: string) => void> = {
//             sort: setSort,
//             size: setSize,
//             color: setColor,
//             minPrice: setMinPrice,
//             maxPrice: setMaxPrice,
//           };
//           map[k]?.(val);
//           setPage(1);
//         };

//     return (
//       <div style={F.body}>
//         {/* Categories — desktop sidebar only */}
//         <div style={F.section}>
  
//           <CatBtn
//             active={!categoryId}
//   onClick={() => {
//   setCategoryId("");
//   setPage(1);
//   router.push("/"); // 👈 add this
// }}
//           >
//             All Products
//           </CatBtn>
//           {categories.map((c) => (
//             <CatBtn
//               key={c.id}
//               active={categoryId === c.id}
//       onClick={() => {
//   setCategoryId(c.id);
//   setPage(1);
//  router.push(`/?categoryId=${c.id}`); // 👈 add this line
// }}
//             >
//               {c.title}
//             </CatBtn>
//           ))}
//         </div>

//         <div style={F.section}>
//           <p style={F.label}>Sort By</p>
//           {SORT_OPTIONS.map((o) => (
//             <CatBtn
//               key={o.value}
//               active={v.sort === o.value}
//               onClick={() => set("sort", o.value)}
//             >
//               {o.label}
//             </CatBtn>
//           ))}
//         </div>

//         <div style={F.section}>
//           <p style={F.label}>Price Range (৳)</p>
//           <div style={{ display: "flex", gap: 8 }}>
//             <input
//               type="number"
//               placeholder="Min"
//               value={v.minPrice}
//               onChange={(e) => set("minPrice", e.target.value)}
//               style={F.input}
//             />
//             <input
//               type="number"
//               placeholder="Max"
//               value={v.maxPrice}
//               onChange={(e) => set("maxPrice", e.target.value)}
//               style={F.input}
//             />
//           </div>
//         </div>

//         <div style={F.section}>
//           <p style={F.label}>Size</p>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//             {SIZES.map((s) => (
//               <Chip
//                 key={s}
//                 active={v.size === s}
//                 onClick={() => set("size", v.size === s ? "" : s)}
//               >
//                 {s}
//               </Chip>
//             ))}
//           </div>
//         </div>

//         <div style={F.section}>
//           <p style={F.label}>Color</p>
//           <div style={F.colorWrap}>
//             {COLORS.map((c) => (
//               <ColorSwatch
//                 key={c.value}
//                 color={c}
//                 active={v.color === c.value}
//                 onClick={() => set("color", v.color === c.value ? "" : c.value)}
//               />
//             ))}
//           </div>
//         </div>

//         {isDraft && (
//           <button style={F.applyBtn} onClick={applyDraft}>
//             Apply Filters
//           </button>
//         )}
//         <button style={F.clearBtn} onClick={clearAll}>
//           Clear All
//         </button>
//       </div>
//     );
//   };

//   return (
//     <>
//       <style>{CSS}</style>

//       {/* ══ Mobile category slider (hidden on desktop) ══ */}
//       <div className="pp-mobile-cat">
// <CategorySlider
//   categories={categories}
//   activeCatId={categoryId}
//   onSelect={(id) => {
//     setCategoryId(id);
//     setPage(1);

//     if (id) {
//       router.push(`/?categoryId=${id}`);
//     } else {
//       router.push("/");
//     }
//   }}
//   showAllCard
// />
//       </div>

//       <div className="pp-root">
//         {/* ══ Desktop sidebar ══ */}
//         <aside className="pp-sidebar">
//           <p style={F.sidebarTitle}>Filters</p>
//           <FilterBody isDraft={false} />
//         </aside>

//         {/* ══ Main ══ */}
//         <main className="pp-main">
//           {/* top bar */}
//           <div className="pp-topbar">
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <button
//                 className="pp-mobile-filter-btn"
//                 onClick={openDrawer}
//                 style={T.filterBtn}
//               >
//                 <svg
//                   width="15"
//                   height="15"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.2"
//                 >
//                   <line x1="4" y1="6" x2="20" y2="6" />
//                   <line x1="8" y1="12" x2="16" y2="12" />
//                   <line x1="11" y1="18" x2="13" y2="18" />
//                 </svg>
//                 Filters{" "}
//                 {activeCount > 0 && (
//                   <span style={T.countDot}>{activeCount}</span>
//                 )}
//               </button>
//               <p style={T.resultText}>
//                 <b>{meta.total}</b> {meta.total === 1 ? "product" : "products"}
//                 {activeCatName && (
//                   <>
//                     {" "}
//                     in <b>{activeCatName}</b>
//                   </>
//                 )}
//               </p>
//             </div>
//             <div className="pp-desktop-sort">
//               <span style={{ fontSize: 13, color: "#888" }}>Sort:</span>
//               <select
//                 value={sort}
//                 onChange={(e) => {
//                   setSort(e.target.value);
//                   setPage(1);
//                 }}
//                 style={T.sortSelect}
//               >
//                 {SORT_OPTIONS.map((o) => (
//                   <option key={o.value} value={o.value}>
//                     {o.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* active filter chips */}
//           {activeCount > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 6,
//                 marginBottom: 14,
//               }}
//             >
//               {minPrice && (
//                 <Tag label={`Min ৳${minPrice}`} onX={() => setMinPrice("")} />
//               )}
//               {maxPrice && (
//                 <Tag label={`Max ৳${maxPrice}`} onX={() => setMaxPrice("")} />
//               )}
//               {size && <Tag label={`Size: ${size}`} onX={() => setSize("")} />}
//               {color && (
//                 <Tag label={`Color: ${color}`} onX={() => setColor("")} />
//               )}
//               {sort && (
//                 <Tag
//                   label={
//                     SORT_OPTIONS.find((o) => o.value === sort)?.label || sort
//                   }
//                   onX={() => setSort("")}
//                 />
//               )}
//             </div>
//           )}

//           {/* grid */}
//           {isLoading ? (
//             <div className="pp-grid">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <SkeletonCard key={i} />
//               ))}
//             </div>
//           ) : isError ? (
//             <EmptyState text="Failed to load products." />
//           ) : products.length === 0 ? (
//             <EmptyState text="No products found.">
//               <button style={F.clearBtn} onClick={clearAll}>
//                 Clear Filters
//               </button>
//             </EmptyState>
//           ) : (
//             <div className="pp-grid">
//               {products.map((p, i) => (
//                 <ProductCard
//                   key={p.id}
//                   product={p}
//                   index={i}
//                   onAddedToCart={async () => {
//                     await refetchCart();
//                     setCartDrawerOpen(true);
//                   }}
//                 />
//               ))}
//             </div>
//           )}

//           {/* ── Pagination ── */}
//           {totalPages > 1 && (
//             <div style={T.pgWrap}>
//               <PgBtn
//                 disabled={page === 1}
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//               >
//                 ← Prev
//               </PgBtn>
//               {buildPageNums(totalPages, page).map((n, i) =>
//                 n === "..." ? (
//                   <span key={`e${i}`} style={T.ellipsis}>
//                     …
//                   </span>
//                 ) : (
//                   <PgBtn
//                     key={n}
//                     active={page === n}
//                     onClick={() => setPage(n as number)}
//                   >
//                     {n}
//                   </PgBtn>
//                 ),
//               )}
//               <PgBtn
//                 disabled={page === totalPages}
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               >
//                 Next →
//               </PgBtn>
//             </div>
//           )}
//         </main>
//       </div>

//       {/* ══ Mobile Filter Drawer ══ */}
//       {drawerOpen && (
//         <div style={T.backdrop} onClick={() => setDrawerOpen(false)}>
//           <div style={T.drawer} onClick={(e) => e.stopPropagation()}>
//             <div style={T.drawerHead}>
//               <p style={F.sidebarTitle}>Filters</p>
//               <button style={T.drawerX} onClick={() => setDrawerOpen(false)}>
//                 ✕
//               </button>
//             </div>
//             <div style={{ overflowY: "auto", flex: 1, padding: "0 18px 24px" }}>
//               <FilterBody isDraft={true} />
//             </div>
//           </div>
//         </div>
//       )}

//       {drawerOpen && (
//         <div style={T.backdrop} onClick={() => setDrawerOpen(false)}>
//           <div style={T.drawer} onClick={(e) => e.stopPropagation()}>
//             <div style={T.drawerHead}>
//               <p style={F.sidebarTitle}>Filters</p>
//               <button style={T.drawerX} onClick={() => setDrawerOpen(false)}>
//                 ✕
//               </button>
//             </div>
//             <div style={{ overflowY: "auto", flex: 1, padding: "0 18px 24px" }}>
//               <FilterBody isDraft={true} />
//             </div>
//           </div>
//         </div>
//       )}


//     </>
//   );
// }

// /* ══════════════════════════════════════════════════════
//    Category Slider  (mobile only)
// ══════════════════════════════════════════════════════ */
// function CategorySlider({
//   categories,
//   activeCatId,
//   onSelect,
//   showAllCard = false,
// }: {
//   categories: Category[];
//   activeCatId: string;
//   onSelect: (id: string) => void;
//   showAllCard?: boolean;
// }) {
//   const ALL_ID = "__all__";
//   const allCard: Category = {
//     id: ALL_ID,
//     title: "All Products",
//     thumbnailImage: "",
//   };
//   const items = showAllCard ? [allCard, ...categories] : categories;
//   const total = items.length;
//   const [index, setIndex] = useState(0);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const dragging = useRef(false);
//   const startX = useRef(0);
//   const moved = useRef(false);
//   const [offset, setOffset] = useState(0);

//   const CARD_W = 105,
//     GAP = 8;

//   const clamp = useCallback(
//     (i: number) => Math.max(0, Math.min(i, total - 1)),
//     [total],
//   );
//   const goTo = useCallback(
//     (i: number) => {
//       setIndex(clamp(i));
//       setOffset(0);
//     },
//     [clamp],
//   );
//   const next = useCallback(
//     () => goTo(index + 1 < total ? index + 1 : 0),
//     [goTo, index, total],
//   );
//   const prev = useCallback(
//     () => goTo(index - 1 >= 0 ? index - 1 : total - 1),
//     [goTo, index, total],
//   );
//   const startAuto = useCallback(() => {
//     if (autoRef.current) clearInterval(autoRef.current);
//     autoRef.current = setInterval(next, 2800);
//   }, [next]);

//   useEffect(() => {
//     if (total < 2) return;
//     startAuto();
//     return () => {
//       if (autoRef.current) clearInterval(autoRef.current);
//     };
//   }, [startAuto, total]);

//   const onPointerDown = (e: React.PointerEvent) => {
//     dragging.current = true;
//     moved.current = false;
//     startX.current = e.clientX;
//     setOffset(0);
//     if (autoRef.current) clearInterval(autoRef.current);
//     (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
//   };
//   const onPointerMove = (e: React.PointerEvent) => {
//     if (!dragging.current) return;
//     const d = e.clientX - startX.current;
//     if (Math.abs(d) > 5) moved.current = true;
//     setOffset(d);
//   };
//   const onPointerUp = useCallback(() => {
//     if (!dragging.current) return;
//     dragging.current = false;
//     if (offset < -45) next();
//     else if (offset > 45) prev();
//     else setOffset(0);
//     startAuto();
//   }, [offset, next, prev, startAuto]);

//   const handleCardClick = (cat: Category) => {
//     if (moved.current) return;
//     if (cat.id === ALL_ID) {
//       onSelect("");
//       return;
//     }
//     onSelect(activeCatId === cat.id ? "" : cat.id);
//   };

//   const isActive = (cat: Category) =>
//     cat.id === ALL_ID ? activeCatId === "" : activeCatId === cat.id;

//   const translateX = -(index * (CARD_W + GAP)) + offset;

//   return (
//     <section style={SL.section}>
//       <style>{FONT_IMPORT}</style>
//       <div style={SL.header}>
//         <h2 style={SL.title}>Shop by Category</h2>
//         <div style={{ display: "flex", gap: 8 }}>
//           <button
//             style={SL.btn}
//             onClick={() => {
//               prev();
//               startAuto();
//             }}
//           >
//             ‹
//           </button>
//           <button
//             style={SL.btn}
//             onClick={() => {
//               next();
//               startAuto();
//             }}
//           >
//             ›
//           </button>
//         </div>
//       </div>

//       <div style={SL.viewport}>
//         <div
//           style={{
//             ...SL.track,
//             transform: `translateX(${translateX}px)`,
//             transition: dragging.current
//               ? "none"
//               : "transform 0.42s cubic-bezier(0.25,0.8,0.25,1)",
//           }}
//           onPointerDown={onPointerDown}
//           onPointerMove={onPointerMove}
//           onPointerUp={onPointerUp}
//           onPointerCancel={onPointerUp}
//         >
//           {items.map((cat) => (
//             <div
//               key={cat.id}
//               onClick={() => handleCardClick(cat)}
//               style={{
//                 ...SL.card,
//                 width: CARD_W,
//                 outline: isActive(cat) ? "2.5px solid #111" : "none",
//                 outlineOffset: 2,
//               }}
//             >
//               {cat.id === ALL_ID ? (
//                 <div
//                   style={{
//                     ...SL.imgWrap,
//                     background: isActive(cat) ? "#111" : "#e8e8e8",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 6,
//                   }}
//                 >
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke={isActive(cat) ? "#fff" : "#666"}
//                     strokeWidth="1.8"
//                   >
//                     <rect x="3" y="3" width="7" height="7" rx="1" />
//                     <rect x="14" y="3" width="7" height="7" rx="1" />
//                     <rect x="3" y="14" width="7" height="7" rx="1" />
//                     <rect x="14" y="14" width="7" height="7" rx="1" />
//                   </svg>
//                   <span
//                     style={{
//                       fontFamily: "'Syne',sans-serif",
//                       fontSize: "0.72rem",
//                       fontWeight: 700,
//                       color: isActive(cat) ? "#fff" : "#444",
//                       textAlign: "center",
//                       padding: "0 4px",
//                     }}
//                   >
//                     All Products
//                   </span>
//                 </div>
//               ) : (
//                 <div style={SL.imgWrap}>
//                   {cat.thumbnailImage ? (
//                     <Image
//                       src={cat.thumbnailImage}
//                       alt={cat.title}
//                       fill
//                       sizes="100px"
//                       style={{ ...SL.img, objectFit: "cover" }}
//                     />
//                   ) : (
//                     <div style={SL.imgFallback} />
//                   )}
//                   <div style={SL.overlayTop} />
//                   <div style={SL.overlayBottom} />
//                   <p style={SL.cardLabel}>{cat.title}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           gap: 6,
//           justifyContent: "center",
//           marginTop: 12,
//         }}
//       >
//         {items.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => {
//               goTo(i);
//               startAuto();
//             }}
//             style={{
//               width: 7,
//               height: 7,
//               borderRadius: "50%",
//               border: "none",
//               cursor: "pointer",
//               padding: 0,
//               transition: "all 0.25s",
//               background: i === index ? "#111" : "#d4d4d4",
//               transform: i === index ? "scale(1.45)" : "scale(1)",
//             }}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// /* ══════════════════════════════════════════════════════
//    Product Card
// ══════════════════════════════════════════════════════ */
// function ProductCard({
//   product,
//   index,
//   onAddedToCart,
// }: {
//   product: Product;
//   index: number;
//   onAddedToCart: () => void | Promise<void>;
// }) {
//   const [hov, setHov] = useState(false);
//   const soldOut = product.stock === 0;

//   const router = useRouter();
//   const { mutate: addToCart, isPending } = useAddToCart();

//   const handleDetailsNavigate = () => {
//     router.push(`/product/${product.slug}`);
//   };

//   const handleBuyNow = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (soldOut) return;
//     router.push(`/product/${product.slug}`);
//   };

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (soldOut || isPending) return;

//     addToCart(
//       {
//         productId: product.id,
//         quantity: 1,
//       },
//       {
//         onSuccess: async (res: any) => {
//           toast.success(res?.message || "Added to cart");
//           await onAddedToCart();
//         },
//         onError: (err: any) => {
//           toast.error(err?.response?.data?.message || "Failed to add to cart");
//         },
//       }
//     );
//   };

//   return (
//     <div
//       className="pp-card "
//       style={{
//         boxShadow: "0 12px 30px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.11)"
//       }}
//       onClick={handleDetailsNavigate}
//     >
//       <div
//         className="pp-card"
//         style={{
//           animationDelay: `${index * 45}ms`,
//           transform: hov ? "translateY(-3px)" : "translateY(0)",
//           boxShadow: hov
//             ? "0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.05)"
//             : "0 6px 18px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.04)",
//         }}
//         onMouseEnter={() => setHov(true)}
//         onMouseLeave={() => setHov(false)}
//       >
//         <div style={C.imgWrap}>
//           {product.productCardImage ? (
//             <Image
//               src={product.productCardImage}
//               alt={product.title}
//               fill
//               sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//               style={{
//                 ...C.img,
//                 objectFit: "cover",
//                 transform: hov ? "scale(1.06)" : "scale(1)",
//               }}
//             />
//           ) : (
//             <div style={C.imgFallback}>
//               <svg
//                 width="28"
//                 height="28"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#ccc"
//                 strokeWidth="1.5"
//               >
//                 <rect x="3" y="3" width="18" height="18" rx="2" />
//                 <circle cx="8.5" cy="8.5" r="1.5" />
//                 <polyline points="21 15 16 10 5 21" />
//               </svg>
//             </div>
//           )}

//           {soldOut && <div style={C.dimOverlay} />}
//         </div>

//         <div style={C.info}>
//           <p style={C.title}>
//             {product.title.split(" ").slice(0, 3).join(" ") +
//               (product.title.split(" ").length > 3 ? "..." : "")}
//           </p>
//      {product.cardShortTitle && (
//   <span style={C.catTag}>
//     {product.cardShortTitle.length > 25
//       ? product.cardShortTitle.slice(0, 25) + "..."
//       : product.cardShortTitle}
//   </span>
// )}

//           <div style={C.priceRow}>
//             <span style={C.price}>৳ {product.price.toLocaleString()}</span>
//           </div>

//           <div style={C.actions}>
//             <button
//               onClick={handleBuyNow}
//               style={{ ...C.buyBtn, opacity: soldOut ? 0.45 : 1 }}
//               disabled={soldOut}
//             >
//               Buy Now
//             </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Small helpers ─────────────────────────────────── */
// function CatBtn({
//   active,
//   onClick,
//   children,
// }: {
//   active: boolean;
//   onClick: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{ ...F.catBtn, ...(active ? F.catBtnActive : {}) }}
//     >
//       {children}
//     </button>
//   );
// }

// function Chip({
//   active,
//   onClick,
//   children,
// }: {
//   active: boolean;
//   onClick: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{ ...F.chip, ...(active ? F.chipActive : {}) }}
//     >
//       {children}
//     </button>
//   );
// }

// function ColorSwatch({
//   color,
//   active,
//   onClick,
// }: {
//   color: TColorOption;
//   active: boolean;
//   onClick: () => void;
// }) {
//   const isLight =
//     color.value === "White" || color.value === "Grey";

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-label={color.value}
//       title={color.value}
//       style={{
//         ...F.colorSwatch,
//         background: color.hex,
//         border: `1.5px solid ${color.border || color.hex}`,
//         boxShadow: active
//           ? "0 0 0 2px #111, 0 0 0 5px rgba(17,17,17,0.12)"
//           : color.value === "White"
//             ? "inset 0 0 0 1px #e5e7eb"
//             : "none",
//         transform: active ? "scale(1.06)" : "scale(1)",
//       }}
//     >
//       {active && (
//         <span
//           style={{
//             color: isLight ? "#111" : "#fff",
//             fontSize: 12,
//             fontWeight: 700,
//             lineHeight: 1,
//           }}
//         >
//           ✓
//         </span>
//       )}
//     </button>
//   );
// }

// function Tag({ label, onX }: { label: string; onX: () => void }) {
//   return (
//     <span style={T.tag}>
//       {label}
//       <button onClick={onX} style={T.tagX}>
//         ✕
//       </button>
//     </span>
//   );
// }

// function PgBtn({
//   active,
//   disabled,
//   onClick,
//   children,
// }: {
//   active?: boolean;
//   disabled?: boolean;
//   onClick: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         ...T.pgBtn,
//         ...(active ? T.pgBtnActive : {}),
//         ...(disabled ? T.pgBtnDisabled : {}),
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// function EmptyState({
//   text,
//   children,
// }: {
//   text: string;
//   children?: React.ReactNode;
// }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         padding: "56px 20px",
//         gap: 10,
//         textAlign: "center",
//       }}
//     >
//       <p
//         style={{
//           fontFamily: "'Syne',sans-serif",
//           fontWeight: 700,
//           color: "#333",
//           margin: 0,
//         }}
//       >
//         {text}
//       </p>
//       {children}
//     </div>
//   );
// }

// function SkeletonCard() {
//   return (
//     <div className="pp-card" style={{ overflow: "hidden", animation: "none" }}>
//       <div style={{ ...SK.base, aspectRatio: "3/4" }} />
//       <div
//         style={{
//           padding: "10px 12px",
//           display: "flex",
//           flexDirection: "column",
//           gap: 7,
//         }}
//       >
//         <div
//           style={{ ...SK.base, height: 11, width: "45%", borderRadius: 4 }}
//         />
//         <div
//           style={{ ...SK.base, height: 13, width: "80%", borderRadius: 4 }}
//         />
//         <div
//           style={{ ...SK.base, height: 13, width: "35%", borderRadius: 4 }}
//         />
//       </div>
//     </div>
//   );
// }

// function buildPageNums(total: number, cur: number): (number | "...")[] {
//   const arr: (number | "...")[] = [];
//   for (let i = 1; i <= total; i++) {
//     if (i === 1 || i === total || Math.abs(i - cur) <= 1) arr.push(i);
//     else if (arr[arr.length - 1] !== "...") arr.push("...");
//   }
//   return arr;
// }

// /* ══════════════════════════════════════════════════════
//    CSS
// ══════════════════════════════════════════════════════ */
// const FONT_IMPORT = `
//   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
//   @keyframes shimmerAnim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
//   @keyframes shimmer     { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
// `;

// const CSS = `
//   ${FONT_IMPORT}
//   *, *::before, *::after { box-sizing: border-box; }
//   @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

//   .pp-mobile-cat { display: block; }

//   .pp-root {
//     display: flex;
//     gap: 24px;
//     padding: 16px 20px 32px;
//     max-width: 1400px;
//     margin: 0 auto;
//     background: #f6f6f4;
//     min-height: 60vh;
//     font-family: 'DM Sans', sans-serif;
//   }

//   .pp-sidebar { width: 220px; flex-shrink: 0; display: block; }
//   .pp-main    { flex: 1; min-width: 0; }

//   .pp-topbar {
//     display: flex; align-items: center; justify-content: space-between;
//     margin-bottom: 14px; flex-wrap: wrap; gap: 8px;
//   }

//   .pp-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
//   @media (min-width: 640px)  { .pp-grid { grid-template-columns: repeat(3,1fr); gap: 14px; } }
//   @media (min-width: 1024px) { .pp-grid { grid-template-columns: repeat(4,1fr); gap: 16px; } }

//   .pp-card {
//     background: #fff;
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 8px 20px rgba(0,0,0,0.08),
//                 0 2px 6px rgba(0,0,0,0.04);
//     transition: transform .28s ease, box-shadow .28s ease;
//     animation: fadeUp .35s ease both;
//     cursor: pointer;
//   }

//   .pp-mobile-filter-btn { display: none !important; }
//   .pp-desktop-sort      { display: flex; align-items: center; gap: 8px; }

//   @media (max-width: 860px) {
//     .pp-mobile-cat        { display: block; }
//     .pp-sidebar           { display: none !important; }
//     .pp-mobile-filter-btn { display: flex !important; }
//     .pp-desktop-sort      { display: none !important; }
//   }

//   @media (min-width: 861px) {
//     .pp-mobile-cat { display: none; }
//   }
// `;

// /* ── Styles ────────────────────────────────────────── */
// const F: Record<string, React.CSSProperties> = {
//   sidebarTitle: {
//     fontWeight: 700,
//     fontSize: "1rem",
//     color: "#111",
//     margin: "0 0 14px",
//   },
//   body: { display: "flex", flexDirection: "column", gap: 0 },
//   section: {
//     borderBottom: "1px solid #ebebeb",
//     paddingBottom: 14,
//     marginBottom: 14,
//   },
//   label: {
//     fontSize: "0.67rem",
//     fontWeight: 700,
//     letterSpacing: "0.08em",
//     textTransform: "none" as const,
//     color: "#999",
//     margin: "0 0 8px",
//   },
//   catBtn: {
//     display: "block",
//     width: "100%",
//     textAlign: "left" as const,
//     background: "none",
//     border: "none",
//     padding: "7px 10px",
//     fontSize: "0.85rem",
//     color: "#444",
//     cursor: "pointer",
//     borderRadius: 8,
//     marginBottom: 2,
//     transition: "all 0.15s",
//   },
//   catBtnActive: { background: "#111", color: "#fff", fontWeight: 500 },
//   chip: {
//     padding: "4px 10px",
//     border: "1.5px solid #e0e0e0",
//     borderRadius: 20,
//     fontSize: "0.75rem",
//     background: "#fff",
//     color: "#444",
//     cursor: "pointer",
//     transition: "all 0.15s",
//   },
//   chipActive: { background: "#111", color: "#fff", border: "1.5px solid #111" },
//   input: {
//     flex: 1,
//     padding: "7px 10px",
//     border: "1.5px solid #e0e0e0",
//     borderRadius: 8,
//     fontSize: "0.8rem",
//     outline: "none",
//     background: "#fff",
//     color: "#111",
//     minWidth: 0,
//   },
//   colorWrap: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 10,
//     alignItems: "center",
//   },
//   colorSwatch: {
//     width: 28,
//     height: 28,
//     minWidth: 28,
//     borderRadius: "50%",
//     cursor: "pointer",
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "all 0.18s ease",
//     padding: 0,
//     outline: "none",
//     backgroundClip: "padding-box",
//   },
//   applyBtn: {
//     width: "100%",
//     padding: "10px",
//     background: "#111",
//     color: "#fff",
//     border: "none",
//     borderRadius: 10,
//     fontFamily: "'Syne',sans-serif",
//     fontWeight: 700,
//     fontSize: "0.85rem",
//     cursor: "pointer",
//     marginBottom: 8,
//   },
//   clearBtn: {
//     width: "100%",
//     padding: "9px",
//     background: "transparent",
//     color: "#999",
//     border: "1.5px solid #e0e0e0",
//     borderRadius: 10,
//     fontSize: "0.82rem",
//     cursor: "pointer",
//   },
// };

// const T: Record<string, React.CSSProperties> = {
//   filterBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "8px 14px",
//     background: "#111",
//     color: "#fff",
//     border: "none",
//     borderRadius: 10,
//     fontSize: "0.82rem",
//     fontFamily: "'Syne',sans-serif",
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   countDot: {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 17,
//     height: 17,
//     background: "#e53e3e",
//     color: "#fff",
//     borderRadius: "50%",
//     fontSize: "0.62rem",
//     fontWeight: 700,
//   },
//   resultText: {
//     fontSize: "0.88rem",
//     color: "#555",
//     margin: 0,
//   },
//   sortSelect: {
//     padding: "7px 12px",
//     border: "1.5px solid #e0e0e0",
//     borderRadius: 8,
//     fontSize: "0.82rem",
//     background: "#fff",
//     color: "#111",
//     cursor: "pointer",
//     outline: "none",
//   },
//   tag: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "4px 10px 4px 12px",
//     background: "#111",
//     color: "#fff",
//     borderRadius: 20,
//     fontSize: "0.73rem",
//   },
//   tagX: {
//     background: "none",
//     border: "none",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "0.62rem",
//     padding: 0,
//     opacity: 0.7,
//   },
//   pgWrap: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     marginTop: 32,
//     flexWrap: "wrap" as const,
//   },
//   pgBtn: {
//     padding: "8px 14px",
//     border: "1.5px solid #e0e0e0",
//     borderRadius: 8,
//     background: "#fff",
//     color: "#444",
//     fontSize: "0.82rem",
//     cursor: "pointer",
//     transition: "all 0.15s",
//   },
//   pgBtnActive: {
//     background: "#111",
//     color: "#fff",
//     border: "1.5px solid #111",
//     fontWeight: 600,
//   },
//   pgBtnDisabled: { opacity: 0.35, cursor: "not-allowed" },
//   ellipsis: { padding: "8px 4px", color: "#aaa", fontSize: "0.82rem" },
//   backdrop: {
//     position: "fixed" as const,
//     inset: 0,
//     background: "rgba(0,0,0,0.46)",
//     zIndex: 1000,
//     display: "flex",
//     alignItems: "flex-end",
//   },
//   drawer: {
//     width: "100%",
//     maxHeight: "88vh",
//     background: "#fff",
//     borderRadius: "20px 20px 0 0",
//     display: "flex",
//     flexDirection: "column" as const,
//   },
//   drawerHead: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "18px 18px 12px",
//     borderBottom: "1px solid #f0f0f0",
//   },
//   drawerX: {
//     background: "none",
//     border: "none",
//     fontSize: "1.1rem",
//     color: "#555",
//     cursor: "pointer",
//     padding: 4,
//   },
// };

// const C: Record<string, React.CSSProperties> = {
//   imgWrap: {
//     position: "relative" as const,
//     aspectRatio: "3/4",
//     overflow: "hidden",
//     background: "#f2f2f2",
//   },
//   img: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover" as const,
//     display: "block",
//     transition: "transform 0.5s ease",
//     pointerEvents: "none",
//   },
//   imgFallback: {
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#f5f5f5",
//   },
//   badge: {
//     position: "absolute" as const,
//     top: 8,
//     left: 8,
//     padding: "3px 7px",
//     borderRadius: 6,
//     fontSize: "0.6rem",
//     fontWeight: 700,
//     color: "#fff",
//     fontFamily: "'Syne',sans-serif",
//   },
//   stockPill: {
//     position: "absolute" as const,
//     bottom: 8,
//     right: 8,
//     padding: "2px 7px",
//     borderRadius: 20,
//     fontSize: "0.58rem",
//     fontWeight: 600,
//     color: "#fff",
//   },
//   dimOverlay: {
//     position: "absolute" as const,
//     inset: 0,
//     background: "rgba(255,255,255,0.35)",
//   },
//   info: {
//     padding: "12px 11px 12px",
//     background: "#fff",
//     position: "relative",
//     zIndex: 2,
//     boxShadow: "0 -12px 25px rgba(0,0,0,0.15)",
//   },
//   catTag: {
//     display: "inline-block",
//     fontSize: "0.75rem",
//     padding: "3px 7px",
//     fontWeight: 600,
//     letterSpacing: "0.05em",
//     textTransform: "none" as const,
//     color: "black",
//     opacity: 0.6,
 
//     marginBottom: 3,
//   },
//   title: {
//     margin: "0 0 6px",
//     fontSize: "1.10rem",
//     fontWeight: 900,
//     color: "#black",
//     display: "-webkit-box",
//     WebkitBoxOrient: "vertical" as const,
//     overflow: "hidden",
//   },
//   priceRow: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   price: {
//     fontFamily: "sans-serif",
//     fontWeight: 600,
//     fontSize: "0.95rem",
//     color: "#111",
//   },
//   reviews: {
//     fontSize: "0.68rem",
//     color: "#c8930a",
//   },
//   actions: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     width: "100%",
//     fontWeight: 700,
//   },
//   buyBtn: {
//     flex: 1,
//     minWidth: 0,
//     height: 35,
//     border: "1px solid rgba(255,255,255,0.08)",
//     borderRadius: 10,
//     background: "linear-gradient(180deg, #1f1f1f 0%, #0a0a0a 100%)",
//     color: "#fff",
//     fontSize: "0.60rem",
//     fontWeight: 700,
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     whiteSpace: "nowrap",
//     boxShadow:
//       "0 10px 20px rgba(0,0,0,0.28), 0 3px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10)",
//     transition: "all 0.25s ease",
//   },

//   cartIconBtn: {
//     width: 38,
//     minWidth: 38,
//     height: 38,
//     border: "2px solid #e5e5e5",
//     borderRadius: 10,
//     background: "#FBF0F0",
//     color: "#222",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//     boxShadow: "0 6px 30px rgba(0,0,0,0.20), 0 2px 12px rgba(0,0,0,0.10)",
//     transition: "all 0.25s ease",
//   },
// };

// /* Slider styles */
// const SL: Record<string, React.CSSProperties> = {
//   section: {
//     padding: "16px 16px 8px",
//     userSelect: "none",
//     WebkitUserSelect: "none" as const,
//     background: "#f6f6f4",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   title: {
//     fontFamily: "var(--font-poppins)",
//     fontSize: "1.2rem",
//     fontWeight: 700,
//     margin: 0,
//     color: "#111",
//     width: "100%",
//   },
//   btn: {
//     width: 30,
//     height: 30,
//     borderRadius: "50%",
//     border: "1.5px solid #e0e0e0",
//     background: "#fff",
//     color: "#222",
//     fontSize: "1.1rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   viewport: { overflow: "hidden", cursor: "grab", touchAction: "pan-y" },
//   track: { display: "flex", gap: 8, willChange: "transform" },
//   card: {
//     borderRadius: 10,
//     overflow: "hidden",
//     position: "relative" as const,
//     background: "#f0f0f0",
//     flexShrink: 0,
//     transition: "transform 0.3s ease, box-shadow 0.3s ease, outline 0.15s ease",
//     cursor: "pointer",
//   },
//   imgWrap: {
//     position: "relative" as const,
//     width: "100%",
//     aspectRatio: "1/1.15" as const,
//     overflow: "hidden",
//   },
//   img: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover" as const,
//     display: "block",
//     pointerEvents: "none",
//   },
//   imgFallback: { width: "100%", height: "100%", background: "#ddd" },
//   overlayTop: {
//     position: "absolute" as const,
//     inset: 0,
//     background: "linear-gradient(160deg,rgba(0,0,0,0.18) 0%,rgba(0,0,0,0) 45%)",
//     pointerEvents: "none",
//   },
//   overlayBottom: {
//     position: "absolute" as const,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: "55%",
//     background:
//       "linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.3) 55%,rgba(0,0,0,0) 100%)",
//     pointerEvents: "none",
//   },
//   cardLabel: {
//     position: "absolute" as const,
//     bottom: 8,
//     left: 0,
//     right: 0,
//     margin: 0,
//     padding: "0 8px",
//     fontFamily: "'Syne',sans-serif",
//     fontSize: "0.75rem",
//     fontWeight: 700,
//     color: "#fff",
//     textShadow: "0 1px 4px rgba(0,0,0,0.5)",
//     whiteSpace: "nowrap" as const,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   },
// };

// const SK: Record<string, React.CSSProperties> = {
//   base: {
//     background: "linear-gradient(90deg,#f0f0f0 25%,#e6e6e6 50%,#f0f0f0 75%)",
//     backgroundSize: "200% 100%",
//     animation: "shimmerAnim 1.4s infinite",
//     borderRadius: 0,
//   },
// };

























































"use client";

import { Suspense, useState, useRef, useEffect, useCallback, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { useGetAllCategories } from "../../Apis/category/queries";
import { useGetAllProducts } from "../../Apis/products/queries";
import { useAddToCart, useGetMyCart } from "../../Apis/cart";
import { toast } from "sonner";

export default function UserSideProducts() {
  return (
    <Suspense fallback={null}>
      <ProductsPage />
    </Suspense>
  );
}

/* ══════════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════
   Constants (moved outside component to avoid recreation)
══════════════════════════════════════════════════════ */
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const COLORS: TColorOption[] = [
  { value: "Black", hex: "#111111", border: "#111111" },
  { value: "White", hex: "#ffffff", border: "#d1d5db" },
  { value: "Blue",  hex: "#2563eb", border: "#2563eb" },
  { value: "Red",   hex: "#ef4444", border: "#ef4444" },
  { value: "Green", hex: "#22c55e", border: "#22c55e" },
  { value: "Grey",  hex: "#9ca3af", border: "#9ca3af" },
  { value: "Brown", hex: "#8b5e3c", border: "#8b5e3c" },
  { value: "Navy",  hex: "#1e3a8a", border: "#1e3a8a" },
];

const SORT_OPTIONS = [
  { value: "",            label: "Default" },
  { value: "oldest",      label: "Oldest First" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_high", label: "Price: High → Low" },
] as const;

const ALL_CAT_ID = "__all__";

/* ══════════════════════════════════════════════════════
   Pagination helper
══════════════════════════════════════════════════════ */
function buildPageNums(total: number, cur: number): (number | "...")[] {
  const arr: (number | "...")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - cur) <= 1) arr.push(i);
    else if (arr[arr.length - 1] !== "...") arr.push("...");
  }
  return arr;
}

/* ══════════════════════════════════════════════════════
   Filter state hook — keeps ProductsPage lean
══════════════════════════════════════════════════════ */
function useFilters(searchParams: ReturnType<typeof useSearchParams>) {
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice,   setMinPrice]   = useState(searchParams.get("minPrice")   || "");
  const [maxPrice,   setMaxPrice]   = useState(searchParams.get("maxPrice")   || "");
  const [size,       setSize]       = useState(searchParams.get("size")       || "");
  const [color,      setColor]      = useState(searchParams.get("color")      || "");
  const [sort,       setSort]       = useState(searchParams.get("sort")       || "");
  const [page,       setPage]       = useState(Number(searchParams.get("page")) || 1);

  const clearAll = useCallback(() => {
    setCategoryId(""); setMinPrice(""); setMaxPrice("");
    setSize(""); setColor(""); setSort(""); setPage(1);
  }, []);

  const params = {
    ...(categoryId && { categoryId }),
    ...(minPrice   && { minPrice }),
    ...(maxPrice   && { maxPrice }),
    ...(size       && { size }),
    ...(color      && { color }),
    ...(sort       && { sort }),
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

/* ══════════════════════════════════════════════════════
   Main Page
══════════════════════════════════════════════════════ */
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

  const { data: cartData, refetch: refetchCart } = useGetMyCart();
  const { data: catData } = useGetAllCategories();
  const { data: prodData, isLoading, isError } = useGetAllProducts(params as any);

  const categories: Category[] = catData?.data ?? [];
  const products: Product[]   = (prodData?.data as Product[]) ?? [];
  const meta: Meta             = prodData?.meta ?? { page: 1, limit: 12, total: 0 };
  const totalPages             = Math.ceil(meta.total / meta.limit);

  const activeCatName = categories.find((c) => c.id === categoryId)?.title;

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

  const handleAddedToCart = useCallback(async () => {
    await refetchCart();
  }, [refetchCart]);

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* Mobile category slider */}
      <div className="pp-mobile-cat">
        <CategorySlider
          categories={categories}
          activeCatId={categoryId}
          onSelect={handleCatSelect}
          showAllCard
        />
      </div>

      <div className="pp-root">
        {/* Desktop sidebar */}
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

        {/* Main */}
        <main className="pp-main">
          {/* Top bar */}
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

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="active-chips">
              {minPrice && <Tag label={`Min ৳${minPrice}`} onX={() => setMinPrice("")} />}
              {maxPrice && <Tag label={`Max ৳${maxPrice}`} onX={() => setMaxPrice("")} />}
              {size     && <Tag label={`Size: ${size}`}    onX={() => setSize("")} />}
              {color    && <Tag label={`Color: ${color}`}  onX={() => setColor("")} />}
              {sort     && <Tag label={SORT_OPTIONS.find((o) => o.value === sort)?.label || sort} onX={() => setSort("")} />}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="pp-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isError ? (
            <EmptyState text="Failed to load products." />
          ) : products.length === 0 ? (
            <EmptyState text="No products found.">
              <button className="clear-btn" onClick={handleClearAll}>Clear Filters</button>
            </EmptyState>
          ) : (
            <div className="pp-grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAddedToCart={handleAddedToCart} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pg-wrap">
              <PgBtn disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>← Prev</PgBtn>
              {buildPageNums(totalPages, page).map((n, i) =>
                n === "..." ? (
                  <span key={`e${i}`} className="pg-ellipsis">…</span>
                ) : (
                  <PgBtn key={n} active={page === n} onClick={() => setPage(n as number)}>{n}</PgBtn>
                )
              )}
              <PgBtn disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next →</PgBtn>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer — single instance */}
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

/* ══════════════════════════════════════════════════════
   Filter Panel — memoized, shared by sidebar + drawer
══════════════════════════════════════════════════════ */
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
      {/* Categories */}
      <div className="filter-section">
        <CatBtn active={!categoryId} onClick={() => onCategorySelect("")}>All Products</CatBtn>
        {categories.map((c) => (
          <CatBtn key={c.id} active={categoryId === c.id} onClick={() => onCategorySelect(c.id)}>
            {c.title}
          </CatBtn>
        ))}
      </div>

      {/* Sort */}
      <div className="filter-section">
        <p className="filter-label">Sort By</p>
        {SORT_OPTIONS.map((o) => (
          <CatBtn key={o.value} active={sort === o.value} onClick={() => onChange("sort", o.value)}>
            {o.label}
          </CatBtn>
        ))}
      </div>

      {/* Price */}
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

      {/* Size */}
      <div className="filter-section">
        <p className="filter-label">Size</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SIZES.map((s) => (
            <Chip key={s} active={size === s} onClick={() => onChange("size", size === s ? "" : s)}>{s}</Chip>
          ))}
        </div>
      </div>

      {/* Color */}
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

/* ══════════════════════════════════════════════════════
   Category Slider
══════════════════════════════════════════════════════ */
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
  const autoRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragging  = useRef(false);
  const startX    = useRef(0);
  const moved     = useRef(false);

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
    moved.current    = false;
    startX.current   = e.clientX;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, prev, startAuto]);

  // named to avoid shadowing
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

/* ══════════════════════════════════════════════════════
   Product Card — memoized
══════════════════════════════════════════════════════ */
const ProductCard = memo(function ProductCard({
  product, index, onAddedToCart,
}: {
  product: Product;
  index: number;
  onAddedToCart: () => void | Promise<void>;
}) {
  const [hov, setHov] = useState(false);
  const soldOut = product.stock === 0;
  const router  = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleDetailsNavigate = useCallback(() => router.push(`/product/${product.slug}`), [router, product.slug]);

  const handleBuyNow = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!soldOut) router.push(`/product/${product.slug}`);
  }, [soldOut, router, product.slug]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (soldOut || isPending) return;
    addToCart(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: async (res: any) => {
          toast.success(res?.message || "Added to cart");
          await onAddedToCart();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to add to cart");
        },
      }
    );
  }, [soldOut, isPending, addToCart, product.id, onAddedToCart]);

  const shortTitle = product.title.split(" ").slice(0, 3).join(" ") +
    (product.title.split(" ").length > 3 ? "..." : "");
  const shortCardTitle = product.cardShortTitle?.length > 25
    ? product.cardShortTitle.slice(0, 25) + "..."
    : product.cardShortTitle;

  return (
    <div
      className="pp-card"
      style={{ animationDelay: `${index * 45}ms`, boxShadow: "0 12px 30px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.11)" }}
      onClick={handleDetailsNavigate}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="card-img-wrap">
        {product.productCardImage ? (
          <Image
            src={product.productCardImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`card-img${hov ? " card-img-hov" : ""}`}
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
      </div>

      <div className="card-info">
        <p className="card-title">{shortTitle}</p>
        {shortCardTitle && <span className="card-cat-tag">{shortCardTitle}</span>}
        <div className="card-price-row">
          <span className="card-price">৳ {product.price.toLocaleString()}</span>
        </div>
        <div className="card-actions">
          <button onClick={handleBuyNow} className="buy-btn" disabled={soldOut} style={{ opacity: soldOut ? 0.45 : 1 }}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
});

/* ══════════════════════════════════════════════════════
   Small reusable helpers
══════════════════════════════════════════════════════ */
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

const PgBtn = memo(({ active, disabled, onClick, children }: { active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} disabled={disabled} className={`pg-btn${active ? " pg-btn-active" : ""}${disabled ? " pg-btn-disabled" : ""}`}>
    {children}
  </button>
));
PgBtn.displayName = "PgBtn";

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

/* ══════════════════════════════════════════════════════
   Global CSS — all styles in one place, zero inline style objects at render time
══════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  @keyframes fadeUp       { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmerAnim  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ── Layout ── */
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

  /* ── Grid ── */
  .pp-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
  @media (min-width: 640px)  { .pp-grid { grid-template-columns: repeat(3,1fr); gap: 14px; } }
  @media (min-width: 1024px) { .pp-grid { grid-template-columns: repeat(4,1fr); gap: 16px; } }

  /* ── Card ── */
  .pp-card {
    background: #fff; border-radius: 12px; overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
    transition: transform .28s ease, box-shadow .28s ease;
    animation: fadeUp .35s ease both;
    cursor: pointer;
  }
  .pp-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.05); }
  .card-img-wrap { position: relative; aspect-ratio: 3/4; overflow: hidden; background: #f2f2f2; }
  .card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; pointer-events: none; }
  .card-img-hov  { transform: scale(1.06); }
  .card-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f5f5f5; }
  .card-dim-overlay  { position:absolute; inset:0; background:rgba(255,255,255,0.35); }
  .card-info { padding: 12px 11px; background:#fff; position:relative; z-index:2; box-shadow: 0 -12px 25px rgba(0,0,0,0.15); }
  .card-title { margin:0 0 6px; font-size:1.10rem; font-weight:900; color:#111; display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden; }
  .card-cat-tag { display:inline-block; font-size:0.75rem; padding:3px 7px; font-weight:600; letter-spacing:0.05em; color:black; opacity:0.6; margin-bottom:3px; }
  .card-price-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .card-price { font-family:sans-serif; font-weight:600; font-size:0.95rem; color:#111; }
  .card-actions { display:flex; align-items:center; gap:8px; width:100%; font-weight:700; }
  .buy-btn {
    flex:1; min-width:0; height:35px;
    border: 1px solid rgba(255,255,255,0.08); border-radius:10px;
    background: linear-gradient(180deg,#1f1f1f 0%,#0a0a0a 100%);
    color:#fff; font-size:0.60rem; font-weight:700; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    box-shadow: 0 10px 20px rgba(0,0,0,0.28), 0 3px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10);
    transition: all 0.25s ease;
  }
  .buy-btn:disabled { cursor:not-allowed; }

  /* ── Filter panel ── */
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

  /* ── Topbar controls ── */
  .filter-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; background:#111; color:#fff; border:none; border-radius:10px; font-size:0.82rem; font-family:'Syne',sans-serif; font-weight:600; cursor:pointer; }
  .count-dot  { display:inline-flex; align-items:center; justify-content:center; width:17px; height:17px; background:#e53e3e; color:#fff; border-radius:50%; font-size:0.62rem; font-weight:700; }
  .result-text { font-size:0.88rem; color:#555; margin:0; }
  .sort-select { padding:7px 12px; border:1.5px solid #e0e0e0; border-radius:8px; font-size:0.82rem; background:#fff; color:#111; cursor:pointer; outline:none; }

  /* ── Active filter chips ── */
  .active-chips { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
  .filter-tag  { display:inline-flex; align-items:center; gap:5px; padding:4px 10px 4px 12px; background:#111; color:#fff; border-radius:20px; font-size:0.73rem; }
  .tag-x       { background:none; border:none; color:#fff; cursor:pointer; font-size:0.62rem; padding:0; opacity:0.7; }

  /* ── Pagination ── */
  .pg-wrap { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:32px; flex-wrap:wrap; }
  .pg-btn  { padding:8px 14px; border:1.5px solid #e0e0e0; border-radius:8px; background:#fff; color:#444; font-size:0.82rem; cursor:pointer; transition:all 0.15s; }
  .pg-btn-active   { background:#111; color:#fff; border:1.5px solid #111; font-weight:600; }
  .pg-btn-disabled { opacity:0.35; cursor:not-allowed; }
  .pg-ellipsis     { padding:8px 4px; color:#aaa; font-size:0.82rem; }

  /* ── Drawer ── */
  .drawer-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.46); z-index:1000; display:flex; align-items:flex-end; }
  .drawer      { width:100%; max-height:88vh; background:#fff; border-radius:20px 20px 0 0; display:flex; flex-direction:column; }
  .drawer-head { display:flex; align-items:center; justify-content:space-between; padding:18px 18px 12px; border-bottom:1px solid #f0f0f0; }
  .drawer-body { overflow-y:auto; flex:1; padding:0 18px 24px; }
  .drawer-x    { background:none; border:none; font-size:1.1rem; color:#555; cursor:pointer; padding:4px; }

  /* ── Empty state ── */
  .empty-state { display:flex; flex-direction:column; align-items:center; padding:56px 20px; gap:10px; text-align:center; }
  .empty-text  { font-family:'Syne',sans-serif; font-weight:700; color:#333; margin:0; }

  /* ── Skeleton ── */
  .sk-base { background:linear-gradient(90deg,#f0f0f0 25%,#e6e6e6 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmerAnim 1.4s infinite; border-radius:0; }

  /* ── Category Slider ── */
  .sl-section  { padding:16px 16px 8px; user-select:none; -webkit-user-select:none; background:#f6f6f4; }
  .sl-header   { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .sl-title    { font-family:var(--font-poppins); font-size:1.2rem; font-weight:700; margin:0; color:#111; width:100%; }
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

  /* ── Responsive ── */
  .pp-mobile-filter-btn { display: none !important; }
  .pp-desktop-sort      { display: flex; align-items: center; gap: 8px; }

  @media (max-width: 860px) {
    .pp-mobile-cat        { display: block; }
    .pp-sidebar           { display: none !important; }
    .pp-mobile-filter-btn { display: flex !important; }
    .pp-desktop-sort      { display: none !important; }
  }
  @media (min-width: 861px) {
    .pp-mobile-cat { display: none; }
  }
`;