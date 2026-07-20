"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { X, CheckCircle, Package, Truck, CreditCard } from "lucide-react";

type OrderSuccessData = {
  orderNumber?: string;
  fullName: string;
  phone: string;
  addressLine: string;
  deliveryArea: "INSIDE_CITY" | "OUTSIDE_CITY";
  paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
  paymentGateway?: string;
  deliveryCharge: number;
};

type OrderSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderSuccessData | null;
};

const CELEBRATION_SOUND_URL =
  "data:audio/wav;base64,UklGRl9vT19teleGFtcGxlAAAA";

const playSuccessSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    const playTone = (freq: number, start: number, dur: number, gain: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      osc.type = "sine";
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };

    playTone(523.25, 0, 0.15, 0.3);
    playTone(659.25, 0.12, 0.15, 0.3);
    playTone(783.99, 0.24, 0.15, 0.3);
    playTone(1046.5, 0.36, 0.4, 0.25);

    playTone(392, 0, 0.5, 0.08);
    playTone(523.25, 0, 0.5, 0.08);

    setTimeout(() => ctx.close(), 2000);
  } catch {
  }
};

const fireConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ["#4ade80", "#22c55e", "#16a34a", "#fbbf24", "#f59e0b"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ["#4ade80", "#22c55e", "#16a34a", "#fbbf24", "#f59e0b"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#4ade80", "#22c55e", "#16a34a", "#fbbf24", "#f59e0b", "#ffffff"],
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.65 },
      colors: ["#4ade80", "#22c55e", "#fbbf24"],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.65 },
      colors: ["#4ade80", "#22c55e", "#fbbf24"],
    });
  }, 400);

  setTimeout(frame, 800);
};

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderData,
}) => {
  const router = useRouter();
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      const timer = setTimeout(() => {
        fireConfetti();
        playSuccessSound();
      }, 300);
      return () => clearTimeout(timer);
    }
    if (!isOpen) {
      hasPlayedRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
    router.push("/userDashboard/order");
  }, [onClose, router]);

  if (!isOpen || !orderData) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        style={{ animation: "osm-fadeIn 0.3s ease-out" }}
      />

      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ animation: "osm-slideUp 0.5s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-gray-500 transition-all hover:bg-black/10 hover:text-gray-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-emerald-50/50 to-white px-6 pb-2 pt-10 text-center">
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: "200px",
              height: "60px",
              opacity: 0.15,
              background:
                "radial-gradient(ellipse at center, #22c55e 0%, transparent 70%)",
            }}
          />

          <svg
            viewBox="0 0 300 50"
            className="mx-auto mb-2 w-56 opacity-20"
            fill="none"
          >
            <path
              d="M20 25 C60 10, 80 5, 100 15 C120 25, 130 10, 150 25 C170 40, 190 10, 200 15 C220 20, 240 10, 280 25"
              stroke="#22c55e"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="50" cy="18" r="3" fill="#22c55e" opacity="0.4" />
            <circle cx="90" cy="12" r="2" fill="#4ade80" opacity="0.5" />
            <circle cx="150" cy="22" r="4" fill="#22c55e" opacity="0.3" />
            <circle cx="210" cy="14" r="2.5" fill="#4ade80" opacity="0.4" />
            <circle cx="250" cy="20" r="3" fill="#22c55e" opacity="0.3" />
            <path
              d="M70 15 Q75 8 80 15 M130 18 Q135 11 140 18 M220 16 Q225 9 230 16"
              stroke="#86efac"
              strokeWidth="1"
              fill="none"
            />
          </svg>

          <div
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-200"
            style={{ animation: "osm-bounceIn 0.6s cubic-bezier(0.68,-0.55,0.265,1.55) 0.2s both" }}
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </div>

          <h2
            className="mb-1 text-3xl font-bold tracking-tight text-gray-900"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              animation: "osm-fadeInUp 0.5s ease-out 0.3s both",
            }}
          >
            Thank You!
          </h2>
          <p
            className="mb-1 text-sm text-gray-500"
            style={{ animation: "osm-fadeInUp 0.5s ease-out 0.4s both" }}
          >
            Your order has been received
          </p>

          <div
            className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5"
            style={{ animation: "osm-fadeInUp 0.5s ease-out 0.5s both" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              Congratulations! Order confirmed
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Order Details
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="space-y-0 divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <Package className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-gray-400">Customer</p>
                <p className="text-sm font-semibold text-gray-900">
                  {orderData.fullName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-gray-400">Delivery</p>
                <p className="text-sm font-semibold text-gray-900">
                  {orderData.deliveryArea === "INSIDE_CITY"
                    ? "Inside Dhaka"
                    : "Outside Dhaka"}
                  <span className="ml-1.5 text-xs font-normal text-gray-400">
                    (৳{orderData.deliveryCharge})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <CreditCard className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-gray-400">Payment</p>
                <p className="text-sm font-semibold text-gray-900">
                  {orderData.paymentMethod === "CASH_ON_DELIVERY"
                    ? "Cash on Delivery"
                    : `Online Payment (${orderData.paymentGateway === "BKASH" ? "bKash" : "Nagad"})`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="h-4 w-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-gray-400">Address</p>
                <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                  {orderData.addressLine}
                </p>
              </div>
            </div>
          </div>

          {orderData.orderNumber && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2.5 ring-1 ring-emerald-200">
              <span className="text-xs font-medium text-emerald-600">
                Order Number
              </span>
              <span className="font-mono text-sm font-bold text-emerald-700">
                #{orderData.orderNumber}
              </span>
            </div>
          )}

          <button
            onClick={handleClose}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-gray-900/20 transition-all hover:bg-black hover:shadow-xl hover:shadow-gray-900/30 active:scale-[0.98]"
          >
            Go to My Orders
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            You will be redirected to your order dashboard
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes osm-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes osm-slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes osm-bounceIn {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes osm-fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessModal;
