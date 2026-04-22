"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useGetMe } from "../../Apis/user/queries";
import { useUpdateUser } from "../../Apis/user/mutations";

export default function AdminDashboardProfile() {
  const { data, isLoading, isError } = useGetMe();
  const { mutateAsync, isPending } = useUpdateUser();

  const user = data?.data;
  const isLoggedIn = !!user?.id;

  const initials = useMemo(
    () =>
      user?.name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part[0]?.toUpperCase())
        .join("") || "U",
    [user?.name]
  );

  const [openEditModal, setOpenEditModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!user) return;

    setFullName(user.fullName || "");
    setPhone(user.phone || "");
    setCountry(user.country || "");
    setCity(user.city || "");
    setArea(user.area || "");
    setAddressLine(user.addressLine || "");
    setPreviewImage(user.profileImage || "");
  }, [user, openEditModal]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("phone", phone);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("area", area);
      formData.append("addressLine", addressLine);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await mutateAsync({
        id: user.id,
        data: formData,
      });

      setOpenEditModal(false);
      alert(res?.data?.message || "Profile updated successfully");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-24 w-24 rounded-full bg-rose-100" />
          <div className="h-6 w-40 rounded bg-zinc-200" />
          <div className="h-4 w-32 rounded bg-zinc-200" />
          <div className="w-full h-12 rounded-2xl bg-zinc-200" />
        </div>
      </div>
    );
  }

  if (isError || !isLoggedIn) {
    return (
      <div className="w-full rounded-3xl border border-rose-100 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-zinc-800">
          You are not logged in
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          Login to view your profile, orders and account details.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-rose-500 px-6 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Main Profile Card */}
      <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-[2rem] border border-rose-100 bg-white shadow-[0_20px_50px_rgba(236,72,153,0.15)]">
        {/* Soft Gradient Background for Header */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-rose-50 to-transparent pointer-events-none" />

        <div className="relative flex flex-col items-center pt-8 pb-6 px-6">
          {/* Profile Image */}
          <div className="relative mb-4">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-rose-100 shadow-md overflow-hidden">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-rose-400">
                  {initials}
                </span>
              )}
            </div>
            {/* Online Status Dot */}
            {user.status === "active" && (
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>

          {/* User Info */}
          <h2 className="text-xl font-bold text-zinc-800 tracking-tight">
            {user.fullName || user.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {user.email || "Member"}
          </p>

          {/* Role Badge */}
          {user.role && (
            <span className="mt-3 inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 border border-rose-100">
              {user.role}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={() => setOpenEditModal(true)}
            className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-rose-500/25 active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            <span>Edit your profile</span>
          </button>

          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>Share Profile</span>
          </button>
        </div>

        {/* Details List */}
        <div className="border-t border-zinc-100 px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">City</span>
            <span className="text-sm font-bold text-zinc-800">
              {user.city || "Not set"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Country</span>
            <span className="text-sm font-bold text-zinc-800">
              {user.country || "Not set"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
            <span className="text-sm font-medium text-zinc-500">Area</span>
            <span className="text-sm font-bold text-zinc-800">
              {user.area || "Not set"}
            </span>
          </div>

          <div className="pt-2 border-t border-zinc-50">
            <span className="text-sm font-medium text-zinc-500 block mb-1">
              Full Address
            </span>
            <p className="text-sm font-semibold text-zinc-800 text-right">
              {user.addressLine || "No address added yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Redesigned Modal */}
      {openEditModal && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-0">
          <div className="w-full max-w-md animate-in slide-in-from-bottom-5 fade-in bg-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white px-6 py-4">
              <h3 className="text-lg font-bold text-zinc-800">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setOpenEditModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600 hover:bg-zinc-50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[80vh] overflow-y-auto p-6">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-rose-100 shadow-lg">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-rose-300">
                      {initials}
                    </span>
                  )}
                </div>

                <label className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-800 hover:border-zinc-300">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>

                {/* Country & City */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                      className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                    />
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">
                    Area
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Enter area"
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>

                {/* Address Line */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">
                    Address Line
                  </label>
                  <textarea
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Enter detailed address"
                    rows={3}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10 resize-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 pt-2">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  disabled={isPending}
                  className="w-full h-12 rounded-full bg-zinc-900 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none active:scale-[0.98]"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}