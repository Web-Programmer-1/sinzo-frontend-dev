"use client";

import { useState } from "react";
import { X, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { updateOrderCustomerInfo } from "../../Apis/order";


interface CustomerUpdateModalProps {
  order:any; 
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomerUpdateModal({
  order,
  isOpen,
  onClose,
  onSuccess,
}: CustomerUpdateModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: order.fullName || "",
    phone: order.phone || "",
    email: order.email || "",
    addressLine: order.addressLine || "",
    deliveryArea: order.deliveryArea || "INSIDE_CITY",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      await updateOrderCustomerInfo(order.id, {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || undefined,
        addressLine: formData.addressLine,
        deliveryArea: formData.deliveryArea,
      });

      toast.success("Customer information updated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update customer info");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
              <User className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Update Customer Info</h2>
              <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-black outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              placeholder="Enter customer full name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-black outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              placeholder="01XXXXXXXXX"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-black outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              placeholder="customer@example.com"
            />
            <p className="mt-1 text-xs text-gray-500">Optional for guest orders</p>
          </div>

          {/* Delivery Area */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Delivery Area <span className="text-rose-500">*</span>
            </label>
            <select
              name="deliveryArea"
              value={formData.deliveryArea}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-black outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 bg-white"
            >
              <option value="INSIDE_CITY">Inside City</option>
              <option value="OUTSIDE_CITY">Outside City</option>
            </select>
          </div>

          {/* Address Line */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Address Line <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-black outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 resize-none"
              placeholder="Enter complete delivery address"
            />
          </div>

          {/* Guest ID Display */}
          {order.guestId && (
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-500">Guest ID</p>
              <p className="text-sm font-semibold text-gray-700 font-mono">{order.guestId}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Customer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}