


"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Trash2,
  ArrowRight,
  Package,
} from "lucide-react";
import {
  useClearMyCart,
  useGetMyCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "../../Apis/cart";

type TCartProduct = {
  id: string;
  title: string;
  price: number;
  productCardImage?: string | null;
};

type TCartItem = {
  id: string;
  guestId: string;
  productId: string;
  quantity: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
  createdAt: string;
  updatedAt: string;
  product: TCartProduct;
};

type TCartSummary = {
  subtotal: number;
  totalItems: number;
  totalUniqueItems: number;
};

type TCartResponse = {
  success: boolean;
  message: string;
  meta: null;
  data: {
    items: TCartItem[];
    summary: TCartSummary;
  };
};

export default function CartPage() {
  const { data, isLoading, isError } = useGetMyCart();

  const { mutate: updateCartItem, isPending: isUpdatingCart } =
    useUpdateCartItem();
  const { mutate: removeCartItem, isPending: isRemovingCartItem } =
    useRemoveCartItem();
  const { mutate: clearMyCart, isPending: isClearingCart } = useClearMyCart();

  const cartData = data as TCartResponse | undefined;
  const items = cartData?.data?.items || [];
  const summary = cartData?.data?.summary;

  const handleIncrease = (item: TCartItem) => {
    updateCartItem(
      {
        cartId: item.id,
        payload: {
          quantity: item.quantity + 1,
          selectedColor: item.selectedColor || undefined,
          selectedSize: item.selectedSize || undefined,
        },
      },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Cart updated successfully");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to update cart item"
          );
        },
      }
    );
  };

  const handleDecrease = (item: TCartItem) => {
    if (item.quantity <= 1) {
      removeCartItem(item.id, {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Item removed from cart");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to remove cart item"
          );
        },
      });
      return;
    }

    updateCartItem(
      {
        cartId: item.id,
        payload: {
          quantity: item.quantity - 1,
          selectedColor: item.selectedColor || undefined,
          selectedSize: item.selectedSize || undefined,
        },
      },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Cart updated successfully");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to update cart item"
          );
        },
      }
    );
  };

  const handleRemove = (cartId: string) => {
    removeCartItem(cartId, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Item removed from cart");
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to remove cart item"
        );
      },
    });
  };

  const handleClearCart = () => {
    clearMyCart(undefined, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Cart cleared successfully");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to clear cart");
      },
    });
  };

  if (isLoading) return <CartPageSkeleton />;

  if (isError) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f5f5,_#ececec_45%,_#e6e6e6)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[28px] border border-white/60 bg-white/70 p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-neutral-900">
              Failed to load cart
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Please try again in a moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f5f5,_#ececec_45%,_#e6e6e6)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl ">
          <div className="rounded-[32px] border border-white/70 bg-white/65 p-8 text-center shadow-[0_16px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-black text-white shadow-lg">
              <ShoppingBag className="h-6 w-6" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500 sm:text-base">
              Looks like you haven’t added anything yet. Start exploring and add
              your favorite products to cart.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#fafafa,_#f0f0f0_40%,_#ebebeb)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              Shopping Cart
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Your Cart
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {summary?.totalItems || 0} item
              {summary?.totalItems === 1 ? "" : "s"} in your cart
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/70 bg-white/70 px-5 text-sm font-medium text-neutral-700 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-black"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_370px] xl:grid-cols-[1fr_400px]">
          <div className="space-y-5">
            {items.map((item) => {
              const lineTotal = item.quantity * item.product.price;

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[30px] border border-white/70 bg-white/65 shadow-[0_12px_45px_rgba(0,0,0,0.07)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5 md:p-6">
                    <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-[24px] border border-black/5 bg-white sm:h-36 sm:w-36 md:h-40 md:w-40">
                      {item.product.productCardImage ? (
                        <Image
                          src={item.product.productCardImage}
                          alt={item.product.title}
                          fill
                          className="object-contain transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 160px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-400">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-semibold text-neutral-900 sm:text-xl">
                            {item.product.title}
                          </h2>

                          <div className="mt-3 flex flex-wrap gap-2.5">
                            {item.selectedColor && (
                              <span className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-xl">
                                Color: {item.selectedColor}
                              </span>
                            )}

                            {item.selectedSize && (
                              <span className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-xl">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        </div>
{/* 
                        <div className="shrink-0 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-left shadow-sm backdrop-blur-xl sm:min-w-[120px] sm:text-right">
                          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                            Price
                          </p>
                          <p className="mt-1 text-xl font-semibold text-neutral-900">
                            ৳{item.product.price.toLocaleString()}
                          </p>
                        </div> */}
                      </div>

                      <div className="flex flex-col gap-4 border-t border-black/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center rounded-full border border-white/80 bg-white/80 shadow-sm backdrop-blur-xl">
                            <button
                              type="button"
                              onClick={() => handleDecrease(item)}
                              disabled={isUpdatingCart || isRemovingCartItem}
                              className="flex h-11 w-11 items-center justify-center rounded-l-full text-neutral-700 transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <div className="flex h-11 min-w-[54px] items-center justify-center border-x border-black/5 px-3 text-sm font-semibold text-neutral-900">
                              {item.quantity}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleIncrease(item)}
                              disabled={isUpdatingCart}
                              className="flex h-11 w-11 items-center justify-center rounded-r-full text-neutral-700 transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="inline-flex items-center rounded-full border border-white/70 bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-md">
                            Total: {lineTotal.toLocaleString()}-BDT
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          disabled={isRemovingCartItem}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/90 px-4 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-[30px] border border-white/70 bg-white/65 p-5 shadow-[0_12px_45px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  Summary
                </p>
                <h3 className="mt-1 text-xl font-semibold text-neutral-900">
                  Order Summary
                </h3>
              </div>

              <div className="rounded-full border border-black/10 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                Cart
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm shadow-sm">
                <span className="text-neutral-500">Total Items</span>
                <span className="font-semibold text-neutral-900">
                  {summary?.totalItems || 0}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm shadow-sm">
                <span className="text-neutral-500">Unique Products</span>
                <span className="font-semibold text-neutral-900">
                  {summary?.totalUniqueItems || 0}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm shadow-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-semibold text-neutral-900">
                  ৳{summary?.subtotal?.toLocaleString() || 0}
                </span>
              </div>

              {/* <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm shadow-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-semibold text-emerald-600">
                  Calculated later
                </span>
              </div> */}
            </div>

            <div className="my-6 h-px bg-black/10" />

            <div className="rounded-[24px] bg-black px-5 py-5 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Estimated Total</span>
                <span className="text-2xl font-bold tracking-tight">
                  {summary?.subtotal?.toLocaleString() || 0} BDT
                </span>
              </div>
            </div>

            {/* <button
              type="button"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button> */}

            <button
              type="button"
              onClick={handleClearCart}
              disabled={isClearingCart}
              className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-white/80 bg-white/80 px-6 text-sm font-semibold text-neutral-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isClearingCart ? "Clearing..." : "Clear Cart"}
            </button>

        
          </aside>
        </div>
      </div>
    </section>
  );
}

function CartPageSkeleton() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#fafafa,_#f0f0f0_40%,_#ebebeb)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8">
          <div className="h-3 w-28 rounded-full bg-neutral-200" />
          <div className="mt-3 h-9 w-44 rounded-full bg-neutral-200" />
          <div className="mt-3 h-4 w-52 rounded-full bg-neutral-200" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_370px] xl:grid-cols-[1fr_400px]">
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-[30px] border border-white/70 bg-white/65 p-5 shadow-[0_12px_45px_rgba(0,0,0,0.07)] backdrop-blur-2xl"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="h-36 w-full rounded-[24px] bg-neutral-200 sm:w-36" />
                  <div className="flex-1 space-y-4">
                    <div className="h-5 w-44 rounded-full bg-neutral-200" />
                    <div className="flex gap-2">
                      <div className="h-8 w-20 rounded-full bg-neutral-200" />
                      <div className="h-8 w-16 rounded-full bg-neutral-200" />
                    </div>
                    <div className="h-10 w-24 rounded-2xl bg-neutral-200" />
                    <div className="h-px w-full bg-neutral-200" />
                    <div className="flex gap-3">
                      <div className="h-11 w-32 rounded-full bg-neutral-200" />
                      <div className="h-11 w-24 rounded-full bg-neutral-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[30px] border border-white/70 bg-white/65 p-6 shadow-[0_12px_45px_rgba(0,0,0,0.07)] backdrop-blur-2xl">
            <div className="h-6 w-36 rounded-full bg-neutral-200" />
            <div className="mt-6 space-y-3">
              <div className="h-12 w-full rounded-2xl bg-neutral-200" />
              <div className="h-12 w-full rounded-2xl bg-neutral-200" />
              <div className="h-12 w-full rounded-2xl bg-neutral-200" />
            </div>
            <div className="my-6 h-px bg-neutral-200" />
            <div className="h-20 w-full rounded-[24px] bg-neutral-200" />
            <div className="mt-6 h-12 w-full rounded-full bg-neutral-200" />
            <div className="mt-3 h-12 w-full rounded-full bg-neutral-200" />
          </div>
        </div>
      </div>
    </section>
  );
}