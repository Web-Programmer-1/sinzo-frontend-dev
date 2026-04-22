"use client";

import { useState } from "react";
import { UpdateCustomerInfoPayload, updateOrderCustomerInfo } from "../../Apis/order";

interface CustomerOrderUpdateProps {
  order: any;
  onSuccess?: () => void;
}

export default function CustomerOrderUpdate({ order, onSuccess }: CustomerOrderUpdateProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateCustomerInfoPayload>({
    fullName: order.fullName,
    phone: order.phone,
    email: order.email || "",
    country: order.country || "",
    city: order.city || "",
    area: order.area || "",
    addressLine: order.addressLine,
    deliveryArea: order.deliveryArea,
    note: order.note || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateOrderCustomerInfo(order.id, formData);
      setSuccess("Customer information updated successfully!");
      setIsEditing(false);
      onSuccess?.(); // Parent কে নোটিফাই করুন যাতে ডেটা রিফ্রেশ হয়
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update customer info");
    } finally {
      setIsLoading(false);
    }
  };

// যখন isEditing === false, তখন যে বাটনটি রেন্ডার হয়:

if (!isEditing) {
  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-violet-600 hover:to-purple-700 transition"
    >
      ✏️ Edit Info
    </button>
  );
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-black/10 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-black">Update Customer Info</h4>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-sm text-gray-500 hover:text-black"
        >
          ✕ Cancel
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Delivery Area</label>
          <select
            name="deliveryArea"
            value={formData.deliveryArea}
            onChange={handleChange}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="INSIDE_CITY">Inside City</option>
            <option value="OUTSIDE_CITY">Outside City</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Address Line</label>
          <textarea
            name="addressLine"
            value={formData.addressLine}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Area</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Optional note for this order..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:border-black"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}